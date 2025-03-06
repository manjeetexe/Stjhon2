import React, { useState, useEffect } from "react";

const Sidebar = ({ onUserSelect }) => {
  const [data, setData] = useState([]); // Store captains list

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/usermsg", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
        setData(Array.isArray(result) ? result : []); // Ensure result is an array
      } catch (error) {
        console.error("Error fetching captains:", error);
      }
    };

    fetchCaptains();
  }, []);

  return (
    <div className="w-1/3 border-r">
      <h1 className="px-5 pb-6 border-b">Captains</h1>
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