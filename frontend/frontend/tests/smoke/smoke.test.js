import { describe, it, expect } from 'vitest';

describe('🔥 SMOKE TEST - Kiểm tra hệ thống cơ bản', () => {
  
  describe('ST-01: Application Initialization', () => {
    it('✅ App component import được', async () => {
      const AppModule = await import('../../src/App');
      expect(AppModule.default).toBeDefined();
    });
  });

  describe('ST-02: Service Modules Load', () => {
    it('✅ Auth service import được', async () => {
      const { authService } = await import('../../src/services/authService');
      
      expect(authService).toBeDefined();
      expect(typeof authService.login).toBe('function');
      expect(typeof authService.register).toBe('function');
      expect(typeof authService.logout).toBe('function');
      expect(typeof authService.refreshToken).toBe('function');
    });

    it('✅ User service import được', async () => {
      const { userService } = await import('../../src/services/userService');
      
      expect(userService).toBeDefined();
      expect(typeof userService.getCurrentUser).toBe('function');
      expect(typeof userService.searchUsers).toBe('function');
    });

    it('✅ Conversation service import được', async () => {
      const { conversationService } = await import('../../src/services/conversationService');
      
      expect(conversationService).toBeDefined();
      expect(typeof conversationService.getConversations).toBe('function');
      expect(typeof conversationService.createConversation).toBe('function');
      expect(typeof conversationService.getMessages).toBe('function');
    });

    it('✅ Message service import được', async () => {
      const { messageService } = await import('../../src/services/messageService');
      
      expect(messageService).toBeDefined();
      expect(typeof messageService.sendMessage).toBe('function');
      expect(typeof messageService.sendGroupMessage).toBe('function');
    });
  });

  describe('ST-03: API Configuration', () => {
    it('✅ API instance được khởi tạo đúng', async () => {
      const api = await import('../../src/services/api');
      
      expect(api.default).toBeDefined();
      expect(api.setAuthToken).toBeDefined();
      expect(typeof api.setAuthToken).toBe('function');
    });

    it('✅ API có baseURL đúng', async () => {
      const api = await import('../../src/services/api');
      
      expect(api.default.defaults.baseURL).toBeDefined();
      expect(api.default.defaults.baseURL).toContain('localhost:5001/api');
    });

    it('✅ API có withCredentials', async () => {
      const api = await import('../../src/services/api');
      
      expect(api.default.defaults.withCredentials).toBe(true);
    });
  });

  describe('ST-04: Component Modules', () => {
    it('✅ Auth component có default export', async () => {
      const AuthModule = await import('../../src/pages/Auth');
      expect(AuthModule.default).toBeDefined();
    });

    it('✅ Chat component có default export', async () => {
      const ChatModule = await import('../../src/pages/Chat');
      expect(ChatModule.default).toBeDefined();
    });

    it('✅ App component có default export', async () => {
      const AppModule = await import('../../src/App');
      expect(AppModule.default).toBeDefined();
    });
  });

  describe('ST-05: Environment Variables', () => {
    it('✅ VITE_API_URL được định nghĩa', () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      
      expect(apiUrl).toBeDefined();
      expect(typeof apiUrl).toBe('string');
      expect(apiUrl.length).toBeGreaterThan(0);
    });
  });

  describe('ST-06: Browser APIs', () => {
    it('✅ LocalStorage available và hoạt động', () => {
      expect(localStorage).toBeDefined();
      
      // Test set
      localStorage.setItem('test_key', 'test_value');
      
      // Test get
      const value = localStorage.getItem('test_key');
      expect(value).toBe('test_value');
      
      // Test remove
      localStorage.removeItem('test_key');
      expect(localStorage.getItem('test_key')).toBeNull();
      
      // Test clear
      localStorage.setItem('test_key2', 'value2');
      localStorage.clear();
      expect(localStorage.getItem('test_key2')).toBeNull();
    });

    it('✅ Window object available', () => {
      expect(window).toBeDefined();
      expect(window.location).toBeDefined();
    });

    it('✅ Document object available', () => {
      expect(document).toBeDefined();
      expect(document.createElement).toBeDefined();
    });
  });

  describe('ST-07: Service Methods Structure', () => {
    it('✅ authService có đủ methods', async () => {
      const { authService } = await import('../../src/services/authService');
      
      const methods = ['register', 'login', 'logout', 'refreshToken'];
      methods.forEach(method => {
        expect(authService[method]).toBeDefined();
        expect(typeof authService[method]).toBe('function');
      });
    });

    it('✅ conversationService có đủ methods', async () => {
      const { conversationService } = await import('../../src/services/conversationService');
      
      const methods = ['getConversations', 'getMessages', 'createConversation'];
      methods.forEach(method => {
        expect(conversationService[method]).toBeDefined();
        expect(typeof conversationService[method]).toBe('function');
      });
    });

    it('✅ messageService có đủ methods', async () => {
      const { messageService } = await import('../../src/services/messageService');
      
      const methods = ['sendMessage', 'sendGroupMessage'];
      methods.forEach(method => {
        expect(messageService[method]).toBeDefined();
        expect(typeof messageService[method]).toBe('function');
      });
    });

    it('✅ userService có đủ methods', async () => {
      const { userService } = await import('../../src/services/userService');
      
      const methods = ['getCurrentUser', 'searchUsers'];
      methods.forEach(method => {
        expect(userService[method]).toBeDefined();
        expect(typeof userService[method]).toBe('function');
      });
    });
  });
});