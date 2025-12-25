import api from "./api";

export const messageService = {
  // Send a direct message
  sendMessage: async (recipientId, content, conversationId = null) => {
    const response = await api.post("/messages/direct", {
      recipientId,
      content,
      conversationId,
    });
    return response.data;
  },

  // Send a group message
  sendGroupMessage: async (conversationId, content) => {
    const response = await api.post("/messages/group", {
      conversationId,
      content,
    });
    return response.data;
  },

  // Mark a message as read
  markMessageAsRead: async (messageId) => {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  },

  // Mark all messages in a conversation as read
  markConversationAsRead: async (conversationId) => {
    const response = await api.patch(`/messages/conversation/${conversationId}/read`);
    return response.data;
  },
};
