import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide initial unauthenticated state', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login and store token in localStorage', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    const token = 'test-jwt-token';
    const userData = { id: '123', email: 'test@example.com', name: 'Test User' };

    act(() => {
      result.current.login(token, userData);
    });

    expect(result.current.user).toEqual(userData);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe(token);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(userData);
  });

  it('should logout and remove token from localStorage', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    const token = 'test-jwt-token';
    const userData = { id: '123', email: 'test@example.com', name: 'Test User' };

    act(() => {
      result.current.login(token, userData);
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should retrieve token using getToken', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    const token = 'test-jwt-token';
    const userData = { id: '123', email: 'test@example.com', name: 'Test User' };

    act(() => {
      result.current.login(token, userData);
    });

    expect(result.current.getToken()).toBe(token);
  });

  it('should restore user from localStorage on mount', () => {
    const token = 'existing-token';
    const userData = { id: '456', email: 'existing@example.com', name: 'Existing User' };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for useEffect to complete
    expect(result.current.user).toEqual(userData);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
