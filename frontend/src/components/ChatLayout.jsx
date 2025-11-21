import { useState } from 'react';
import './ChatLayout.css';

function ChatLayout({ user, onLogout }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! How are you?', sender: 'other', time: '10:30 AM' },
    { id: 2, text: 'I\'m good, thanks! How about you?', sender: 'me', time: '10:31 AM' },
    { id: 3, text: 'Doing great! Working on a new project.', sender: 'other', time: '10:32 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <div className="header-actions">
            <button className="new-chat-btn">+</button>
            {onLogout && (
              <button className="logout-btn" onClick={onLogout} title="Logout">
                🚪
              </button>
            )}
          </div>
        </div>
        <div className="conversations-list">
          <div className="conversation active">
            <div className="avatar">JD</div>
            <div className="conversation-info">
              <h4>John Doe</h4>
              <p>Doing great! Working on...</p>
            </div>
            <span className="time">10:32</span>
          </div>
          <div className="conversation">
            <div className="avatar">SA</div>
            <div className="conversation-info">
              <h4>Sarah Anderson</h4>
              <p>See you tomorrow!</p>
            </div>
            <span className="time">Yesterday</span>
          </div>
          <div className="conversation">
            <div className="avatar">MB</div>
            <div className="conversation-info">
              <h4>Mike Brown</h4>
              <p>Thanks for your help</p>
            </div>
            <span className="time">Monday</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-user-info">
            <div className="avatar">JD</div>
            <div>
              <h3>John Doe</h3>
              <span className="status">Online</span>
            </div>
          </div>
          <div className="chat-actions">
            <button>📞</button>
            <button>📹</button>
            <button>⋮</button>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="message-input-container" onSubmit={handleSendMessage}>
          <button type="button" className="attach-btn">📎</button>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="message-input"
          />
          <button type="button" className="emoji-btn">😊</button>
          <button type="submit" className="send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatLayout;
