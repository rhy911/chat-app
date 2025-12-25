import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content) {
      return res.status(400).json({ message: "Thiếu nội dung" });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
      status: "sent",
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    // Populate message with sender info for frontend
    await message.populate("senderId", "username displayName avatarUrl");

    // Emit Socket.io event for real-time message delivery
    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");

    console.log("📤 Sending message via socket:");
    console.log("  Message ID:", message._id);
    console.log("  Sender ID:", senderId.toString());
    console.log("  Recipient ID:", recipientId.toString());
    console.log("  Active sockets:", Array.from(userSocketMap.entries()));

    // Send to recipient
    const recipientSocketId = userSocketMap.get(recipientId.toString());
    console.log("  Recipient socket ID:", recipientSocketId);

    if (recipientSocketId) {
      console.log("✅ Emitting new_message to recipient:", recipientSocketId);
      io.to(recipientSocketId).emit("new_message", {
        message,
        conversationId: conversation._id,
      });
    } else {
      console.log("⚠️ Recipient not connected via socket");
    }

    // Also send to sender for real-time update
    const senderSocketId = userSocketMap.get(senderId.toString());
    if (senderSocketId) {
      console.log("✅ Emitting new_message to sender:", senderSocketId);
      io.to(senderSocketId).emit("new_message", {
        message,
        conversationId: conversation._id,
      });
    } else {
      console.log("⚠️ Sender not connected via socket");
    }

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json("Thiếu nội dung");
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
      status: "sent",
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    // Populate message with sender info for frontend
    await message.populate("senderId", "username displayName avatarUrl");

    // Emit Socket.io event for real-time message delivery
    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");

    console.log("Attempting to send group message to participants");

    // Send to all participants including sender
    conversation.participants.forEach((participant) => {
      const participantId = participant.userId.toString();
      const socketId = userSocketMap.get(participantId);
      console.log(`Participant ${participantId}, socket: ${socketId}`);
      if (socketId) {
        io.to(socketId).emit("new_message", {
          message,
          conversationId: conversation._id,
        });
      }
    });

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if already read by this user
    const alreadyRead = message.readBy.some(
      (read) => read.userId.toString() === userId.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        userId,
        readAt: new Date(),
      });

      // Update status
      if (message.senderId.toString() !== userId.toString()) {
        message.status = "read";
      }

      await message.save();

      // Emit Socket.io event to notify sender
      const io = req.app.get("io");
      const userSocketMap = req.app.get("userSocketMap");

      const senderSocketId = userSocketMap.get(message.senderId.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("message-status-update", {
          messageId: message._id,
          conversationId: message.conversationId,
          status: "read",
          userId: userId.toString(),
        });
      }
    }

    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Find all unread messages in this conversation
    const messages = await Message.find({
      conversationId,
      senderId: { $ne: userId },
      "readBy.userId": { $ne: userId },
    });

    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");

    // Mark each message as read
    for (const message of messages) {
      message.readBy.push({
        userId,
        readAt: new Date(),
      });
      message.status = "read";
      await message.save();

      // Notify sender
      const senderSocketId = userSocketMap.get(message.senderId.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("message-status-update", {
          messageId: message._id,
          conversationId: message.conversationId,
          status: "read",
          userId: userId.toString(),
        });
      }
    }

    return res.status(200).json({ 
      message: "Conversation marked as read",
      updatedCount: messages.length 
    });
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return res.status(500).json({ message: "System error" });
  }
};
