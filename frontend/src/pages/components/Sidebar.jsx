import { useNavigate } from 'react-router-dom';
import { getUserAvatarUrl, getConversationName, getConversationAvatar, formatTime, formatMessagePreview, getOtherParticipant } from '../../utils/chatHelpers';
import StatusIndicator from '../../components/StatusIndicator';

function Sidebar({ 
  user, 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  searchQuery,
  onSearchChange,
  searchResults,
  isSearching,
  onSelectSearchResult,
  isUserOnline
}) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="header-profile">
          <div className="profile-avatar">
            <img src={getUserAvatarUrl(user)} alt="Profile" />
          </div>
          <div className="profile-info">
            <h3>{user?.displayName || user?.username}</h3>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-btn" onClick={() => navigate('/settings')} title="Settings">
            <svg width="50" height="44" viewBox="0 0 50 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.1587 23.7132C39.2406 23.1635 39.2815 22.5954 39.2815 21.9907C39.2815 21.4042 39.2406 20.8178 39.1383 20.2681L43.2915 17.3726C43.6597 17.1161 43.762 16.6213 43.537 16.2548L39.6088 10.1707C39.3633 9.76756 38.8518 9.63928 38.4017 9.76756L33.512 11.5268C32.489 10.8304 31.4047 10.244 30.1976 9.80421L29.4611 5.14954C29.3793 4.70973 28.9701 4.39819 28.4791 4.39819H20.6227C20.1317 4.39819 19.743 4.70973 19.6612 5.14954L18.9246 9.80421C17.7176 10.244 16.6128 10.8488 15.6103 11.5268L10.7205 9.76756C10.2704 9.62095 9.75895 9.76756 9.51344 10.1707L5.60575 16.2548C5.36024 16.6396 5.44208 17.1161 5.85126 17.3726L10.0045 20.2681C9.90217 20.8178 9.82033 21.4226 9.82033 21.9907C9.82033 22.5587 9.86125 23.1635 9.96354 23.7132L5.81034 26.6087C5.44208 26.8652 5.33978 27.36 5.56483 27.7265L9.49298 33.8106C9.73849 34.2137 10.25 34.342 10.7001 34.2137L15.5898 32.4545C16.6128 33.1509 17.6971 33.7373 18.9042 34.1771L19.6407 38.8318C19.743 39.2716 20.1317 39.5831 20.6227 39.5831H28.4791C28.9701 39.5831 29.3793 39.2716 29.4406 38.8318L30.1772 34.1771C31.3842 33.7373 32.489 33.1509 33.4915 32.4545L38.3813 34.2137C38.8314 34.3603 39.3429 34.2137 39.5884 33.8106L43.5165 27.7265C43.762 27.3234 43.6597 26.8652 43.271 26.6087L39.1587 23.7132ZM24.5509 28.5878C20.5 28.5878 17.1856 25.6191 17.1856 21.9907C17.1856 18.3622 20.5 15.3935 24.5509 15.3935C28.6018 15.3935 31.9162 18.3622 31.9162 21.9907C31.9162 25.6191 28.6018 28.5878 24.5509 28.5878Z" fill="black"/>
            </svg>
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
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="chats-tabs">
        <button className="tab active">ALL CHATS</button>
        <button className="tab">PRIVATE</button>
      </div>

      <div className="conversations-list">
        {isSearching && searchResults.length > 0 ? (
          <>
            <div style={{padding: '10px 20px', fontSize: '12px', color: '#666', fontWeight: 'bold'}}>
              SEARCH RESULTS
            </div>
            {searchResults.map((searchUser) => (
              <div
                key={searchUser._id}
                className="conversation"
                onClick={() => onSelectSearchResult(searchUser)}
              >
                <div className="avatar-wrapper">
                  <div className="avatar">
                    <img src={getUserAvatarUrl(searchUser)} alt={searchUser.displayName} />
                  </div>
                  <div className="status-badge">
                    <StatusIndicator isOnline={isUserOnline && isUserOnline(searchUser._id)} />
                  </div>
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
          conversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation, user?._id);
            return (
              <div
                key={conversation._id}
                className={`conversation ${selectedConversation?._id === conversation._id ? 'active' : ''}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="avatar-wrapper">
                  <div className="avatar">
                    <img src={getConversationAvatar(conversation, user?._id)} alt={getConversationName(conversation, user?._id)} />
                  </div>
                  {otherUser && (
                    <div className="status-badge">
                      <StatusIndicator isOnline={isUserOnline && isUserOnline(otherUser._id)} />
                    </div>
                  )}
                </div>
                <div className="conversation-info">
                  <h3>{getConversationName(conversation, user?._id)}</h3>
                  <p>{formatMessagePreview(conversation.lastMessage)}</p>
                </div>
                <span className="time">
                  {conversation.lastMessageAt ? formatTime(conversation.lastMessageAt) : ''}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;
