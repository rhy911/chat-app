import api, { setAuthToken } from "./api";

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/signin", credentials);
    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/signout");
    setAuthToken(null);
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    return response.data;
  },
};
