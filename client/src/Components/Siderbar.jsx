import React, { useState, useEffect } from 'react';

const Sidebar = () => {
  const [data, setData] = useState(null); // State to store fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/usermsg", {
          method: "GET",
          credentials: "include", 
        });
        
        
        // Replace with your API URL
        const result = await response.json();
        console.log('Fetched Data:', result); // Console log the fetched data
        setData(result); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the function when the component mounts
  }, []);

  return (
    <div>
      <h1 className='px-5'>Sidebar</h1>
      <div className='border px-5 py-3'>
        {data ? <h1>{data.name}</h1> : <h1>Loading...</h1>} {/* Render data if available */}
      </div>
    </div>
  );
};

export default Sidebar;