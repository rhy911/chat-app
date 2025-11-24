// SearchItem.jsx
import React from "react";

export default function SearchItem({ user, query, onClick }) {
  const highlightText = (text) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="card" onClick={() => onClick && onClick(user)}>
      <div className="avatar-wrapper">
        <img
          src={user.avatar || "/default.png"}
          alt={user.name}
          className="avatar"
        />
        {user.isOnline && <span className="online-dot"></span>}
      </div>

      <div className="info">
        <p className="name">{highlightText(user.name)}</p>
      </div>
    </div>
  );
}
