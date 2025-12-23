import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.onlineUsers = new Set();
  }

  connect(userId) {
    if (this.socket?.connected) {
      console.log("Socket already connected:", this.socket.id);
      return;
    }

    // Socket.IO server is at root level, not under /api
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    const serverUrl = apiUrl.replace("/api", ""); // Remove /api for socket connection

    console.log("Connecting to socket server:", serverUrl);

    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      if (userId) {
        console.log("📡 Joining socket with userId:", userId);
        this.socket.emit("join", userId);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    // Listen for online users list
    this.socket.on("online-users", (users) => {
      console.log("📋 Online users received:", users);
      this.onlineUsers = new Set(users);

      // Propagate to external listeners
      const callback = this.listeners.get("online-users");
      if (callback) callback(users);
    });

    // Listen for user status changes
    this.socket.on("user-status-change", (data) => {
      const { userId, isOnline, lastSeen } = data;
      console.log(`👤 User ${userId} is now ${isOnline ? "online" : "offline"}`);

      if (isOnline) {
        this.onlineUsers.add(userId);
      } else {
        this.onlineUsers.delete(userId);
      }

      // Propagate to external listeners
      const callback = this.listeners.get("user-status-change");
      if (callback) callback(data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.onlineUsers.clear();
    }
  }

  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  getOnlineUsers() {
    return Array.from(this.onlineUsers);
  }

  on(event, callback) {
    if (!this.socket) {
      console.error("❌ Socket not connected, cannot listen to event:", event);
      return;
    }

    console.log("👂 Registering listener for event:", event);

    // For status events, just store the callback (already listening internally)
    if (event === "online-users" || event === "user-status-change") {
      this.listeners.set(event, callback);
      return;
    }

    // For other events, add socket listener
    this.listeners.set(event, callback);
    this.socket.on(event, callback);
  }

  off(event) {
    if (!this.socket) {
      return;
    }

    const callback = this.listeners.get(event);
    if (callback) {
      // For status events, just remove from listeners (don't remove socket listener)
      if (event === "online-users" || event === "user-status-change") {
        this.listeners.delete(event);
        return;
      }

      // For other events, remove socket listener
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  emit(event, data) {
    if (!this.socket) {
      console.error("❌ Socket not connected, cannot emit event:", event);
      return;
    }

    console.log("📤 Emitting event:", event, data);
    this.socket.emit(event, data);
  }
}

export const socketService = new SocketService();
