// Tạo kết nối WebSocket
const socket = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:3001");

// Khi kết nối thành công
socket.onopen = () => {
  console.log("✅ Connected to WebSocket server");
};

// Khi nhận được tin nhắn từ server
socket.onmessage = (event) => {
  console.log("📩 Message from server:", event.data);
  const msgEl = document.getElementById("msg");
  if (msgEl) msgEl.textContent = event.data;
};

export default socket;
