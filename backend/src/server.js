import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/User.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

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
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

// Socket.io connection handling
const userSocketMap = new Map(); // userId -> socketId

// Helper function to get online users
const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys());
};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // User joins with their userId
  socket.on("join", async (userId) => {
    try {
      userSocketMap.set(userId, socket.id);
      console.log(`📡 User ${userId} joined with socket ${socket.id}`);
      console.log(`👥 Total connected users: ${userSocketMap.size}`);

      // Update user status to online
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date(),
      });

      // Broadcast to all clients that this user is online
      io.emit("user-status-change", {
        userId,
        isOnline: true,
      });

      // Send the list of online users to the newly connected user
      socket.emit("online-users", getOnlineUsers());
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    // Remove user from map
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        try {
          userSocketMap.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          console.log(`👥 Total connected users: ${userSocketMap.size}`);

          // Update user status to offline
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          // Broadcast to all clients that this user is offline
          io.emit("user-status-change", {
            userId,
            isOnline: false,
            lastSeen: new Date(),
          });
        } catch (error) {
          console.error("Error updating user status:", error);
        }
        break;
      }
    }
  });
});

// Make io accessible to routes
app.set("io", io);
app.set("userSocketMap", userSocketMap);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});
