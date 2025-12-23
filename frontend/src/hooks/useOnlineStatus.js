import { useState, useEffect } from "react";
import { socketService } from "../services/socketService";

export const useOnlineStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    // Handler for status changes
    const handleStatusChange = ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    };

    // Handler for initial online users list
    const handleOnlineUsers = (users) => {
      setOnlineUsers(new Set(users));
    };

    // Register listeners
    socketService.on("user-status-change", handleStatusChange);
    socketService.on("online-users", handleOnlineUsers);

    // Get current online users
    const currentOnlineUsers = socketService.getOnlineUsers();
    if (currentOnlineUsers.length > 0) {
      setOnlineUsers(new Set(currentOnlineUsers));
    }

    // Cleanup
    return () => {
      socketService.off("user-status-change");
      socketService.off("online-users");
    };
  }, []);

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  return { onlineUsers, isUserOnline };
};
