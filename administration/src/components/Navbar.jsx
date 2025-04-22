import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css'; 
import { Link } from 'react-router-dom';
function AdminNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    navigate('/login');
  };
const handleStaf = () => {
  window.open('http://localhost:3000/', '_blank');
}
  return (
    <nav className="admin-navbar">
      <div className="logo">
        <Link id="titre" to="/">Vitalcare</Link>
      </div>
      <ul className="nav-links"> 
        <li>
        <img
                onClick={handleStaf}
                className="navicon"
                src="/assets/staff.png"
                alt="Logout"
                width="40"
                height="40"
              />
        </li>
        <li>
          {isLoggedIn ? (
            
            <li>
              <img
                onClick={handleLogout}
                className="navicon"
                src="/assets/logout.png"
                alt="Logout"
                width="37"
                height="37"
              />
            </li>          ) : (
         <li>
         <img
           className="navicon"
           src="/assets/login.png"
           alt="Logout"
            width="37"
            height="37"
            onClick={() => navigate('/login')}
             />
         </li>  
          )}
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
