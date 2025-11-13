import express from 'express';
import authRouter from './routes/auth.route.js';
import dotenv from 'dotenv';
import {connectDB} from "./lib/db.js"
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use("/api/auth", authRouter);


app.listen(PORT, () => {
  console.log('Server is running on port PORT: ' + PORT);
  connectDB()
});