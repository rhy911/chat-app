import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { conversationService } from '../services/conversationService';
import { messageService } from '../services/messageService';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import './Chat.css';

function Chat({ user, onLogout }) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationService.getConversations();
      setConversations(response.conversations || []);
      
      // Select first conversation by default
      if (response.conversations && response.conversations.length > 0) {
        setSelectedConversation(response.conversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await conversationService.getMessages(conversationId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConversation) return;

    try {
      // Get the other participant's ID from the conversation
      const otherParticipant = selectedConversation.participants.find(
        p => p._id !== user?._id
      );

      if (!otherParticipant) {
        alert('Cannot find recipient');
        return;
      }

      const response = await messageService.sendMessage(
        otherParticipant._id,
        inputMessage,
        selectedConversation._id
      );

      // Add the new message to the list
      setMessages([...messages, response.message]);
      setInputMessage('');
      
      // Refresh conversations to update last message
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogoutClick = async () => {
    try {
      await authService.logout();
      if (onLogout) {
        onLogout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessagePreview = (message) => {
    if (!message) return 'No messages yet';
    return message.content?.substring(0, 40) + (message.content?.length > 40 ? '...' : '');
  };

  const getConversationName = (conversation) => {
    if (conversation.type === 'group') {
      return conversation.group?.name || 'Group Chat';
    }
    
    const otherParticipant = conversation.participants.find(
      p => p._id !== user?._id
    );
    return otherParticipant?.displayName || otherParticipant?.username || 'Unknown User';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.type === 'group') {
      return 'https://i.pravatar.cc/150?img=0';
    }
    
    const otherParticipant = conversation.participants.find(
      p => p._id !== user?._id
    );
    return otherParticipant?.avatarUrl || `https://i.pravatar.cc/150?u=${otherParticipant?._id}`;
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await userService.searchUsers(query);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = async (selectedUser) => {
    try {
      console.log('Creating conversation with user:', selectedUser);
      console.log('Request data:', {
        type: 'direct',
        memberIds: [selectedUser._id]
      });
      
      // Create or find conversation with this user
      const response = await conversationService.createConversation(
        'direct',
        [selectedUser._id]
      );
      
      console.log('Conversation created successfully:', response);
      
      // Clear search and refresh conversations
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
      
      await fetchConversations();
      
      // Select the new/existing conversation
      if (response.conversation) {
        setSelectedConversation(response.conversation);
      }
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
      alert('Failed to start conversation: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="chat-layout"><div style={{padding: '20px'}}>Loading...</div></div>;
  }

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="header-profile">
            <div className="profile-avatar">
              <img src={user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?._id}`} alt="Profile" />
            </div>
            <div className="profile-info">
              <h3>{user?.displayName || user?.username}</h3>
            </div>
          </div>

          <div className="header-actions">
            <div className="header-btn" onClick={handleLogoutClick} title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a50000ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-power"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
            </div>
          </div>
        </div>

        <div className="search-container">
          <label className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 18" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.11584 0C12.5908 0 16.2308 3.64 16.2308 8.115C16.2308 10.2263 15.4206 12.1519 14.0947 13.5971L16.7037 16.2006C16.9478 16.4447 16.9487 16.8398 16.7045 17.0839C16.5828 17.2072 16.422 17.2681 16.262 17.2681C16.1028 17.2681 15.9428 17.2073 15.8203 17.0856L13.1799 14.4525C11.7909 15.5649 10.0297 16.2308 8.11584 16.2308C3.64083 16.2308 0 12.59 0 8.115C0 3.64 3.64083 0 8.11584 0ZM8.11584 1.25C4.33 1.25 1.25 4.32917 1.25 8.115C1.25 11.9008 4.33 14.9808 8.11584 14.9808C11.9008 14.9808 14.9808 11.9008 14.9808 8.115C14.9808 4.32917 11.9008 1.25 8.11584 1.25Z" fill="black" fillOpacity="0.3"/>
            </svg>
          </label>
          <input 
            type="text" 
            placeholder="Search users or conversations" 
            className="search-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="chats-tabs">
          <button className="tab active">ALL CHATS</button>
          <button className="tab">PRIVATE</button>
        </div>

        <div className="conversations-list">
          {isSearching && searchResults.length > 0 ? (
            // Show search results
            <>
              <div style={{padding: '10px 20px', fontSize: '12px', color: '#666', fontWeight: 'bold'}}>
                SEARCH RESULTS
              </div>
              {searchResults.map((searchUser) => (
                <div
                  key={searchUser._id}
                  className="conversation"
                  onClick={() => handleSelectSearchResult(searchUser)}
                >
                  <div className="avatar">
                    <img src={searchUser.avatarUrl || `https://i.pravatar.cc/150?u=${searchUser._id}`} alt={searchUser.displayName} />
                  </div>
                  <div className="conversation-info">
                    <h3>{searchUser.displayName || searchUser.username}</h3>
                    <p style={{fontSize: '13px', color: '#888'}}>
                      @{searchUser.username} • {searchUser.phoneNumber}
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : isSearching && searchQuery.trim().length > 0 ? (
            <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
              No users found for "{searchQuery}"
            </div>
          ) : conversations.length === 0 ? (
            <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`conversation ${selectedConversation?._id === conversation._id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="avatar">
                  <img src={getConversationAvatar(conversation)} alt={getConversationName(conversation)} />
                </div>
                <div className="conversation-info">
                  <h3>{getConversationName(conversation)}</h3>
                  <p>{formatMessagePreview(conversation.lastMessage)}</p>
                </div>
                <span className="time">
                  {conversation.lastMessageAt ? formatTime(conversation.lastMessageAt) : ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="avatar">
                  <img src={getConversationAvatar(selectedConversation)} alt={getConversationName(selectedConversation)} />
                </div>
                <div>
                  <h3>{getConversationName(selectedConversation)}</h3>
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
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0122 12.9921C16.1675 17.1462 17.1102 12.3403 19.7559 14.9842C22.3065 17.5341 23.7725 18.045 20.5409 21.2758C20.1361 21.6011 17.5642 25.5149 8.52562 16.4788C-0.514042 7.44167 3.39748 4.86713 3.72288 4.46245C6.96236 1.22275 7.46444 2.69727 10.0151 5.24722C12.6608 7.89218 7.85693 8.83793 12.0122 12.9921Z" fill="#BEBEBE"/>
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
              {messages.length === 0 ? (
                <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message._id} 
                    className={`message ${message.senderId === user?._id ? 'me' : 'other'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                    </div>
                    <span className="message-time">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <form className="message-input-container" onSubmit={handleSendMessage}>
              <div className="input-wrapper">
                <div className="emoji-btn">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#78787C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.5 15C12.3284 15 13 14.3284 13 13.5C13 12.6716 12.3284 12 11.5 12C10.6716 12 10 12.6716 10 13.5C10 14.3284 10.6716 15 11.5 15Z" fill="#7C7878"/>
                    <path d="M20.5 15C21.3284 15 22 14.3284 22 13.5C22 12.6716 21.3284 12 20.5 12C19.6716 12 19 12.6716 19 13.5C19 14.3284 19.6716 15 20.5 15Z" fill="#7C7878"/>
                    <path d="M21.2 19C20.6714 19.9107 19.9128 20.6667 19.0002 21.1922C18.0876 21.7176 17.053 21.9942 16 21.9942C14.9469 21.9942 13.9123 21.7176 12.9998 21.1922C12.0872 20.6667 11.3286 19.9107 10.8 19" stroke="#78787C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                    <path d="M20 9.99997L9.58749 20.5875C9.24277 20.9679 9.05756 21.4664 9.0702 21.9796C9.08283 22.4928 9.29235 22.9816 9.65538 23.3446C10.0184 23.7076 10.5071 23.9171 11.0204 23.9298C11.5336 23.9424 12.032 23.7572 12.4125 23.4125L24.825 10.825C25.5144 10.0641 25.8849 9.06718 25.8596 8.04071C25.8343 7.01423 25.4153 6.03678 24.6892 5.31073C23.9632 4.58469 22.9857 4.16565 21.9593 4.14037C20.9328 4.1151 19.9359 4.48553 19.175 5.17497L6.76249 17.7625C5.63864 18.8863 5.00726 20.4106 5.00726 22C5.00726 23.5893 5.63864 25.1136 6.76249 26.2375C7.88635 27.3613 9.41062 27.9927 11 27.9927C12.5894 27.9927 14.1136 27.3613 15.2375 26.2375L25.5 16" stroke="#78787C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <button type="submit" className="send-btn">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 8C21 5.23858 18.7614 3 16 3C13.2386 3 11 5.23858 11 8V16C11 18.7614 13.2386 21 16 21C18.7614 21 21 18.7614 21 16V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 25V29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24.95 17C24.6906 19.1915 23.6361 21.2116 21.9865 22.6774C20.3369 24.1433 18.2068 24.9529 16 24.9529C13.7932 24.9529 11.6631 24.1433 10.0135 22.6774C8.36391 21.2116 7.30944 19.1915 7.05 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999'}}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
