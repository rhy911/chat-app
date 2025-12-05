import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

function Chat({ user, onLogout }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi there, How are you?', sender: 'other', time: '12:24 PM' },
    { id: 2, text: 'Waiting for your reply. As I have to go back soon. I have to travel long distance.', sender: 'other', time: '12:25 PM' },
    { id: 3, text: 'Hi, I am coming there in few minutes. Please wait! I am in taxi right now.', sender: 'me', time: '12:28 PM' },
    { id: 4, text: 'Thank you very much, I am waiting here at StarBuck cafe.', sender: 'other', time: '12:35 PM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(false);

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

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="profile-avatar">
            <img src="https://i.pravatar.cc/150?img=1" alt="Profile" />
          </div>
          <div className="header-actions">
            
          </div>
        </div>

        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.78234 1.66666C14.2573 1.66666 17.8973 5.30666 17.8973 9.78166C17.8973 11.893 17.0871 13.8186 15.7612 15.2637L18.3702 17.8672C18.6143 18.1114 18.6152 18.5064 18.371 18.7506C18.2493 18.8739 18.0885 18.9347 17.9285 18.9347C17.7693 18.9347 17.6093 18.8739 17.4868 18.7522L14.8464 16.1192C13.4574 17.2315 11.6962 17.8975 9.78234 17.8975C5.30734 17.8975 1.6665 14.2567 1.6665 9.78166C1.6665 5.30666 5.30734 1.66666 9.78234 1.66666ZM9.78234 2.91666C5.99651 2.91666 2.9165 5.99583 2.9165 9.78166C2.9165 13.5675 5.99651 16.6475 9.78234 16.6475C13.5673 16.6475 16.6473 13.5675 16.6473 9.78166C16.6473 5.99583 13.5673 2.91666 9.78234 2.91666Z" fill="black" fillOpacity="0.3"/>
          </svg>
          <input type="text" placeholder="Search or start new chat" className="search-input" />
        </div>

        <div className="chats-tabs">
          <button className="tab active">ALL CHATS</button>
          <button className="tab">PRIVATE</button>
        </div>

        <div className="conversations-list">
          <div className="conversation active">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=6" alt="Zilan" />
            </div>
            <div className="conversation-info">
              <h4>Zilan</h4>
              <p>Thank you very much, I am wai ...</p>
            </div>
            <span className="time">12:35 PM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=7" alt="Shehnaz" />
            </div>
            <div className="conversation-info">
              <h4>Shehnaz</h4>
              <p>📞 Call ended</p>
            </div>
            <span className="time">12:35 PM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=8" alt="Client" />
            </div>
            <div className="conversation-info">
              <h4>Client</h4>
              <p>What time are we there?</p>
            </div>
            <span className="time">9:12 AM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=9" alt="Mueez" />
            </div>
            <div className="conversation-info">
              <h4>Mueez</h4>
              <p>You: I will send you the work file</p>
            </div>
            <span className="time">9:00 AM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=10" alt="Hasnain" />
            </div>
            <div className="conversation-info">
              <h4>Hasnain</h4>
              <p>You: I will send you the work file</p>
            </div>
            <span className="time">7:10 PM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=11" alt="Saleem" />
            </div>
            <div className="conversation-info">
              <h4>Saleem</h4>
              <p>You: I will send you the work file</p>
            </div>
            <span className="time">7:10 PM</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-user-info">
            <div className="avatar">
              <img src="/zilan-avatar.jpg" alt="Zilan" />
            </div>
            <div>
              <h3>Zilan</h3>
              <span className="status">Online</span>
            </div>
          </div>
          <div className="chat-actions">
            <button className="action-btn">📹</button>
            <button className="action-btn">📞</button>
            <button className="action-btn">⋮</button>
            <button className="action-btn close-btn" onClick={() => setShowContactInfo(!showContactInfo)}>✕</button>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                
              </div>
              <span className="message-time">{message.time}</span>
            </div>
          ))}
        </div>

        <form className="message-input-container" onSubmit={handleSendMessage}>
          <button type="button" className="emoji-btn">😊</button>
          <input
            type="text"
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="message-input"
          />
          <button type="button" className="attach-btn">📎</button>
          <button type="submit" className="send-btn">🎤</button>
        </form>
      </div>

      {/* Contact Info Sidebar */}
      {showContactInfo && (
        <div className="contact-info">
          <div className="contact-header">
            <h3>Contact info</h3>
            <button className="close-info" onClick={() => setShowContactInfo(false)}>✕</button>
          </div>
          
          <div className="contact-profile">
            <div className="contact-avatar">
              <img src="https://i.pravatar.cc/150?img=6" alt="Zilan" />
            </div>
            <h2>Zilan</h2>
            <span className="online-status">Online</span>
            <div className="contact-actions">
              <button className="contact-action-btn">📹</button>
              <button className="contact-action-btn">📞</button>
            </div>
          </div>

          <div className="contact-section">
            <h4>About</h4>
            <p>Hello My name is Zilan ...</p>
          </div>

          <div className="contact-section">
            <h4>Media,links and doc</h4>
            <div className="media-grid">
              <img src="https://picsum.photos/200/200?random=1" alt="Media 1" />
              <img src="https://picsum.photos/200/200?random=2" alt="Media 2" />
              <img src="https://picsum.photos/200/200?random=3" alt="Media 3" />
              <img src="https://picsum.photos/200/200?random=4" alt="Media 4" />
            </div>
          </div>

          <div className="contact-section">
            <div className="toggle-option">
              <span>Mute notifications</span>
              <label className="toggle">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="contact-section">
            <div className="option">
              <span>Disappearing messages</span>
              <span className="option-value">Off</span>
            </div>
          </div>

          <div className="contact-section danger-zone">
            <button className="danger-btn">🚫 Block Zilan</button>
            <button className="danger-btn">⚠️ Report Zilan</button>
            <button className="danger-btn">🗑️ Delete chat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
