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




const Home = () => {
  const [sidebarWidth, setSidebarWidth] = useState(100);
  const [middleWidth, setMiddleWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [resizerType, setResizerType] = useState(null);

  const minSidebarWidth = 100;
  const maxSidebarWidth = 120;
  const minMiddleWidth = 650;
  const maxMiddleWidth = 950;


  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 123 456 7890",
    address: "123 Main Street, City, Country",
    bio: "Software Developer | Tech Enthusiast | Lifelong Learner",
    profileImage: "https://via.placeholder.com/150", // Replace with actual user image
  };


  

  // Auto-scroll to latest message
 

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
      <div className="  text-black text-lg font-semibold py-6 px-10  flex items-center justify-between ">
        <h1 className="text-4xl text-black  font-medium">Profile</h1>
        <IoSettings className="size-8"/>
        
      </div>

      
      
    </div>
    </div>
  );
};

export default Home;