import User from "../models/User.js";

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
