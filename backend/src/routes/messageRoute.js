import express from "express";

import { sendDirectMessage, markMessageAsRead, markConversationAsRead } from "../controllers/messageController.js";

const router = express.Router();

router.post("/direct", sendDirectMessage);
router.patch("/:messageId/read", markMessageAsRead);
router.patch("/conversation/:conversationId/read", markConversationAsRead);

export default router;
