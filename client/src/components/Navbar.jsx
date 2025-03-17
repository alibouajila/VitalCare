import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // ✅ Correct import for frontend
import "./navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const navigate = useNavigate();
const TakeToProfile=()=>{
  navigate("/profile")
}
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
  const isAnesthesist = () => {
    const token=localStorage.getItem("accessToken")
    try {
      const decoded = jwtDecode(token);
      return decoded.type === "anesthesiste"; 
    } catch (error) {
      return false;
    }
  };
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Vitalcare</Link>
      </div>
      <ul className="nav-links">
        {isLoggedIn ? (<>
                  <li>
                  <img onClick={TakeToProfile} className="profile" src="/assets/profile.png" alt="Add Icon" width="40" height="40" />
                  </li>
                  {isAnesthesist() && (
              <li>
                <img className="profile" src="/assets/notif.png" alt="Notification Icon" width="37" height="37" />
              </li>
            )}

                  <li>
                  <img onClick={handleLogout} className="profile" src="/assets/logout.png" alt="Add Icon" width="37" height="37" />
                  </li>
                  
      </>
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
