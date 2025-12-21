import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { conversationService } from '../services/conversationService';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useSocket } from '../hooks/useSocket';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ContactInfo from './components/ContactInfo';
import './Chat.css';

function Chat({ user, onLogout }) {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Custom hooks
  const { conversations, loading, fetchConversations, updateConversation } = useConversations();
  const { messages, fetchMessages, addMessage, sendMessage } = useMessages();

  // Socket handlers
  const handleNewMessage = useCallback((message) => {
    addMessage(message);
  }, [addMessage]);

  const handleConversationsUpdate = useCallback((conversationId, message) => {
    updateConversation(conversationId, message);
  }, [updateConversation]);

  useSocket(
    user?._id, 
    selectedConversation?._id, 
    handleNewMessage, 
    handleConversationsUpdate
  );

  // Initial data fetch
  useEffect(() => {
    const initializeConversations = async () => {
      const firstConversation = await fetchConversations();
      if (firstConversation) {
        setSelectedConversation(firstConversation);
      }
    };
    
    initializeConversations();
  }, [fetchConversations]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation, fetchMessages]);

  // Refetch conversations when returning to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchConversations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchConversations]);

  // Refetch conversations when user data changes
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user?.avatarUrl, user?.about, user?.username, user?.phoneNumber, fetchConversations]);

  // Handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConversation) return;

    const messageContent = inputMessage;
    setInputMessage('');

    try {
      await sendMessage(user?._id, selectedConversation, messageContent);
    } catch (error) {
      setInputMessage(messageContent);
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    }
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
      const response = await conversationService.createConversation(
        'direct',
        [selectedUser._id]
      );
      
      // Clear search and refresh
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
      
      await fetchConversations();
      
      if (response.conversation) {
        setSelectedConversation(response.conversation);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start conversation: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="chat-layout">
        <div style={{padding: '20px'}}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      <Sidebar 
        user={user}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        searchResults={searchResults}
        isSearching={isSearching}
        onSelectSearchResult={handleSelectSearchResult}
      />

      <ChatArea 
        user={user}
        selectedConversation={selectedConversation}
        messages={messages}
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onToggleContactInfo={() => setShowContactInfo(!showContactInfo)}
      />

      {showContactInfo && (
        <ContactInfo 
          selectedConversation={selectedConversation}
          user={user}
          onClose={() => setShowContactInfo(false)}
        />
      )}
    </div>
  );
}

export default Chat;
