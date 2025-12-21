import express from "express";
import { authMe, searchUsers, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUsers);
router.put("/profile", updateProfile);

export default router;
