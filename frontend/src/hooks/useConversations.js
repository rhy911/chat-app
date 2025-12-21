import { useState, useCallback } from "react";
import { conversationService } from "../services/conversationService";

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await conversationService.getConversations();
      setConversations(response.conversations || []);

      // Return first conversation for auto-selection
      return response.conversations?.[0] || null;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConversation = useCallback((conversationId, message) => {
    setConversations((prev) =>
      prev
        .map((conv) => (conv._id === conversationId ? { ...conv, lastMessage: message, lastMessageAt: message.createdAt } : conv))
        .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
    );
  }, []);

  return {
    conversations,
    loading,
    fetchConversations,
    updateConversation,
  };
};
