import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleAuthChange);

    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("storage"));

    navigate("/login");
  };

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
            <Link to="#" onClick={handleLogout} className="logout-link">
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
