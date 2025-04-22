import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { toast } from "react-toastify";
const Dashboard = () => {
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [notVerifiedUsers, setNotVerifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const verified = await axios.get("http://localhost:3001/admin/verified", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notVerified = await axios.get("http://localhost:3001/admin/not-verified", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter to only medecin or anesthesiste users
      const filterUser = (user) =>
        user.type === "medecin" || user.type === "anesthesiste";

      setVerifiedUsers(verified.data.filter(filterUser));
      setNotVerifiedUsers(notVerified.data.filter(filterUser));
    } catch (err) {
      console.log("Unauthorized or expired token.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        `http://localhost:3001/admin/verify/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User verified successfully!");
      fetchUsers();
    } catch (err) {
      console.log(err);
      toast.error("Verification failed.");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    if (!confirmDelete) return;   
     const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`http://localhost:3001/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">✅ Verified Users</h2>
            {verifiedUsers.length === 0 ? (
              <p className="dashboard-empty">No verified users yet.</p>
            ) : (
              <ul className="dashboard-user-list">
                {verifiedUsers.map((user) => (
                  <li className="dashboard-user-item" key={user._id}>
                    <span><strong>Nom:</strong> {user.nom}</span>
                    <span><strong>Prénom:</strong> {user.prenom}</span>
                    <span><strong>Email:</strong> {user.email}</span>
                    <span><strong>Role:</strong> {user.type}</span>
                    <span><strong>Num:</strong> {user.num}</span>
                    <button
                      className="dashboard-delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dashboard-section">
            <h2 className="dashboard-section-title">⛔ Not Verified Users</h2>
            {notVerifiedUsers.length === 0 ? (
              <p className="dashboard-empty">No unverified users.</p>
            ) : (
              <ul className="dashboard-user-list">
                {notVerifiedUsers.map((user) => (
                  <li className="dashboard-user-item" key={user._id}>
                    <span><strong>Nom:</strong> {user.nom}</span>
                    <span><strong>Prénom:</strong> {user.prenom}</span>
                    <span><strong>Email:</strong> {user.email}</span>
                    <span><strong>Role:</strong> {user.type}</span>
                    <span><strong>Num:</strong> {user.num}</span>
                    <button
                      className="dashboard-verify-btn"
                      onClick={() => verifyUser(user._id)}
                    >
                      Verify
                    </button>
                    <button
                      className="dashboard-delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
