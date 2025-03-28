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
    if (isLoggedIn) fetchUnreadCount(); // Fetch unread count when logged in

    return () => window.removeEventListener("storage", handleAuthChange);
  }, [isLoggedIn]); // Re-fetch unread count on login status change

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
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
        fetchUnreadCount(); // Update unread count after fetching notifications
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const unreadResponse = await fetch("http://localhost:3001/notifications/unread-count", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      const unreadData = await unreadResponse.json();
      setUnreadCount(unreadData.count); // Update unread count
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
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

      // Update UI to reflect that all notifications are read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0); // Reset unread count after marking all as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      await fetch(`http://localhost:3001/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== id)
      );

      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0)); // Adjust unread count after deleting
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Mark the notification as read in the backend
      await fetch(`http://localhost:3001/notifications/${id}/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      // Update the notification status to read in the state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0)); // Decrease unread count
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
                      <>
                        <button className="mark-all-btn" onClick={markAllAsRead}>
                          Mark All as Read
                        </button>
                        {notifications.map((notif) => (
                          <div key={notif._id} className={`notification-item ${notif.read ? "read" : "unread"}`}>
                            <p>{notif.message}</p>
                            {notif.link && (
                              <button
                                onClick={() => {
                                  navigate(notif.link);
                                  markAsRead(notif._id); 
                                }}
                                className="view-btn"
                              >
                                View
                              </button>
                            )}
                            <button onClick={() => deleteNotification(notif._id)} className="delete-btn">
                              Delete
                            </button>
                          </div>
                        ))}
                      </>
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
