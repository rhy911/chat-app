import { useState, useEffect, useRef, useCallback } from 'react';
import { socketService } from '../services/socketService';

export const useTyping = (userId, conversationId) => {
  const [usersTyping, setUsersTyping] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!conversationId) return;

    const handleUserTyping = (data) => {
      if (data.conversationId === conversationId && data.userId !== userId) {
        setUsersTyping((prev) => new Set(prev).add(data.userId));
      }
    };

    const handleUserStoppedTyping = (data) => {
      if (data.conversationId === conversationId && data.userId !== userId) {
        setUsersTyping((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    };

    socketService.on('user-typing', handleUserTyping);
    socketService.on('user-stopped-typing', handleUserStoppedTyping);

    return () => {
      socketService.off('user-typing');
      socketService.off('user-stopped-typing');
    };
  }, [conversationId, userId]);

  const startTyping = useCallback(() => {
    if (!conversationId || !userId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketService.sendTyping(conversationId, userId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [conversationId, userId]);

  const stopTyping = useCallback(() => {
    if (!conversationId || !userId) return;

    if (isTypingRef.current) {
      isTypingRef.current = false;
      socketService.sendStopTyping(conversationId, userId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [conversationId, userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [stopTyping]);

  return {
    usersTyping: Array.from(usersTyping),
    startTyping,
    stopTyping,
  };
};
