import { useEffect } from "react";
import { socketService } from "../services/socketService";

export const useSocket = (userId, selectedConversationId, onNewMessage, onConversationsUpdate) => {
  useEffect(() => {
    if (!userId) return;

    // Connect to socket only once with userId
    socketService.connect(userId);

    const handleNewMessage = ({ message, conversationId }) => {
      console.log("📩 Received new message via socket:", {
        messageId: message._id,
        content: message.content?.substring(0, 50),
        conversationId,
        senderId: message.senderId,
      });

      // Update messages if viewing this conversation
      if (selectedConversationId === conversationId) {
        onNewMessage(message);
      }

      // Update conversation list
      onConversationsUpdate(conversationId, message);
    };

    socketService.on("new_message", handleNewMessage);

    return () => {
      socketService.off("new_message");
      // Don't disconnect on cleanup - socket should persist across the app
    };
  }, [userId, selectedConversationId, onNewMessage, onConversationsUpdate]);
};
