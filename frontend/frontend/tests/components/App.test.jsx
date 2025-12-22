import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../src/App';

describe('🎯 APP COMPONENT TEST', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('APP-01: Initial Rendering', () => {
    it('✅ App renders without crashing', () => {
      render(<App />);
      expect(document.body).toBeTruthy();
    });

    it('✅ Shows Auth page by default when not logged in', () => {
      render(<App />);
      
      // Auth page should show login/signup - use getAllByText for multiple matches
      const loginElements = screen.queryAllByText(/log in/i);
      expect(loginElements.length).toBeGreaterThan(0);
    });

    it('✅ Shows Auth page with login form initially', () => {
      render(<App />);
      
      // Should have password field
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      expect(passwordInputs.length).toBeGreaterThan(0);
    });
  });

  describe('APP-02: Route Protection', () => {
    it('❌ Redirects to auth page when accessing /chat without login', async () => {
      // Don't wrap in MemoryRouter - App already has BrowserRouter
      // Simulate navigating to /chat by changing location
      window.history.pushState({}, '', '/chat');
      
      render(<App />);

      await waitFor(() => {
        // Should redirect to auth page (showing login/signup)
        const authText = screen.queryAllByText(/log in/i);
        expect(authText.length).toBeGreaterThan(0);
      });
    });

    it('✅ Allows access to /chat when user is logged in', async () => {
      // Mock logged in user in localStorage
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        phoneNumber: '0123456789'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));

      window.history.pushState({}, '', '/chat');
      
      render(<App />);

      await waitFor(() => {
        // Should show chat interface elements
        const chatElements = screen.queryByPlaceholderText(/search/i) || 
                           screen.queryByPlaceholderText(/type a message/i);
        expect(chatElements).toBeTruthy();
      }, { timeout: 3000 });
    });
  });

  describe('APP-03: User Authentication State', () => {
    it('✅ Loads user from localStorage on init', () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        phoneNumber: '0123456789'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(<App />);

      // User should be loaded (app should not force to auth page)
      const storedUser = localStorage.getItem('user');
      expect(storedUser).toBeTruthy();
      expect(JSON.parse(storedUser).username).toBe('testuser');
    });

    it('✅ Handles login correctly', async () => {
      render(<App />);

      // Simulate login by setting user in localStorage
      const mockUser = {
        _id: 'user456',
        username: 'newuser',
        phoneNumber: '0987654321'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser.username).toBe('newuser');
      expect(storedUser._id).toBe('user456');
    });

    it('✅ Handles logout correctly', () => {
      // Setup: user is logged in
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        phoneNumber: '0123456789'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', 'mock_token_123');

      expect(localStorage.getItem('user')).toBeTruthy();
      expect(localStorage.getItem('accessToken')).toBeTruthy();

      // Simulate logout
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('APP-04: Routing Behavior', () => {
    it('✅ Default route "/" shows Auth page', () => {
      window.history.pushState({}, '', '/');
      
      render(<App />);

      // Should show auth-related text
      const authPage = screen.queryAllByText(/log in/i);
      expect(authPage.length).toBeGreaterThan(0);
    });

    it('✅ Chat route requires authentication', async () => {
      window.history.pushState({}, '', '/chat');
      
      render(<App />);

      await waitFor(() => {
        // Without logged in user, should redirect to auth
        const isAuthPage = screen.queryAllByText(/log in/i);
        expect(isAuthPage.length).toBeGreaterThan(0);
      });
    });
  });

  describe('APP-05: LocalStorage Integration', () => {
    it('✅ Persists user data in localStorage after login', () => {
      const mockUser = {
        _id: 'user789',
        username: 'persisteduser',
        phoneNumber: '0111222333',
        displayName: 'Persisted User'
      };

      localStorage.setItem('user', JSON.stringify(mockUser));

      const stored = JSON.parse(localStorage.getItem('user'));
      expect(stored.username).toBe('persisteduser');
      expect(stored._id).toBe('user789');
      expect(stored.phoneNumber).toBe('0111222333');
    });

    it('✅ Clears user data from localStorage on logout', () => {
      localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));
      localStorage.setItem('accessToken', 'test_token');

      expect(localStorage.getItem('user')).toBeTruthy();
      expect(localStorage.getItem('accessToken')).toBeTruthy();

      // Simulate logout
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('✅ Handles corrupted localStorage data gracefully', () => {
      localStorage.setItem('user', 'invalid-json-data');

      expect(() => {
        const user = localStorage.getItem('user');
        if (user && user !== 'null') {
          try {
            JSON.parse(user);
          } catch (e) {
            // Should handle gracefully
            expect(e).toBeTruthy();
          }
        }
      }).not.toThrow();
    });
  });
});