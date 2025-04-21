import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'; 
function AdminNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="logo">
        <h2 style={{ color: '#00a8ff' }}> Admin Panel</h2>
      </div>
      <ul className="nav-links"> 
        <li>
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">Medical staff</a>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="auth-btn">Logout</button>
          ) : (
            <Link to="/login" className="auth-btn">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
