// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/chatapp")
  .then(() => console.log("MongoDB Connected: localhost"))
  .catch(err => console.log(err));

// Mount route
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy ở cổng ${PORT}`));
