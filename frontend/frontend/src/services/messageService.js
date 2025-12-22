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
};
