import { describe, it, expect, beforeEach } from 'vitest';
import { messageService } from '../../src/services/messageService';
import { setAuthToken } from '../../src/services/api';

describe('✉️ MESSAGE SERVICE INTEGRATION', () => {
  
  beforeEach(() => {
    setAuthToken('mock_token');
  });

  describe('IT-MSG-01: Send Direct Message', () => {
    it('✅ Gửi tin nhắn direct thành công', async () => {
      const response = await messageService.sendMessage(
        'user2',
        'Hello, this is a test message'
      );

      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.message._id).toBeDefined();
      expect(response.message.content).toBe('Hello, this is a test message');
      expect(response.message.senderId).toBeDefined();
      expect(response.message.createdAt).toBeDefined();
    });

    it('✅ Gửi tin nhắn với conversationId', async () => {
      const response = await messageService.sendMessage(
        'user2',
        'Message in existing conversation',
        'conv1'
      );

      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.message.conversationId).toBe('conv1');
      expect(response.message.content).toBe('Message in existing conversation');
    });

    it('❌ Không thể gửi tin nhắn thiếu recipientId', async () => {
      await expect(
        messageService.sendMessage(null, 'Test message')
      ).rejects.toThrow();
    });

    it('❌ Không thể gửi tin nhắn thiếu content', async () => {
      await expect(
        messageService.sendMessage('user2', null)
      ).rejects.toThrow();
    });
  });

  describe('IT-MSG-02: Send Group Message', () => {
    it('✅ Gửi tin nhắn group thành công', async () => {
      const response = await messageService.sendGroupMessage(
        'conv1',
        'Hello group!'
      );

      expect(response).toBeDefined();
      expect(response.message).toBeDefined();
      expect(response.message._id).toBeDefined();
      expect(response.message.content).toBe('Hello group!');
      expect(response.message.conversationId).toBe('conv1');
    });

    it('❌ Không thể gửi group message thiếu conversationId', async () => {
      await expect(
        messageService.sendGroupMessage(null, 'Test message')
      ).rejects.toThrow();
    });

    it('❌ Không thể gửi group message thiếu content', async () => {
      await expect(
        messageService.sendGroupMessage('conv1', null)
      ).rejects.toThrow();
    });
  });
});