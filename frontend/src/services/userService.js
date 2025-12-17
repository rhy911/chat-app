import api from "./api";

export const userService = {
  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Search users by username, displayName, or phoneNumber
  searchUsers: async (query) => {
    const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
