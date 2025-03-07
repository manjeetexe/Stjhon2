import React, { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = ({ onUserSelect }) => {
  const [data, setData] = useState([]); // Store captains list

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
    
        const response = await axios.get("http://localhost:4000/api/usermsg", {
          withCredentials: true, // Include cookies if required
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        });

        console.log(response.data)
    
        setData(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching captains:", error);
      }
    };

    fetchCaptains();
  }, []);

  return (
    <div className=" ">
      <h1 className="px-5 pb-6 border-b">Advocates</h1>
      <div>
        {data.length > 0 ? (
          data.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelect(user._id)} // Pass selected user ID to parent
              className="flex gap-2 px-5 py-2 border-b text-lg font-medium cursor-pointer hover:bg-gray-200"
            >
              <h1>{user.fullname.firstname}</h1>
              <h1>{user.fullname.lastname}</h1>
            </div>
          ))
        ) : (
          <h1 className="px-5 py-2">Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default Sidebar;