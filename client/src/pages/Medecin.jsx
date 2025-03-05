import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function Medecin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the access token exists in localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // Redirect to login if the user is not logged in
      navigate("/login");
    } else {
      try {
        // Decode the JWT token
        const decoded = jwtDecode(token);

        // Check if the user type is 'medecin'
        if (decoded.type !== "medecin") {
          // Redirect to a different page if the user type is not 'medecin'
          navigate("/dashboard");
        }
      } catch (error) {
        // If the token is invalid, redirect to login
        navigate("/login");
      }
    }
  }, [navigate]);

  return <div>Dashboardmed</div>;
}

export default Medecin;
