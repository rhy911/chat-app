import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5001/api';

// Mock users database
const mockUsers = [
  {
    _id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    displayName: 'Test User',
    phoneNumber: '0123456789',
    avatarUrl: 'https://i.pravatar.cc/150?u=user1'
  },
  {
    _id: 'user2',
    username: 'john_doe',
    email: 'john@example.com',
    displayName: 'John Doe',
    phoneNumber: '0987654321',
    avatarUrl: 'https://i.pravatar.cc/150?u=user2'
  }
];

// Mock conversations
const mockConversations = [
  {
    _id: 'conv1',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      _id: 'msg1',
      content: 'Hello there!',
      senderId: 'user2',
      createdAt: new Date().toISOString()
    },
    lastMessageAt: new Date().toISOString()
  }
];

// Mock messages
const mockMessages = [
  {
    _id: 'msg1',
    conversationId: 'conv1',
    senderId: 'user2',
    content: 'Hello there!',
    createdAt: new Date().toISOString()
  }
];

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    const body = await request.json();
    if (!body.username || !body.phoneNumber || !body.password) {
      return HttpResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      message: 'User registered successfully',
      user: {
        _id: 'new_user_id',
        username: body.username,
        phoneNumber: body.phoneNumber,
        displayName: body.displayName || body.username
      }
    }, { status: 201 });
  }),

  http.post(`${API_URL}/auth/signin`, async ({ request }) => {
    const body = await request.json();
    if (body.phoneNumber === '0123456789' && body.password === 'password123') {
      return HttpResponse.json({
        message: 'Login successful',
        accessToken: 'mock_access_token_12345',
        user: mockUsers[0]
      });
    }
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/signout`, () => {
    return HttpResponse.json({ message: 'Logout successful' });
  }),

  http.post(`${API_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: 'new_mock_access_token'
    });
  }),

  // User endpoints
  http.get(`${API_URL}/users/me`, () => {
    return HttpResponse.json({ user: mockUsers[0] });
  }),

  http.get(`${API_URL}/users/search`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    
    if (!query) {
      return HttpResponse.json({ users: [] });
    }

    const filtered = mockUsers.filter(u => 
      u.username.includes(query) || 
      u.displayName.includes(query)
    );

    return HttpResponse.json({ users: filtered });
  }),

  // Conversation endpoints
  http.get(`${API_URL}/conversations`, () => {
    return HttpResponse.json({ conversations: mockConversations });
  }),

  http.post(`${API_URL}/conversations`, async ({ request }) => {
    const body = await request.json();
    
    if (!body.memberIds || body.memberIds.length === 0) {
      return HttpResponse.json(
        { message: 'memberIds is required' },
        { status: 400 }
      );
    }

    if (body.type === 'group' && !body.name) {
      return HttpResponse.json(
        { message: 'Group name is required' },
        { status: 400 }
      );
    }

    const newConv = {
      _id: 'new_conv_id',
      type: body.type,
      participants: [mockUsers[0], mockUsers[1]],
      lastMessage: null,
      lastMessageAt: new Date().toISOString()
    };

    return HttpResponse.json({ 
      message: 'Conversation created',
      conversation: newConv 
    }, { status: 201 });
  }),

  http.get(`${API_URL}/conversations/:id/messages`, ({ params }) => {
    const { id } = params;
    const messages = mockMessages.filter(m => m.conversationId === id);
    return HttpResponse.json({ messages });
  }),

  // Message endpoints
  http.post(`${API_URL}/messages/direct`, async ({ request }) => {
    const body = await request.json();
    
    if (!body.recipientId || !body.content) {
      return HttpResponse.json(
        { message: 'recipientId and content are required' },
        { status: 400 }
      );
    }

    const newMessage = {
      _id: 'new_msg_id',
      conversationId: body.conversationId || 'conv1',
      senderId: 'user1',
      content: body.content,
      createdAt: new Date().toISOString()
    };

    return HttpResponse.json({ 
      message: 'Message sent',
      message: newMessage 
    }, { status: 201 });
  }),

  http.post(`${API_URL}/messages/group`, async ({ request }) => {
    const body = await request.json();
    
    if (!body.conversationId || !body.content) {
      return HttpResponse.json(
        { message: 'conversationId and content are required' },
        { status: 400 }
      );
    }

    const newMessage = {
      _id: 'new_group_msg_id',
      conversationId: body.conversationId,
      senderId: 'user1',
      content: body.content,
      createdAt: new Date().toISOString()
    };

    return HttpResponse.json({ 
      message: 'Message sent',
      message: newMessage 
    }, { status: 201 });
  })
];