import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useEffect } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
          navigate("/");
        }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/user/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      const userType = response.data.type;
      if (userType === "medecin") {
        navigate("/medecin");
      } else  {
        navigate("/anesthesiste");
      } 
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className="login-link">
          Don't you have an account? <a href="/Signup">Signup here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
