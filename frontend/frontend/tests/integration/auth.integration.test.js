import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../../src/services/authService';
import { setAuthToken } from '../../src/services/api';

describe('🔐 AUTH SERVICE INTEGRATION', () => {
  
  beforeEach(() => {
    localStorage.clear();
    setAuthToken(null);
  });

  describe('IT-AUTH-01: User Registration', () => {
    it('✅ Đăng ký thành công với thông tin hợp lệ', async () => {
      const userData = {
        username: 'newuser',
        phoneNumber: '0999999999',
        password: 'password123'
      };

      const response = await authService.register(userData);

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.username).toBe(userData.username);
      expect(response.user.phoneNumber).toBe(userData.phoneNumber);
    });

    it('❌ Không cho đăng ký thiếu thông tin bắt buộc', async () => {
      const incompleteData = {
        username: 'testuser'
        // Missing phoneNumber and password
      };

      await expect(authService.register(incompleteData))
        .rejects.toThrow();
    });

    it('❌ Không cho đăng ký thiếu username', async () => {
      const incompleteData = {
        phoneNumber: '0123456789',
        password: 'password123'
        // Missing username
      };

      await expect(authService.register(incompleteData))
        .rejects.toThrow();
    });
  });

  describe('IT-AUTH-02: User Login', () => {
    it('✅ Đăng nhập thành công với credentials đúng', async () => {
      const credentials = {
        phoneNumber: '0123456789',
        password: 'password123'
      };

      const response = await authService.login(credentials);

      expect(response).toBeDefined();
      expect(response.accessToken).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.phoneNumber).toBe('0123456789');
      
      // Check token is stored
      const storedToken = localStorage.getItem('accessToken');
      expect(storedToken).toBe('mock_access_token_12345');
    });

    it('❌ Từ chối đăng nhập với password sai', async () => {
      const credentials = {
        phoneNumber: '0123456789',
        password: 'wrongpassword'
      };

      await expect(authService.login(credentials))
        .rejects.toThrow();
    });

    it('❌ Từ chối đăng nhập với phoneNumber không tồn tại', async () => {
      const credentials = {
        phoneNumber: '0000000000',
        password: 'password123'
      };

      await expect(authService.login(credentials))
        .rejects.toThrow();
    });
  });

  describe('IT-AUTH-03: Logout', () => {
    it('✅ Logout thành công và xóa token', async () => {
      // First login
      await authService.login({
        phoneNumber: '0123456789',
        password: 'password123'
      });

      expect(localStorage.getItem('accessToken')).toBeTruthy();

      // Then logout
      const response = await authService.logout();

      expect(response.message).toBe('Logout successful');
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('IT-AUTH-04: Refresh Token', () => {
    it('✅ Refresh token thành công', async () => {
      const response = await authService.refreshToken();

      expect(response).toBeDefined();
      expect(response.accessToken).toBe('new_mock_access_token');
      expect(localStorage.getItem('accessToken')).toBe('new_mock_access_token');
    });
  });
});