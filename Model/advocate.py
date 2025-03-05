from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv
import json
import re

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Restrict methods if needed
    allow_headers=["*"],  
)

# Get API key from environment variables
api_key = os.getenv("ADVOCATE_API_KEY")  # Store API key in .env for security
if not api_key:
    raise ValueError("API Key is missing! Set ADVOCATE_API_KEY in .env file.")

# Initialize the "Advocate" RAG model
advocate_llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=api_key
)

# Chat history storage
chat_history = []

class QueryRequest(BaseModel):
    query: str

def ask_advocate(question):
    global chat_history
    history_text = "\n".join([f"User: {h['user']}\nAI: {h['ai']}" for h in chat_history])
    
    full_prompt = f"""{history_text}
    User: {question}
    AI: Provide a relevant legal explanation, laws, or guidance in JSON format:
    
    {{
        "context": "Brief background on the legal matter.",
        "relevant_laws": ["Law 1", "Law 2", ...],
        "step_by_step_guidance": [
            "Step 1: What the user should do.",
            "Step 2: Next legal step.",
            ...
        ],
        "final_advice": "Summarized legal guidance."
    }}
    
    Ensure the response is a valid JSON object.
    """

    try:
        response = advocate_llm.invoke(full_prompt)
        
        if not response or not hasattr(response, "content") or not response.content.strip():
            return {"error": "AI could not generate a response. Try rephrasing your query."}
        
        ai_response = response.content.strip()

        # Extract JSON content if it's wrapped in code blocks
        if "```json" in ai_response:
            json_match = re.search(r'```json\s*(.*?)\s*```', ai_response, re.DOTALL)
            if json_match:
                ai_response = json_match.group(1)
        
        # Ensure the response is valid JSON
        try:
            structured_response = json.loads(ai_response)
        except json.JSONDecodeError:
            return {"error": "AI response is not in valid JSON format."}
        
        # Append to chat history
        chat_history.append({"user": question, "ai": structured_response})
        return structured_response
    except Exception as e:
        print("Error calling Advocate API:", str(e))
        return {"error": f"An error occurred while processing your request: {str(e)}"}

@app.get("/")
def home():
    return {"message": "Advocate RAG Model is running!"}

@app.post("/ask")
def ask_legal_question(request: QueryRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    response = ask_advocate(request.query)
    
    return {"response": response}