import User from "../models/User.js";
import bcrypt from "bcrypt";

export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Query không được để trống" });
    }

    // Search by username, displayName, or phoneNumber
    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      $or: [{ username: { $regex: query, $options: "i" } }, { displayName: { $regex: query, $options: "i" } }, { phoneNumber: { $regex: query, $options: "i" } }],
    })
      .select("username displayName phoneNumber avatarUrl")
      .limit(20);

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Lỗi khi search users", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, phoneNumber, about, displayName, avatarUrl } = req.body;

    console.log("Update profile request:", { username, phoneNumber, about, displayName, avatarUrl: avatarUrl ? "has image" : "no image" });

    // Check if username is being changed and if it's already taken
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username đã được sử dụng" });
      }
    }

    // Check if phone number is being changed and if it's already taken
    if (phoneNumber) {
      const existingUser = await User.findOne({
        phoneNumber,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
      }
    }

    // Build update object
    const updateData = {};
    if (username) updateData.username = username;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (about !== undefined) updateData.about = about;
    if (displayName) updateData.displayName = displayName;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select("-password");

    return res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi update profile", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu mật khẩu hiện tại hoặc mật khẩu mới" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.hashedPassword = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
