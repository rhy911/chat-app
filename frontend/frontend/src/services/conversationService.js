import api from "./api";

export const conversationService = {
  // Get all conversations for current user
  getConversations: async () => {
    const response = await api.get("/conversations");
    return response.data;
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId, limit = 50, cursor = null) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);

    const response = await api.get(`/conversations/${conversationId}/messages?${params}`);
    return response.data;
  },

  // Create a new conversation
  createConversation: async (type, memberIds, name = null) => {
    const response = await api.post("/conversations", {
      type,
      memberIds,
      name,
    });
    return response.data;
  },
};
