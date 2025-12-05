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
              <div className="header-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
          </div>
        </div>

        <div className="search-container">
          <label className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 18" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.11584 0C12.5908 0 16.2308 3.64 16.2308 8.115C16.2308 10.2263 15.4206 12.1519 14.0947 13.5971L16.7037 16.2006C16.9478 16.4447 16.9487 16.8398 16.7045 17.0839C16.5828 17.2072 16.422 17.2681 16.262 17.2681C16.1028 17.2681 15.9428 17.2073 15.8203 17.0856L13.1799 14.4525C11.7909 15.5649 10.0297 16.2308 8.11584 16.2308C3.64083 16.2308 0 12.59 0 8.115C0 3.64 3.64083 0 8.11584 0ZM8.11584 1.25C4.33 1.25 1.25 4.32917 1.25 8.115C1.25 11.9008 4.33 14.9808 8.11584 14.9808C11.9008 14.9808 14.9808 11.9008 14.9808 8.115C14.9808 4.32917 11.9008 1.25 8.11584 1.25Z" fill="black" fill-opacity="0.3"/>
            </svg>
          </label>
          <input type="text" placeholder="Search or start new chat" className="search-input" />
          
        </div>

        <div className="chats-tabs">
          <button className="tab active">ALL CHATS</button>
          <button className="tab">PRIVATE</button>
        </div>

        <div className="conversations-list">
          <div className="conversation active">
            <div className="avatar">
              <img src="/zilan-avatar.jpg" alt="Zilan" />
            </div>
            <div className="conversation-info">
              <h3>Zilan</h3>
              <p>Thank you very much, I am wai ...</p>
            </div>
            <span className="time">12:35 PM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=7" alt="Shehnaz" />
            </div>
            <div className="conversation-info">
              <h3>Shehnaz</h3>
              <p>📞 Call ended</p>
            </div>
            <span className="time">12:35 PM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=8" alt="Client" />
            </div>
            <div className="conversation-info">
              <h3>Client</h3>
              <p>What time are we there?</p>
            </div>
            <span className="time">9:12 AM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=9" alt="Mueez" />
            </div>
            <div className="conversation-info">
              <h3>Mueez</h3>
              <p>You: I will send you the work file</p>
            </div>
            <span className="time">9:00 AM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=10" alt="Hasnain" />
            </div>
            <div className="conversation-info">
              <h3>Hasnain</h3>
              <p>You: I will send you the work file</p>
            </div>
            <span className="time">7:10 PM</span>
          </div>
          <div className="conversation">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=11" alt="Saleem" />
            </div>
            <div className="conversation-info">
              <h3>Saleem</h3>
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
            <div className="action-btn">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4011 4.6875C14.9241 4.6875 16.6856 6.42608 16.6856 8.91762V16.0824C16.6856 18.5739 14.9241 20.3125 12.4011 20.3125H4.70109C2.17814 20.3125 0.416668 18.5739 0.416668 16.0824V8.91762C0.416668 6.42608 2.17814 4.6875 4.70109 4.6875H12.4011ZM20.7896 7.16561C21.2469 6.93295 21.7833 6.95728 22.2198 7.23223C22.6562 7.50613 22.9167 7.98202 22.9167 8.50233V16.4983C22.9167 17.0197 22.6562 17.4945 22.2198 17.7684C21.9812 17.9175 21.7146 17.9937 21.4458 17.9937C21.2219 17.9937 20.9979 17.9408 20.7885 17.834L19.2458 17.0556C18.675 16.7659 18.3208 16.1842 18.3208 15.5381V9.46151C18.3208 8.8143 18.675 8.23266 19.2458 7.94501L20.7896 7.16561Z" fill="#BEBEBE"/>
              </svg>
            </div>
            <div className="action-btn">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0122 12.9921C16.1675 17.1462 17.1102 12.3403 19.7559 14.9842C22.3065 17.5341 23.7725 18.045 20.5409 21.2758C20.1361 21.6011 17.5642 25.5149 8.52562 16.4788C-0.514042 7.44167 3.39748 4.86713 3.72288 4.46245C6.96236 1.22275 7.46444 2.69727 10.0151 5.24722C12.6608 7.89218 7.85693 8.83793 12.0122 12.9921Z" fill="#BEBEBE"/>
                </svg>
            </div>
            <div className="action-btn" onClick={() => setShowContactInfo(!showContactInfo)}>
              <svg width="23" height="6" viewBox="0 0 23 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2.87113" cy="2.87113" r="2.87113" fill="#BEBEBE"/>
                <circle cx="11.14" cy="2.87113" r="2.87113" fill="#BEBEBE"/>
                <circle cx="19.4089" cy="2.87113" r="2.87113" fill="#BEBEBE"/>
              </svg>
            </div>
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
