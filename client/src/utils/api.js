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
    console.error("Error object:", error); 
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(error.config); 
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
