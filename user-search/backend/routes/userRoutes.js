// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
const router = express.Router();
// GET /api/users/search?search=keyword
router.get("/search", async (req, res) => {
  const search = req.query.search || "";
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;