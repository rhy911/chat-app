import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
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
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  on(event, callback) {
    if (!this.socket) {
      console.error("❌ Socket not connected, cannot listen to event:", event);
      return;
    }

    console.log("👂 Registering listener for event:", event);
    // Store listener for cleanup
    this.listeners.set(event, callback);
    this.socket.on(event, callback);
  }

  off(event) {
    if (!this.socket) {
      return;
    }

    const callback = this.listeners.get(event);
    if (callback) {
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
