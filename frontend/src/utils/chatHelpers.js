// Time formatting helper
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

// Message preview helper
export const formatMessagePreview = (message) => {
  if (!message) return "No messages yet";
  return message.content?.substring(0, 40) + (message.content?.length > 40 ? "..." : "");
};

// Get conversation name
export const getConversationName = (conversation, currentUserId) => {
  if (conversation.type === "group") {
    return conversation.group?.name || "Group Chat";
  }

  const otherParticipant = conversation.participants.find((p) => p._id !== currentUserId);
  return otherParticipant?.displayName || otherParticipant?.username || "Unknown User";
};

// Get conversation avatar URL
export const getConversationAvatar = (conversation, currentUserId) => {
  if (conversation.type === "group") {
    return "https://ui-avatars.com/api/?name=Group&background=random&size=150";
  }

  const otherParticipant = conversation.participants.find((p) => p._id !== currentUserId);
  const name = otherParticipant?.displayName || otherParticipant?.username || "User";
  return otherParticipant?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
};

// Get conversation about text
export const getConversationAbout = (conversation, currentUserId) => {
  if (conversation.type === "group") {
    return "Group conversation";
  }

  const otherParticipant = conversation.participants.find((p) => p._id !== currentUserId);
  return otherParticipant?.about || "No about information";
};

// Get sender ID from message (handles populated and unpopulated)
export const getMessageSenderId = (message) => {
  return typeof message.senderId === "object" ? message.senderId._id : message.senderId;
};

// Generate user avatar URL
export const getUserAvatarUrl = (user) => {
  if (user?.avatarUrl) return user.avatarUrl;

  const name = user?.displayName || user?.username || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
};
