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
              <svg width="28" height="28" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4011 4.6875C14.9241 4.6875 16.6856 6.42608 16.6856 8.91762V16.0824C16.6856 18.5739 14.9241 20.3125 12.4011 20.3125H4.70109C2.17814 20.3125 0.416668 18.5739 0.416668 16.0824V8.91762C0.416668 6.42608 2.17814 4.6875 4.70109 4.6875H12.4011ZM20.7896 7.16561C21.2469 6.93295 21.7833 6.95728 22.2198 7.23223C22.6562 7.50613 22.9167 7.98202 22.9167 8.50233V16.4983C22.9167 17.0197 22.6562 17.4945 22.2198 17.7684C21.9812 17.9175 21.7146 17.9937 21.4458 17.9937C21.2219 17.9937 20.9979 17.9408 20.7885 17.834L19.2458 17.0556C18.675 16.7659 18.3208 16.1842 18.3208 15.5381V9.46151C18.3208 8.8143 18.675 8.23266 19.2458 7.94501L20.7896 7.16561Z" fill="#BEBEBE"/>
              </svg>
            </div>
            <div className="action-btn">
              <svg width="28" height="28" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0122 12.9921C16.1675 17.1462 17.1102 12.3403 19.7559 14.9842C22.3065 17.5341 23.7725 18.045 20.5409 21.2758C20.1361 21.6011 17.5642 25.5149 8.52562 16.4788C-0.514042 7.44167 3.39748 4.86713 3.72288 4.46245C6.96236 1.22275 7.46444 2.69727 10.0151 5.24722C12.6608 7.89218 7.85693 8.83793 12.0122 12.9921Z" fill="#BEBEBE"/>
                </svg>
            </div>
            <div className="action-btn" onClick={() => setShowContactInfo(!showContactInfo)}>
              <svg width="25" height="8" viewBox="0 0 23 6" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="input-wrapper">
            <div className="emoji-btn">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#78787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.5 15C12.3284 15 13 14.3284 13 13.5C13 12.6716 12.3284 12 11.5 12C10.6716 12 10 12.6716 10 13.5C10 14.3284 10.6716 15 11.5 15Z" fill="#7C7878"/>
                <path d="M20.5 15C21.3284 15 22 14.3284 22 13.5C22 12.6716 21.3284 12 20.5 12C19.6716 12 19 12.6716 19 13.5C19 14.3284 19.6716 15 20.5 15Z" fill="#7C7878"/>
                <path d="M21.2 19C20.6714 19.9107 19.9128 20.6667 19.0002 21.1922C18.0876 21.7176 17.053 21.9942 16 21.9942C14.9469 21.9942 13.9123 21.7176 12.9998 21.1922C12.0872 20.6667 11.3286 19.9107 10.8 19" stroke="#78787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Type a message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="message-input"
            />
            <div className="attach-btn">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 9.99997L9.58749 20.5875C9.24277 20.9679 9.05756 21.4664 9.0702 21.9796C9.08283 22.4928 9.29235 22.9816 9.65538 23.3446C10.0184 23.7076 10.5071 23.9171 11.0204 23.9298C11.5336 23.9424 12.032 23.7572 12.4125 23.4125L24.825 10.825C25.5144 10.0641 25.8849 9.06718 25.8596 8.04071C25.8343 7.01423 25.4153 6.03678 24.6892 5.31073C23.9632 4.58469 22.9857 4.16565 21.9593 4.14037C20.9328 4.1151 19.9359 4.48553 19.175 5.17497L6.76249 17.7625C5.63864 18.8863 5.00726 20.4106 5.00726 22C5.00726 23.5893 5.63864 25.1136 6.76249 26.2375C7.88635 27.3613 9.41062 27.9927 11 27.9927C12.5894 27.9927 14.1136 27.3613 15.2375 26.2375L25.5 16" stroke="#78787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div type="submit" className="send-btn">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 8C21 5.23858 18.7614 3 16 3C13.2386 3 11 5.23858 11 8V16C11 18.7614 13.2386 21 16 21C18.7614 21 21 18.7614 21 16V8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 25V29" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M24.95 17C24.6906 19.1915 23.6361 21.2116 21.9865 22.6774C20.3369 24.1433 18.2068 24.9529 16 24.9529C13.7932 24.9529 11.6631 24.1433 10.0135 22.6774C8.36391 21.2116 7.30944 19.1915 7.05 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </form>
      </div>

      {/* Contact Info Sidebar */}
      {showContactInfo && (
        <div className="contact-info">
          <div className="contact-header">
            <h3>Contact info</h3>
            <div className="close-info" onClick={() => setShowContactInfo(false)}>
              <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.00001 1.00518L11.0114 11.9948" stroke="#BEBEBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="bevel"/>
                <path d="M11.0057 1.00001L1.00566 12" stroke="#BEBEBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="bevel"/>
              </svg>
            </div>
          </div>
          
          <div className="contact-profile">
            <div className="contact-avatar">
              <img src="/zilan-avatar.jpg" alt="Zilan" />
            </div>
            <h2>Zilan</h2>
            <span className="online-status">Online</span>
          </div>
          <div className="contact-actions">
              <div className="action-btn">
              <svg width="28" height="28" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4011 4.6875C14.9241 4.6875 16.6856 6.42608 16.6856 8.91762V16.0824C16.6856 18.5739 14.9241 20.3125 12.4011 20.3125H4.70109C2.17814 20.3125 0.416668 18.5739 0.416668 16.0824V8.91762C0.416668 6.42608 2.17814 4.6875 4.70109 4.6875H12.4011ZM20.7896 7.16561C21.2469 6.93295 21.7833 6.95728 22.2198 7.23223C22.6562 7.50613 22.9167 7.98202 22.9167 8.50233V16.4983C22.9167 17.0197 22.6562 17.4945 22.2198 17.7684C21.9812 17.9175 21.7146 17.9937 21.4458 17.9937C21.2219 17.9937 20.9979 17.9408 20.7885 17.834L19.2458 17.0556C18.675 16.7659 18.3208 16.1842 18.3208 15.5381V9.46151C18.3208 8.8143 18.675 8.23266 19.2458 7.94501L20.7896 7.16561Z" fill="#BEBEBE"/>
              </svg>
            </div>
            <div className="action-btn">
              <svg width="28" height="28" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0122 12.9921C16.1675 17.1462 17.1102 12.3403 19.7559 14.9842C22.3065 17.5341 23.7725 18.045 20.5409 21.2758C20.1361 21.6011 17.5642 25.5149 8.52562 16.4788C-0.514042 7.44167 3.39748 4.86713 3.72288 4.46245C6.96236 1.22275 7.46444 2.69727 10.0151 5.24722C12.6608 7.89218 7.85693 8.83793 12.0122 12.9921Z" fill="#BEBEBE"/>
                </svg>
            </div>
          </div>
          <div className='contact-content'>
            <div className="contact-section">
              <h3>About</h3>
              <p>Hello My name is Zilan ...</p>
            </div>

            <div className="contact-section">
              <h3>Media,links and doc</h3>
              <div className="media-grid">
                <img src="https://picsum.photos/200/200?random=1" alt="Media 1" />
                <img src="https://picsum.photos/200/200?random=2" alt="Media 2" />
                <img src="https://picsum.photos/200/200?random=3" alt="Media 3" />
                <img src="https://picsum.photos/200/200?random=4" alt="Media 4" />
              </div>
            </div>

            <div className="contact-section">
              <div className="toggle-option">
                <h3>Mute notifications</h3>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="contact-section">
              <div className="option">
                <h3>Disappearing messages</h3>
                <p className="option-value">Off</p>
              </div>
            </div>
          </div>

          <div className="danger-zone">
            <div className="danger-btn">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19.25C15.5563 19.25 19.25 15.5563 19.25 11C19.25 6.44365 15.5563 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11C2.75 15.5563 6.44365 19.25 11 19.25Z" stroke="#CC3169" stroke-width="2" stroke-miterlimit="10"/>
                <path d="M5.16486 5.16486L16.8352 16.8352" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Block Zilan</div>
            <div className="danger-btn">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.75002 4.125H6.87502V13.0625H2.75002C2.56768 13.0625 2.39281 12.9901 2.26388 12.8611C2.13495 12.7322 2.06252 12.5573 2.06252 12.375V4.8125C2.06252 4.63016 2.13495 4.4553 2.26388 4.32636C2.39281 4.19743 2.56768 4.125 2.75002 4.125V4.125Z" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.87502 13.0625L10.3125 19.9375C11.0419 19.9375 11.7413 19.6478 12.2571 19.132C12.7728 18.6163 13.0625 17.9168 13.0625 17.1875V15.125H18.382C18.577 15.1255 18.7698 15.0842 18.9475 15.004C19.1252 14.9238 19.2837 14.8065 19.4123 14.66C19.541 14.5135 19.6367 14.3411 19.6932 14.1545C19.7497 13.9679 19.7656 13.7714 19.7399 13.5781L18.7086 5.32812C18.6669 4.99694 18.5061 4.69224 18.2563 4.47086C18.0064 4.24949 17.6846 4.12655 17.3508 4.125H6.87502" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Report Zilan
            </div>
            <div className="danger-btn">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5625 4.8125H3.43752" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.93752 8.9375V14.4375" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.0625 8.9375V14.4375" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.1875 4.8125V17.875C17.1875 18.0573 17.1151 18.2322 16.9862 18.3611C16.8572 18.4901 16.6824 18.5625 16.5 18.5625H5.50002C5.31768 18.5625 5.14281 18.4901 5.01388 18.3611C4.88495 18.2322 4.81252 18.0573 4.81252 17.875V4.8125" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.4375 4.8125V3.4375C14.4375 3.07283 14.2926 2.72309 14.0348 2.46523C13.7769 2.20737 13.4272 2.0625 13.0625 2.0625H8.9375C8.57283 2.0625 8.22309 2.20737 7.96523 2.46523C7.70737 2.72309 7.5625 3.07283 7.5625 3.4375V4.8125" stroke="#CC3169" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Delete chat</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
