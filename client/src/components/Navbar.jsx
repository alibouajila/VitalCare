import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const TakeToProfile = () => {
    navigate("/profile");
  };

  const handleNotif = async () => {
    setNotifOpen((prev) => !prev);
    if (!notifOpen) {
      await fetchNotifications();
      await markAllAsRead();
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:3001/user/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleAuthChange);

    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const isAnesthesist = () => {
    const token = localStorage.getItem("accessToken");
    try {
      const decoded = jwtDecode(token);
      return decoded.type === "anesthesiste";
    } catch (error) {
      return false;
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3001/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data);
        setUnreadCount(data.filter((notif) => !notif.read).length);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch("http://localhost:3001/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:3001/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== id)
      );

      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link id="titre" to="/">Vitalcare</Link>
      </div>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li>
              <img
                onClick={TakeToProfile}
                className="profile"
                src="/assets/profile.png"
                alt="Profile"
                width="40"
                height="40"
              />
            </li>
            {isAnesthesist() && (
              <li className="relative">
                <div className="notif-icon-container">
                  <img
                    onClick={handleNotif}
                    className="profile"
                    src="/assets/notif.png"
                    alt="Notification Icon"
                    width="37"
                    height="37"
                  />
                  {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
                </div>
                {notifOpen && (
                  <div className="notif-menu">
                    {notifications.length === 0 ? (
                      <p>No new notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`notification-item ${notif.read ? "read" : "unread"}`}
                        >
                          <p>{notif.message}</p>
                          {notif.link && (
                            <button onClick={() => navigate(notif.link)} className="view-btn">
                              View
                            </button>
                          )}
                          <button onClick={() => deleteNotification(notif._id)} className="delete-btn">
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>
            )}
            <li>
              <img
                onClick={handleLogout}
                className="profile"
                src="/assets/logout.png"
                alt="Logout"
                width="37"
                height="37"
              />
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
