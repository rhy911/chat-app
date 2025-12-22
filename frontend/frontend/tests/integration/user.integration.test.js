import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from '../../src/services/userService';
import { setAuthToken } from '../../src/services/api';

describe('👤 USER SERVICE INTEGRATION', () => {
  
  beforeEach(() => {
    setAuthToken('mock_token');
  });

  describe('IT-USER-01: Get Current User', () => {
    it('✅ Lấy thông tin user hiện tại', async () => {
      const response = await userService.getCurrentUser();

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user._id).toBe('user1');
      expect(response.user.username).toBe('testuser');
      expect(response.user.email).toBe('test@example.com');
    });
  });

  describe('IT-USER-02: Search Users', () => {
    it('✅ Tìm kiếm users theo username', async () => {
      const response = await userService.searchUsers('john');

      expect(response).toBeDefined();
      expect(response.users).toBeDefined();
      expect(Array.isArray(response.users)).toBe(true);
      expect(response.users.length).toBeGreaterThan(0);
      expect(response.users[0].username).toContain('john');
    });

    it('✅ Tìm kiếm users theo displayName', async () => {
      const response = await userService.searchUsers('John Doe');

      expect(response).toBeDefined();
      expect(response.users).toBeDefined();
      expect(response.users.length).toBeGreaterThan(0);
    });

    it('✅ Trả về mảng rỗng khi không tìm thấy', async () => {
      const response = await userService.searchUsers('nonexistentuser12345');

      expect(response).toBeDefined();
      expect(response.users).toBeDefined();
      expect(Array.isArray(response.users)).toBe(true);
      expect(response.users.length).toBe(0);
    });

    it('✅ Trả về mảng rỗng với query rỗng', async () => {
      const response = await userService.searchUsers('');

      expect(response).toBeDefined();
      expect(response.users).toBeDefined();
      expect(Array.isArray(response.users)).toBe(true);
      expect(response.users.length).toBe(0);
    });
  });
});