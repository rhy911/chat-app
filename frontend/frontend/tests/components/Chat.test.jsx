import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Chat from '../../src/pages/Chat';
import { conversationService } from '../../src/services/conversationService';
import { messageService } from '../../src/services/messageService';
import { authService } from '../../src/services/authService';
import { userService } from '../../src/services/userService';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.alert
global.alert = vi.fn();

describe('💬 CHAT PAGE COMPONENT TEST', () => {
  const mockUser = {
    _id: 'user123',
    username: 'testuser',
    displayName: 'Test User',
    phoneNumber: '0123456789',
    avatarUrl: 'https://example.com/avatar.jpg'
  };

  const mockOnLogout = vi.fn();

  const mockConversations = [
    {
      _id: 'conv1',
      type: 'direct',
      participants: [
        mockUser,
        { _id: 'user456', username: 'friend1', displayName: 'Friend One' }
      ],
      lastMessage: { content: 'Hello there!' },
      lastMessageAt: new Date().toISOString()
    },
    {
      _id: 'conv2',
      type: 'group',
      group: { name: 'Team Chat' },
      participants: [mockUser, { _id: 'user789', username: 'member' }],
      lastMessage: { content: 'Meeting at 3pm' },
      lastMessageAt: new Date().toISOString()
    }
  ];

  const mockMessages = [
    {
      _id: 'msg1',
      senderId: 'user456',
      content: 'Hi! How are you?',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'msg2',
      senderId: 'user123',
      content: 'I am good, thanks!',
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnLogout.mockClear();
    global.alert.mockClear();
    
    // Default mocks
    vi.spyOn(conversationService, 'getConversations')
      .mockResolvedValue({ conversations: mockConversations });
    vi.spyOn(conversationService, 'getMessages')
      .mockResolvedValue({ messages: mockMessages });
    vi.spyOn(messageService, 'sendMessage')
      .mockResolvedValue({ message: { _id: 'newmsg', content: 'New message' } });
    vi.spyOn(userService, 'searchUsers')
      .mockResolvedValue({ users: [] });
  });

  const renderChat = () => {
    return render(
      <BrowserRouter>
        <Chat user={mockUser} onLogout={mockOnLogout} />
      </BrowserRouter>
    );
  };

  describe('CHAT-UI-01: Initial Render & Loading', () => {
    it('✅ Shows loading state initially', () => {
      renderChat();
      
      expect(screen.getByText(/loading/i)).toBeTruthy();
    });

    it('✅ Loads conversations on mount', async () => {
      renderChat();
      
      await waitFor(() => {
        expect(conversationService.getConversations).toHaveBeenCalled();
      });
    });

    it('✅ Displays user profile in sidebar', async () => {
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByText(mockUser.displayName || mockUser.username)).toBeTruthy();
      });
    });

    it('✅ Shows search input', async () => {
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search users or conversations/i)).toBeTruthy();
      });
    });
  });

  describe('CHAT-UI-02: Conversations List', () => {
    it('✅ Displays list of conversations', async () => {
      renderChat();
      
      await waitFor(() => {
        // Use getAllByText for multiple matches
        const friendNames = screen.getAllByText('Friend One');
        expect(friendNames.length).toBeGreaterThan(0);
        expect(screen.getByText('Team Chat')).toBeTruthy();
      });
    });

    it('✅ Shows last message preview', async () => {
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByText(/hello there/i)).toBeTruthy();
      });
    });

    it('✅ Selects first conversation by default', async () => {
      renderChat();
      
      await waitFor(() => {
        expect(conversationService.getMessages)
          .toHaveBeenCalledWith('conv1');
      });
    });

    it('✅ Shows "No conversations yet" when empty', async () => {
      vi.spyOn(conversationService, 'getConversations')
        .mockResolvedValue({ conversations: [] });
      
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByText(/no conversations yet/i)).toBeTruthy();
      });
    });

    it('✅ Handles conversation selection', async () => {
      renderChat();
      
      await waitFor(async () => {
        const teamChat = screen.getByText('Team Chat');
        fireEvent.click(teamChat.closest('.conversation'));
        
        await waitFor(() => {
          expect(conversationService.getMessages)
            .toHaveBeenCalledWith('conv2');
        });
      });
    });
  });

  describe('CHAT-UI-03: Messages Display', () => {
    it('✅ Displays messages in selected conversation', async () => {
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByText('Hi! How are you?')).toBeTruthy();
        expect(screen.getByText('I am good, thanks!')).toBeTruthy();
      });
    });

    it('✅ Shows "No messages yet" when conversation is empty', async () => {
      vi.spyOn(conversationService, 'getMessages')
        .mockResolvedValue({ messages: [] });
      
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByText(/no messages yet/i)).toBeTruthy();
      });
    });

    it('✅ Distinguishes between own and other messages', async () => {
      renderChat();
      
      await waitFor(() => {
        const messagesContainer = screen.getByText('Hi! How are you?').closest('.message');
        expect(messagesContainer.classList.contains('other')).toBe(true);
        
        const ownMessage = screen.getByText('I am good, thanks!').closest('.message');
        expect(ownMessage.classList.contains('me')).toBe(true);
      });
    });

    it('✅ Formats message timestamps', async () => {
      const { container } = renderChat();
      
      await waitFor(() => {
        // Use querySelectorAll on container instead of screen.getAllByClassName
        const times = container.querySelectorAll('.message-time');
        expect(times.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CHAT-UI-04: Sending Messages', () => {
    it('✅ Shows message input field', async () => {
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/type a message/i)).toBeTruthy();
      });
    });

    it('✅ Updates input value on typing', async () => {
      renderChat();
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText(/type a message/i);
        fireEvent.change(input, { target: { value: 'Hello world' } });
        expect(input.value).toBe('Hello world');
      });
    });

    it('✅ Sends message on form submit', async () => {
      renderChat();
      
      await waitFor(async () => {
        const input = screen.getByPlaceholderText(/type a message/i);
        fireEvent.change(input, { target: { value: 'Test message' } });
        
        const form = input.closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
          expect(messageService.sendMessage).toHaveBeenCalled();
        });
      });
    });

    it('✅ Clears input after sending', async () => {
      renderChat();
      
      await waitFor(async () => {
        const input = screen.getByPlaceholderText(/type a message/i);
        fireEvent.change(input, { target: { value: 'Test message' } });
        
        const form = input.closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
          expect(input.value).toBe('');
        });
      });
    });

    it('❌ Does not send empty messages', async () => {
      renderChat();
      
      await waitFor(async () => {
        const input = screen.getByPlaceholderText(/type a message/i);
        fireEvent.change(input, { target: { value: '   ' } });
        
        const form = input.closest('form');
        fireEvent.submit(form);
        
        // Should not call sendMessage for empty input
        await waitFor(() => {
          const callCount = messageService.sendMessage.mock.calls.length;
          expect(callCount).toBe(0);
        });
      });
    });

    it('❌ Shows alert when recipient not found', async () => {
      const conversationsWithoutParticipant = [{
        _id: 'conv1',
        type: 'direct',
        participants: [mockUser], // Only current user
        lastMessage: null,
        lastMessageAt: null
      }];
      
      vi.spyOn(conversationService, 'getConversations')
        .mockResolvedValue({ conversations: conversationsWithoutParticipant });
      
      renderChat();
      
      await waitFor(async () => {
        const input = screen.getByPlaceholderText(/type a message/i);
        fireEvent.change(input, { target: { value: 'Test' } });
        
        const form = input.closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalledWith('Cannot find recipient');
        });
      });
    });
  });

  describe('CHAT-UI-05: User Search', () => {
    it('✅ Shows search results when typing', async () => {
      const mockSearchResults = [
        { _id: 'user999', username: 'newuser', displayName: 'New User', phoneNumber: '0111222333' }
      ];
      
      vi.spyOn(userService, 'searchUsers')
        .mockResolvedValue({ users: mockSearchResults });
      
      renderChat();
      
      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText(/search users or conversations/i);
        fireEvent.change(searchInput, { target: { value: 'newuser' } });
        
        await waitFor(() => {
          expect(screen.getByText('New User')).toBeTruthy();
        });
      });
    });

    it('✅ Clears search results when search is empty', async () => {
      renderChat();
      
      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText(/search users or conversations/i);
        
        // Type something
        fireEvent.change(searchInput, { target: { value: 'test' } });
        
        // Clear it
        fireEvent.change(searchInput, { target: { value: '' } });
        
        await waitFor(() => {
          expect(screen.queryByText('SEARCH RESULTS')).toBeNull();
        });
      });
    });

    it('✅ Shows "No users found" message', async () => {
      vi.spyOn(userService, 'searchUsers')
        .mockResolvedValue({ users: [] });
      
      renderChat();
      
      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText(/search users or conversations/i);
        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
        
        await waitFor(() => {
          expect(screen.getByText(/no users found/i)).toBeTruthy();
        });
      });
    });

    it('✅ Creates conversation when selecting search result', async () => {
      const mockSearchResults = [
        { _id: 'user999', username: 'newuser', displayName: 'New User' }
      ];
      
      vi.spyOn(userService, 'searchUsers')
        .mockResolvedValue({ users: mockSearchResults });
      
      // Mock createConversation to return a conversation with proper participants
      vi.spyOn(conversationService, 'createConversation')
        .mockResolvedValue({ 
          conversation: { 
            _id: 'newconv',
            type: 'direct',
            participants: [mockUser, mockSearchResults[0]]
          } 
        });
      
      renderChat();
      
      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText(/search users or conversations/i);
        fireEvent.change(searchInput, { target: { value: 'newuser' } });
        
        await waitFor(async () => {
          const result = screen.getByText('New User');
          fireEvent.click(result.closest('.conversation'));
          
          await waitFor(() => {
            expect(conversationService.createConversation)
              .toHaveBeenCalledWith('direct', ['user999']);
          });
        });
      });
    });
  });

  describe('CHAT-UI-06: Logout Functionality', () => {
    it('✅ Shows logout button', async () => {
      renderChat();
      
      await waitFor(() => {
        const logoutBtn = screen.getByTitle('Logout');
        expect(logoutBtn).toBeTruthy();
      });
    });

    it('✅ Calls logout service on click', async () => {
      const logoutSpy = vi.spyOn(authService, 'logout')
        .mockResolvedValue({ message: 'Logged out' });
      
      renderChat();
      
      await waitFor(async () => {
        const logoutBtn = screen.getByTitle('Logout');
        fireEvent.click(logoutBtn);
        
        await waitFor(() => {
          expect(logoutSpy).toHaveBeenCalled();
        });
      });

      logoutSpy.mockRestore();
    });

    it('✅ Calls onLogout callback', async () => {
      vi.spyOn(authService, 'logout')
        .mockResolvedValue({ message: 'Logged out' });
      
      renderChat();
      
      await waitFor(async () => {
        const logoutBtn = screen.getByTitle('Logout');
        fireEvent.click(logoutBtn);
        
        await waitFor(() => {
          expect(mockOnLogout).toHaveBeenCalled();
        });
      });
    });

    it('✅ Navigates to home page after logout', async () => {
      vi.spyOn(authService, 'logout')
        .mockResolvedValue({ message: 'Logged out' });
      
      renderChat();
      
      await waitFor(async () => {
        const logoutBtn = screen.getByTitle('Logout');
        fireEvent.click(logoutBtn);
        
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        });
      });
    });

    it('✅ Navigates to home even on logout error', async () => {
      vi.spyOn(authService, 'logout')
        .mockRejectedValue(new Error('Logout failed'));
      
      renderChat();
      
      await waitFor(async () => {
        const logoutBtn = screen.getByTitle('Logout');
        fireEvent.click(logoutBtn);
        
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        });
      });
    });
  });

  describe('CHAT-UI-07: Conversation Info Display', () => {
    it('✅ Shows conversation name in header', async () => {
      renderChat();
      
      await waitFor(() => {
        // Should show the name of selected conversation (Friend One for direct chat)
        const headers = screen.getAllByText('Friend One');
        expect(headers.length).toBeGreaterThan(0);
      });
    });

    it('✅ Shows group name for group conversations', async () => {
      renderChat();
      
      await waitFor(async () => {
        const teamChat = screen.getByText('Team Chat');
        fireEvent.click(teamChat.closest('.conversation'));
        
        await waitFor(() => {
          const headers = screen.getAllByText('Team Chat');
          expect(headers.length).toBeGreaterThan(0);
        });
      });
    });

    it('✅ Shows "Select a conversation" when none selected', async () => {
      vi.spyOn(conversationService, 'getConversations')
        .mockResolvedValue({ conversations: [] });
      
      renderChat();
      
      await waitFor(() => {
        expect(screen.getByText(/select a conversation to start chatting/i)).toBeTruthy();
      });
    });
  });

  describe('CHAT-UI-08: Error Handling', () => {
    it('❌ Handles conversation fetch error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(conversationService, 'getConversations')
        .mockRejectedValue(new Error('Network error'));
      
      renderChat();
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    it('❌ Handles message fetch error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(conversationService, 'getMessages')
        .mockRejectedValue(new Error('Failed to load messages'));
      
      renderChat();
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    it('❌ Shows alert on send message error', async () => {
      vi.spyOn(messageService, 'sendMessage')
        .mockRejectedValue({
          response: { data: { message: 'Failed to send' } },
          message: 'Network error'
        });
      
      renderChat();
      
      await waitFor(async () => {
        const input = screen.getByPlaceholderText(/type a message/i);
        fireEvent.change(input, { target: { value: 'Test' } });
        
        const form = input.closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalled();
        });
      });
    });
  });
});