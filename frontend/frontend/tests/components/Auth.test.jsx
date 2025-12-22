import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../../src/pages/Auth';
import * as authService from '../../src/services/authService';

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

describe('🔐 AUTH PAGE COMPONENT TEST', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnLogin.mockClear();
    global.alert.mockClear();
  });

  const renderAuth = () => {
    return render(
      <BrowserRouter>
        <Auth onLogin={mockOnLogin} />
      </BrowserRouter>
    );
  };

  describe('AUTH-UI-01: Initial Render', () => {
    it('✅ Renders login form by default', () => {
      renderAuth();
      
      // Use getAllByText for multiple matches (h1 and button both have "Log in")
      const loginElements = screen.getAllByText(/log in/i);
      expect(loginElements.length).toBeGreaterThan(0);
      expect(screen.getByPlaceholderText(/phone number/i)).toBeTruthy();
      expect(screen.getByPlaceholderText(/password/i)).toBeTruthy();
    });

    it('✅ Shows login button initially', () => {
      renderAuth();
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeTruthy();
    });

    it('✅ Shows toggle to signup', () => {
      renderAuth();
      
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      expect(signupToggle).toBeTruthy();
    });

    it('✅ Does not show username field in login mode', () => {
      renderAuth();
      
      const usernameInput = screen.queryByPlaceholderText(/choose a username/i);
      expect(usernameInput).toBeNull();
    });

    it('✅ Does not show confirm password field in login mode', () => {
      renderAuth();
      
      const confirmPasswordInputs = screen.queryAllByPlaceholderText(/confirm/i);
      expect(confirmPasswordInputs.length).toBe(0);
    });
  });

  describe('AUTH-UI-02: Mode Toggle', () => {
    it('✅ Toggles to signup mode when clicking Sign up', async () => {
      renderAuth();
      
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupToggle);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/choose a username/i)).toBeTruthy();
      });
    });

    it('✅ Shows username and confirm password in signup mode', async () => {
      renderAuth();
      
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupToggle);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/choose a username/i)).toBeTruthy();
        expect(screen.getByPlaceholderText(/confirm your password/i)).toBeTruthy();
      });
    });

    it('✅ Shows Create Account button in signup mode', async () => {
      renderAuth();
      
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupToggle);
      
      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create account/i });
        expect(createButton).toBeTruthy();
      });
    });

    it('✅ Clears form when toggling modes', async () => {
      renderAuth();
      
      // Fill in login form
      const phoneInput = screen.getByPlaceholderText(/phone number/i);
      fireEvent.change(phoneInput, { target: { value: '0123456789' } });
      
      // Toggle to signup
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupToggle);
      
      await waitFor(() => {
        const phoneInputAfter = screen.getByPlaceholderText(/phone number/i);
        expect(phoneInputAfter.value).toBe('');
      });
    });

    it('✅ Toggles back to login mode', async () => {
      renderAuth();
      
      // Go to signup
      let toggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(toggle);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/choose a username/i)).toBeTruthy();
      });
      
      // Go back to login
      toggle = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(toggle);
      
      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/choose a username/i)).toBeNull();
      });
    });
  });

  describe('AUTH-UI-03: Form Input', () => {
    it('✅ Updates phone number input', () => {
      renderAuth();
      
      const phoneInput = screen.getByPlaceholderText(/phone number/i);
      fireEvent.change(phoneInput, { target: { value: '0123456789' } });
      
      expect(phoneInput.value).toBe('0123456789');
    });

    it('✅ Updates password input', () => {
      renderAuth();
      
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
      
      expect(passwordInput.value).toBe('mypassword');
    });

    it('✅ Updates username input in signup mode', async () => {
      renderAuth();
      
      // Switch to signup
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupToggle);
      
      await waitFor(() => {
        const usernameInput = screen.getByPlaceholderText(/choose a username/i);
        fireEvent.change(usernameInput, { target: { value: 'newuser123' } });
        expect(usernameInput.value).toBe('newuser123');
      });
    });

    it('✅ Updates confirm password in signup mode', async () => {
      renderAuth();
      
      // Switch to signup
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupToggle);
      
      await waitFor(() => {
        const confirmInput = screen.getByPlaceholderText(/confirm your password/i);
        fireEvent.change(confirmInput, { target: { value: 'password123' } });
        expect(confirmInput.value).toBe('password123');
      });
    });
  });

  describe('AUTH-UI-04: Form Validation', () => {
    it('❌ Shows alert when passwords do not match in signup', async () => {
      renderAuth();
      
      // Switch to signup
      const signupToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signupToggle);
      
      await waitFor(async () => {
        // Fill form with mismatched passwords
        fireEvent.change(screen.getByPlaceholderText(/choose a username/i), {
          target: { value: 'testuser' }
        });
        fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
          target: { value: '0123456789' }
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
          target: { value: 'password123' }
        });
        fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), {
          target: { value: 'password456' }
        });
        
        // Submit form
        const form = screen.getByRole('button', { name: /create account/i }).closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalledWith('Passwords do not match!');
        });
      });
    });

    it('✅ All required fields have required attribute', () => {
      renderAuth();
      
      const phoneInput = screen.getByPlaceholderText(/phone number/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      
      expect(phoneInput.required).toBe(true);
      expect(passwordInput.required).toBe(true);
    });
  });

  describe('AUTH-UI-05: Login Submission', () => {
    it('✅ Calls authService.login with correct data', async () => {
      const loginSpy = vi.spyOn(authService.authService, 'login')
        .mockResolvedValue({
          user: { username: 'testuser', _id: 'user123' },
          accessToken: 'token123'
        });

      renderAuth();
      
      // Fill login form
      fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
        target: { value: '0123456789' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });
      
      // Submit
      const form = screen.getByRole('button', { name: /log in/i }).closest('form');
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledWith({
          phoneNumber: '0123456789',
          password: 'password123'
        });
      });

      loginSpy.mockRestore();
    });

    it('✅ Calls onLogin callback after successful login', async () => {
      const mockUser = { username: 'testuser', _id: 'user123' };
      vi.spyOn(authService.authService, 'login')
        .mockResolvedValue({
          user: mockUser,
          accessToken: 'token123'
        });

      renderAuth();
      
      fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
        target: { value: '0123456789' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });
      
      const form = screen.getByRole('button', { name: /log in/i }).closest('form');
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
      });
    });

    it('✅ Navigates to /chat after successful login', async () => {
      vi.spyOn(authService.authService, 'login')
        .mockResolvedValue({
          user: { username: 'testuser', _id: 'user123' },
          accessToken: 'token123'
        });

      renderAuth();
      
      fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
        target: { value: '0123456789' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });
      
      const form = screen.getByRole('button', { name: /log in/i }).closest('form');
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/chat');
      });
    });

    it('❌ Shows alert on login error', async () => {
      vi.spyOn(authService.authService, 'login')
        .mockRejectedValue({
          response: { data: { message: 'Invalid credentials' } }
        });

      renderAuth();
      
      fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
        target: { value: '0123456789' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'wrongpassword' }
      });
      
      const form = screen.getByRole('button', { name: /log in/i }).closest('form');
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Invalid credentials');
      });
    });
  });

  describe('AUTH-UI-06: Signup Submission', () => {
    it('✅ Calls authService.register with correct data', async () => {
      const registerSpy = vi.spyOn(authService.authService, 'register')
        .mockResolvedValue({
          user: { username: 'newuser', _id: 'user456' },
          accessToken: 'token456'
        });

      renderAuth();
      
      // Switch to signup
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      await waitFor(async () => {
        // Fill signup form
        fireEvent.change(screen.getByPlaceholderText(/choose a username/i), {
          target: { value: 'newuser' }
        });
        fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
          target: { value: '0987654321' }
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
          target: { value: 'password123' }
        });
        fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), {
          target: { value: 'password123' }
        });
        
        // Submit
        const form = screen.getByRole('button', { name: /create account/i }).closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
          expect(registerSpy).toHaveBeenCalledWith({
            username: 'newuser',
            phoneNumber: '0987654321',
            password: 'password123'
          });
        });
      });

      registerSpy.mockRestore();
    });

    it('❌ Shows alert on registration error', async () => {
      vi.spyOn(authService.authService, 'register')
        .mockRejectedValue({
          response: { data: { message: 'Username already exists' } }
        });

      renderAuth();
      
      // Switch to signup
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      await waitFor(async () => {
        fireEvent.change(screen.getByPlaceholderText(/choose a username/i), {
          target: { value: 'existinguser' }
        });
        fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
          target: { value: '0987654321' }
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
          target: { value: 'password123' }
        });
        fireEvent.change(screen.getByPlaceholderText(/confirm your password/i), {
          target: { value: 'password123' }
        });
        
        const form = screen.getByRole('button', { name: /create account/i }).closest('form');
        fireEvent.submit(form);
        
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalled();
        });
      });
    });
  });
});