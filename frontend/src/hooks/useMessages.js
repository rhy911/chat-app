import { useState, useCallback } from "react";
import { conversationService } from "../services/conversationService";
import { messageService } from "../services/messageService";

export const useMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const data = await conversationService.getMessages(conversationId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const addMessage = useCallback((message) => {
    setMessages((prev) => {
      const messageSenderId = typeof message.senderId === "object" ? message.senderId._id : message.senderId;

      // Check if this is a replacement for an optimistic message
      const tempMessageIndex = prev.findIndex(
        (m) => m.status === "sending" && m.content === message.content && m.senderId === messageSenderId && Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) < 2000
      );

      if (tempMessageIndex !== -1) {
        console.log("🔄 Replacing optimistic message with real one");
        const newMessages = [...prev];
        newMessages[tempMessageIndex] = message;
        return newMessages;
      }

      // Check if message already exists
      const exists = prev.some((m) => m._id === message._id);
      if (exists) {
        console.log("⚠️ Message already exists, skipping");
        return prev;
      }

      console.log("➕ New message, adding to list");
      return [...prev, message];
    });
  }, []);

  const addOptimisticMessage = useCallback((optimisticMessage) => {
    setMessages((prev) => [...prev, optimisticMessage]);
  }, []);

  const removeMessage = useCallback((messageId) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  }, []);

  const sendMessage = useCallback(
    async (userId, selectedConversation, messageContent) => {
      if (!messageContent.trim() || !selectedConversation) return;

      const tempId = `temp-${Date.now()}`;

      // Optimistic UI update
      const optimisticMessage = {
        _id: tempId,
        content: messageContent,
        senderId: userId,
        conversationId: selectedConversation._id,
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      addOptimisticMessage(optimisticMessage);

      try {
        const otherParticipant = selectedConversation.participants.find((p) => p._id !== userId);

        if (!otherParticipant) {
          throw new Error("Cannot find recipient");
        }

        await messageService.sendMessage(otherParticipant._id, messageContent, selectedConversation._id);

        // Remove optimistic message after delay if socket didn't update
        setTimeout(() => {
          setMessages((prev) => {
            const stillHasTemp = prev.some((m) => m._id === tempId);
            if (stillHasTemp) {
              return prev.filter((m) => m._id !== tempId);
            }
            return prev;
          });
        }, 3000);
      } catch (error) {
        console.error("Error sending message:", error);
        removeMessage(tempId);
        throw error;
      }
    },
    [addOptimisticMessage, removeMessage]
  );

  return {
    messages,
    setMessages,
    fetchMessages,
    addMessage,
    sendMessage,
  };
};
