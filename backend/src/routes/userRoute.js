import express from "express";
import { authMe, searchUsers, updateProfile, changePassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUsers);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);

export default router;
