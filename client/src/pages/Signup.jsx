import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [type, setType] = useState("");
  const [num, setNum] = useState("");
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

    console.log("Form Data:", { nom, prenom, type, num, email, password });

    try {
      const response = await axios.post("http://localhost:3001/user/register", {
        nom,
        prenom,
        type,
        num,
        email,
        password,
      });


      if (response.status === 201) {
        console.log("Registration successful, navigating to login page...");
        navigate("/login"); 
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select Type</option>
          <option value="medecin">Medecin</option>
          <option value="anesthesiste">Anesthesiste</option>
        </select>
        <input
          type="tel"
          placeholder="Numéro de téléphone"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          required
        />
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
        <button type="submit">Signup</button>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
