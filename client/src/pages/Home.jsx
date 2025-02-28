import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup"); 
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Our App</h1>
        <p>
          Our app helps you manage patient records, collaborate with medical
          professionals, and ensure optimal care for your patients. With our
          user-friendly interface, you can easily access all the essential data
          to provide the best care.
        </p>
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          <button className="signup-button" onClick={handleSignup}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
