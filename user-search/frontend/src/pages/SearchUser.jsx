// SearchUser.jsx
import React, { useState, useEffect } from "react";
import { searchUser } from "../api/userApi";
import SearchItem from "../components/SearchItem";
import "../styles/search.css";

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const token = localStorage.getItem("token");

  // Danh sách gợi ý (hardcoded hoặc lấy từ API)
  const suggestedUsers = [
    {
      _id: "1",
      name: "Mai Lann",
      avatar: "https://i.pravatar.cc/150?img=47",
      isOnline: true
    },
    {
      _id: "2",
      name: "Đức Bùi",
      avatar: "https://i.pravatar.cc/150?img=33",
      isOnline: false
    },
    {
      _id: "3",
      name: "Quang Minh Hoàng",
      avatar: "https://i.pravatar.cc/150?img=68",
      isOnline: true
    },
    {
      _id: "4",
      name: "Minh Long",
      avatar: "https://i.pravatar.cc/150?img=12",
      isOnline: false
    },
    {
      _id: "5",
      name: "Bùi Trí Đức",
      avatar: "https://i.pravatar.cc/150?img=52",
      isOnline: true
    }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchUser(token, query);
      setUsers(data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setHasSearched(false);
      return;
    }
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Click vào user
  const handleUserClick = (user) => {
    console.log("Selected user:", user);
    // TODO: Navigate to chat with this user
    // navigate(`/chat/${user._id}`);
  };

  return (
    <div className="page">
      <div className="search-wrapper">
        <h1 className="title">🔍 Tìm kiếm người dùng</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Nhập tên hoặc số điện thoại..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* GỢI Ý TÀI KHOẢN - Hiển thị khi chưa tìm kiếm */}
        {!loading && !hasSearched && (
          <div className="suggestions">
            <h3 className="suggestions-title">Gợi ý</h3>
            <div className="result-list">
              {suggestedUsers.map((user) => (
                <SearchItem 
                  key={user._id} 
                  user={user} 
                  query=""
                  onClick={handleUserClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && hasSearched && users.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>Không tìm thấy người dùng</h3>
            <p>Từ khóa: "{query}"</p>
          </div>
        )}

        {/* KẾT QUẢ TÌM KIẾM */}
        {!loading && hasSearched && users.length > 0 && (
          <div className="results">
            <h3 className="results-title">
              Kết quả tìm kiếm 
              <span className="results-count">{users.length}</span>
            </h3>
            <div className="result-list">
              {users.map((user) => (
                <SearchItem 
                  key={user._id} 
                  user={user} 
                  query={query}
                  onClick={handleUserClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}