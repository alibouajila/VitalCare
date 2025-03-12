import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  const handleLogout =async () => {
    await fetch("http://localhost:3001/user/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false); // Update the state immediately after logout
    navigate("/login");   // Redirect to the login page
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleAuthChange);

    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Vitalcare</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <Link   onClick={(e) => {
    e.preventDefault(); 
    handleLogout()
  }} className="logout-link">
              Logout
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
