import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, 
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const response = await api.post("user/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    console.error("Refresh token failed", error);
    throw error;
  }
};
// Axios Interceptor to refresh the token if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        localStorage.setItem("accessToken", newAccessToken);
        // Update the failed request with the new token
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        // Retry the request with the updated token
        return api(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login...");
        // Clear storage and redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";  
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
