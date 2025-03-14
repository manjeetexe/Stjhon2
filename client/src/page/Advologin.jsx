import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    const captain = {
      email,
      password,
    };
  
    try {
      const response = await axios.post("http://localhost:4000/captains/login", captain);
  
      console.log(response); // Debugging: Log response data
  
      if (response.status === 200) { // Check if login is successful
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Redirect to home page after successful login
      } else {
        setError(response.data.message || "Invalid email or password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to the server");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 border border-white rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6"> Advocate Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-black border border-white rounded-md text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-black border border-white rounded-md text-white placeholder-gray-400"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button className="w-full p-3 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/usersignup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;