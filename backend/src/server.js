import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import friendRoute from "./routes/friendRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
// ✅ THÊM: Import Socket.io và http
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ THÊM: Tạo HTTP server
const httpServer = createServer(app);

// ✅ THÊM: Setup Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// swagger
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

// ✅ THÊM: Socket.io middleware - Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

// ✅ THÊM: Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.userId} (Socket ID: ${socket.id})`);

  // Join user to their own room
  socket.join(socket.userId.toString());

  // Broadcast user online status
  socket.broadcast.emit("user_online", {
    userId: socket.userId,
    status: "online",
  });

  // Handle send message event
  socket.on("send_message", async (data) => {
    try {
      console.log("📨 Send message event:", data);
      
      const { recipientId, content, conversationId } = data;

      // Emit to recipient
      io.to(recipientId.toString()).emit("new_message", {
        senderId: socket.userId,
        recipientId,
        content,
        conversationId,
        type: data.type || "text",
        createdAt: new Date(),
      });

      // Also emit back to sender (for confirmation)
      socket.emit("message_sent", {
        success: true,
        conversationId,
      });
    } catch (error) {
      console.error("❌ Error in send_message:", error);
      socket.emit("message_error", {
        error: error.message,
      });
    }
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    const { recipientId, isTyping } = data;
    
    io.to(recipientId.toString()).emit("user_typing", {
      userId: socket.userId,
      isTyping,
    });
  });

  // Handle user connected event
  socket.on("user_connected", (data) => {
    socket.broadcast.emit("user_online", {
      userId: data.userId || socket.userId,
      status: "online",
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
    
    socket.broadcast.emit("user_offline", {
      userId: socket.userId,
      status: "offline",
    });
  });
});

// ✅ SỬA: Dùng httpServer thay vì app.listen
if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server chạy trên cổng ${PORT}`);
      console.log(`🔌 WebSocket server ready`);
    });
  });
}

// ✅ THÊM: Export cả io để test sử dụng
export { io, httpServer };
export default app;