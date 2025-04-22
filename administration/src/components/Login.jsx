import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import {toast} from 'react-toastify';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/admin/login', {
        email,
        password,
      });

      localStorage.setItem('adminToken', response.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Admin Email"
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
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
