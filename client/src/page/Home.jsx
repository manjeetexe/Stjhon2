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
      const response = await fetch("http://localhost:5000/chat", {  // Replace with your API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
  
      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 2, text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 2, text: "Error connecting to server.", sender: "bot" },
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
          <RiGlobalFill className="size-7"/>
          <IoPerson className="size-7"/>
          <IoChatbubbleEllipsesSharp className="size-7" />
          <IoHomeSharp className="size-7"/>
          <MdMessage className="size-7"/>

        </div>

        <div className="flex flex-col gap-5">
        <IoIosNotifications className="size-7"/>
        
          <IoSettings className="size-7"/>
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

        <h1 className="text-xl mt-10">History</h1>

        <div className="w-full mt-10 h-90 rounded-2xl bg-white">

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
      <div className="  text-black text-lg font-semibold py-6 px-20  flex items-center justify-between ">
        <h1 className="text-2xl text-black  font-medium">Nexido</h1>
        <IoSettings className="size-6"/>
        
      </div>

      {/* Chat Messages */}
      <div ref={chatRef} className="flex flex-col gap-2 flex-grow overflow-y-auto px-20 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 max-w-[75%] text-white text-sm shadow-md backdrop-blur-lg ${
              msg.sender === "user"
                ? "bg-black self-end rounded-2xl rounded-br-2xl rounded-bl-2xl"
                : "bg-black self-start rounded-2xl rounded-bl-2xl rounded-br-2xl"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="flex items-center p-4 px-20 bg-gray-100 shadow-md sticky bottom-0">
      <input
          className="flex-grow p-3 px-8 rounded-full border text-black bg-white border-gray-300 focus:outline-none focus:ring-[1px] focus:ring-black shadow-md"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          className="ml-3 bg-black text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
          onClick={sendMessage}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
    </div>
  );
};

export default Home;