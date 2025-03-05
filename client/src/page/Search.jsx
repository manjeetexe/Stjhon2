import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import Logo from './../../public/N/2.png'
import { IoIosNotifications } from "react-icons/io";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { RiGlobalFill } from "react-icons/ri";
import { IoHomeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Advocate from './../Components/Advocate'



const Home = () => {
  const [sidebarWidth, setSidebarWidth] = useState(100);
  const [middleWidth, setMiddleWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [resizerType, setResizerType] = useState(null);

  const minSidebarWidth = 100;
  const maxSidebarWidth = 120;
  const minMiddleWidth = 650;
  const maxMiddleWidth = 950;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === "") return;
  
    // Add user message to chat immediately
    const newMessage = { id: messages.length + 1, text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
  
    try {
      // Send user message to backend
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });
    
      console.log("Response Status:", response.status);
    
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
    
      const data = await response.json();
      console.log("Response Data:", data);
    
      if (!data.response) {
        throw new Error("Invalid response from server.");
      }
    
      let botReply = (
        <div>
          {/* If response is a string, just display it */}
          {typeof data.response === "string" ? (
            <p className="text-lg font-semibold">{data.response}</p>
          ) : (
            // If response is an object, display structured content
            <div>
              {data.response.context && (
                <div>
                  <h1 className="text-xl font-bold text-blue-600">📝 Context:</h1>
                  <p className="text-lg">{data.response.context}</p>
                </div>
              )}
    
              {data.response.relevant_laws?.length > 0 && (
                <div>
                  <h1 className="text-xl font-bold text-green-600">📜 Relevant Laws:</h1>
                  <ul className="list-disc pl-5">
                    {data.response.relevant_laws.map((law, index) => (
                      <li key={index} className="text-lg">{law}</li>
                    ))}
                  </ul>
                </div>
              )}
    
              {data.response.step_by_step_guidance?.length > 0 && (
                <div>
                  <h1 className="text-xl font-bold text-purple-600">📌 Step-by-Step Guidance:</h1>
                  <ul className="list-decimal pl-5">
                    {data.response.step_by_step_guidance.map((step, index) => (
                      <li key={index} className="text-lg font-medium mt-2">Step {index + 1}: {step}</li>
                    ))}
                  </ul>
                </div>
              )}
    
              {data.response.final_advice && (
                <div>
                  <h1 className="text-xl font-bold text-red-600">💡 Final Advice:</h1>
                  <p className="text-lg">{data.response.final_advice}</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    
      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 2, text: botReply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error.message);
    
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 2, text: <p className="text-red-600">⚠️ Error connecting to server.</p>, sender: "bot" },
      ]);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      if (resizerType === "left") {
        setSidebarWidth((prev) =>
          Math.min(maxSidebarWidth, Math.max(minSidebarWidth, prev + e.movementX))
        );
      }
      if (resizerType === "right") {
        setMiddleWidth((prev) =>
          Math.min(maxMiddleWidth, Math.max(minMiddleWidth, prev + e.movementX))
        );
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizerType(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizerType]);

  return (
    <div className="h-screen flex w-screen select-none">
      {/* Left Sidebar */}
      <div style={{ width: sidebarWidth }} className="h-screen py-4 pb-10 flex flex-col justify-between items-center   px-2 bg-white">
        <div>
          <img src={Logo} alt="" />
        </div>

        <div className="flex flex-col gap-14">
          <Link to='/search'><RiGlobalFill className="size-7"/></Link>
          <Link to='/userprofile'><IoPerson className="size-7"/></Link>
          <Link to='/home'><IoChatbubbleEllipsesSharp className="size-7" /></Link>
          <Link to='/'><IoHomeSharp className="size-7"/></Link>
          <Link to='/msg'><MdMessage className="size-7"/></Link>
          
        </div>

        <div className="flex flex-col gap-5">
        <Link to='/notification'><IoIosNotifications className="size-7"/></Link>
        
          <Link to='/setting'><IoSettings className="size-7"/></Link>
        </div>
        

      </div>

      {/* Resizer (Sidebar -> Middle Section) */}
      <div
        className="w-[3px] cursor-ew-resize bg-gray-500"
        onMouseDown={() => {
          setIsResizing(true);
          setResizerType("left");
        }}
      ></div>

      {/* Middle Section */}
      <div style={{ width: middleWidth }} className="h-screen py-6 px-5 bg-gray-100">

        <h1 className="text-3xl">Chat</h1>

        <button className="text-white bg-black text-lg flex w-full mt-10 justify-center items-center rounded-lg  py-2 px-10 ">
          <h1>New Chat</h1>
        </button>


        <button className="text-white bg-black text-lg flex w-full mt-2 justify-center items-center rounded-lg  py-2 px-10 ">
          <h1>Connect to  Advocate</h1>
        </button>

        <h1 className="text-xl mt-10">Favroute</h1>

        <div className="w-full mt-5 h-90 rounded-2xl bg-white">

        </div>







      </div>

      {/* Resizer (Middle Section -> Main Section) */}
      <div
        className="w-[3px] cursor-ew-resize bg-gray-500"
        onMouseDown={() => {
          setIsResizing(true);
          setResizerType("right");
        }}
      ></div>

      {/* Main Chat Section */}
      <div className="h-screen w-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="  text-black text-lg font-semibold py-6 px-5  flex items-center justify-between ">
        <h1 className="text-4xl text-black  font-medium">Recommender Advocates</h1>
        <IoSettings className="size-8"/>
        
      </div>

      {/* Chat Messages */}
      <div className="grid grid-cols-3 px-5 h-screen overflow-y-auto pb-10 mt-5  gap-6">
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
        <Advocate />
      </div>

      {/* Input Section */}
      
    </div>
    </div>
  );
};

export default Home;