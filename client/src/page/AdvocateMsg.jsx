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
import AdvocateSidebar from "../Components/advocateSidebar";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 




const Home = () => {
  const [sidebarWidth, setSidebarWidth] = useState(100);
  const [middleWidth, setMiddleWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [resizerType, setResizerType] = useState(null);
  

  const minSidebarWidth = 100;
  const maxSidebarWidth = 120;
  const minMiddleWidth = 650;
  const maxMiddleWidth = 950;

  
  const [input, setInput] = useState("");
  const chatRef = useRef(null);


  const [selectedUser, setSelectedUser] = useState(null); // Store selected user
  const [messages, setMessages] = useState([]); // Store messages

  // Fetch messages when a user is selected
  const fetchMessages = async (userChatId) => {
    setSelectedUser(userChatId);
    console.log("Fetching messages for:", userChatId);

    try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        // Decode the token
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const advocateId = decodedToken._id; // Extract user ID from the token

        // Send userId as a query parameter
        const response = await axios.get(`http://localhost:4000/api/${userChatId}?advocateId=${advocateId}`);

        console.log("Messages:", response.data);
        setMessages(response.data);
    } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message);
    }
};

  

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
  
    try {
      const response = await fetch(`http://localhost:4000/api/captain/send/${selectedUser}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
  
      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]); // Append new message
        setInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
          <Link to='/advocatesearch'><RiGlobalFill className="size-7"/></Link>
          <Link to='/advocateprofile'><IoPerson className="size-7"/></Link>
          <Link to='/home'><IoChatbubbleEllipsesSharp className="size-7" /></Link>
          <Link to='/'><IoHomeSharp className="size-7"/></Link>
          <Link to='/advocatemsg'><MdMessage className="size-7"/></Link>
          
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
      <div style={{ width: middleWidth }} className="h-screen py-6  bg-gray-100">

      <AdvocateSidebar onUserSelect={fetchMessages} />
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
      <div ref={chatRef} className="flex flex-col flex-grow overflow-y-auto px-16">
  <div className="px-5">
    <div className="h-[400px] overflow-y-auto border p-3 bg-white rounded-lg shadow-md">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={msg._id} // Use `_id` instead of `index` for better performance
            className={`flex my-2 ${msg.senderId === selectedUser ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                msg.senderId === selectedUser ? "bg-gray-200 text-black" : "bg-black text-white"
              }`}
            >
              <p className="text-sm">{msg.text}</p> {/* Use msg.text instead of msg.message */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No messages yet...</p>
      )}
    </div>
  </div>
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