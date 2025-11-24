import axios from "axios";

// Search user
export const searchUser = async (token, query) => {
  const res = await axios.get(
    `http://localhost:5000/api/users/search?search=${query}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};

// Send friend request
export const sendFriendRequest = async (token, friendId) => {
  const res = await axios.post(
    `http://localhost:5000/api/friends/request`,
    { friendId },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return res.data;
};
