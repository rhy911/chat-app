import { describe, it, expect, beforeEach } from 'vitest';
import { conversationService } from '../../src/services/conversationService';
import { setAuthToken } from '../../src/services/api';

describe('💬 CONVERSATION SERVICE INTEGRATION', () => {
  
  beforeEach(() => {
    setAuthToken('mock_token');
  });

  describe('IT-CONV-01: Get Conversations', () => {
    it('✅ Lấy danh sách conversations', async () => {
      const response = await conversationService.getConversations();

      expect(response).toBeDefined();
      expect(response.conversations).toBeDefined();
      expect(Array.isArray(response.conversations)).toBe(true);
      expect(response.conversations.length).toBeGreaterThan(0);
      
      // Check structure
      const conv = response.conversations[0];
      expect(conv._id).toBeDefined();
      expect(conv.type).toBeDefined();
      expect(conv.participants).toBeDefined();
      expect(Array.isArray(conv.participants)).toBe(true);
    });
  });

  describe('IT-CONV-02: Create Conversation', () => {
    it('✅ Tạo direct conversation', async () => {
      const response = await conversationService.createConversation(
        'direct',
        ['user2']
      );

      expect(response).toBeDefined();
      expect(response.conversation).toBeDefined();
      expect(response.conversation._id).toBeDefined();
      expect(response.conversation.type).toBe('direct');
      expect(response.conversation.participants).toBeDefined();
    });

    it('✅ Tạo group conversation với tên', async () => {
      const response = await conversationService.createConversation(
        'group',
        ['user2', 'user3'],
        'Test Group'
      );

      expect(response).toBeDefined();
      expect(response.conversation).toBeDefined();
      expect(response.conversation.type).toBe('group');
    });

    it('❌ Không thể tạo conversation thiếu memberIds', async () => {
      await expect(
        conversationService.createConversation('direct', [])
      ).rejects.toThrow();
    });

    it('❌ Không thể tạo group conversation thiếu tên', async () => {
      await expect(
        conversationService.createConversation('group', ['user2'])
      ).rejects.toThrow();
    });
  });

  describe('IT-CONV-03: Get Messages', () => {
    it('✅ Lấy tin nhắn trong conversation', async () => {
      const response = await conversationService.getMessages('conv1');

      expect(response).toBeDefined();
      expect(response.messages).toBeDefined();
      expect(Array.isArray(response.messages)).toBe(true);
      
      if (response.messages.length > 0) {
        const msg = response.messages[0];
        expect(msg._id).toBeDefined();
        expect(msg.content).toBeDefined();
        expect(msg.senderId).toBeDefined();
        expect(msg.createdAt).toBeDefined();
      }
    });

    it('✅ Lấy tin nhắn với limit và cursor', async () => {
      const response = await conversationService.getMessages('conv1', 20, null);

      expect(response).toBeDefined();
      expect(response.messages).toBeDefined();
      expect(Array.isArray(response.messages)).toBe(true);
    });
  });
});