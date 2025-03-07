import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const userData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
    };

    try {
      const response = await axios.post("http://localhost:4000/users/register", userData, {
        withCredentials: true, // Ensures cookies are included if needed
        headers: { "Content-Type": "application/json" },
        
      });
    
      console.log(response.data); // Logging response data
    
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    
      setSuccess("User registered successfully!");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to the server");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 border border-white rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">User Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 bg-black border border-white rounded-md text-white placeholder-gray-400"
            minLength="3"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 bg-black border border-white rounded-md text-white placeholder-gray-400"
            minLength="3"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-black border border-white rounded-md text-white placeholder-gray-400"
            minLength="5"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-black border border-white rounded-md text-white placeholder-gray-400"
            minLength="8"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <button className="w-full p-3 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition">
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/userlogin" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;