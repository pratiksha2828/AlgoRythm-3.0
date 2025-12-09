// ===========================================
// FRONTEND SECURITY UTILITIES
// ===========================================

import CryptoJS from 'crypto-js';

// ===========================================
// SECURE STORAGE UTILITIES
// ===========================================

// Use Vite's env variables (import.meta.env) for frontend builds. Falls back to a default in dev.
const ENCRYPTION_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENCRYPTION_KEY) || 'default-key-change-in-production';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Secure token encryption/decryption
const encryptToken = (token) => {
  try {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Token encryption failed:', error);
    return null;
  }
};

const decryptToken = (encryptedToken) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Token decryption failed:', error);
    return null;
  }
};

// Validate token format and expiry
const isValidToken = (token, timestamp) => {
  if (!token || typeof token !== 'string') return false;
  if (!timestamp || isNaN(timestamp)) return false;
  
  const now = Date.now();
  const tokenAge = now - parseInt(timestamp);
  
  return tokenAge < TOKEN_EXPIRY && token.length > 10;
};

// ===========================================
// SECURE TOKEN MANAGER
// ===========================================

export const SecureTokenManager = {
  // Login tokens (platform access) - SECURE VERSION
  setLoginTokens: (token, username) => {
    if (!token || !username) {
      console.error('Invalid token or username provided');
      return false;
    }
    
    const encryptedToken = encryptToken(token);
    if (!encryptedToken) return false;
    
    try {
      // Store login tokens in sessionStorage to keep them scoped to the browser session
      // (cleared automatically when the tab/window is closed).
      sessionStorage.setItem('github_login_token', encryptedToken);
      sessionStorage.setItem('github_login_username', username);
      sessionStorage.setItem('github_login_time', Date.now().toString());
      return true;
    } catch (error) {
      console.error('Failed to store login tokens:', error);
      return false;
    }
  },

  getLoginTokens: () => {
    try {
      const encryptedToken = sessionStorage.getItem('github_login_token');
      const username = sessionStorage.getItem('github_login_username');
      const timestamp = sessionStorage.getItem('github_login_time');
      
      if (!encryptedToken || !username || !timestamp) {
        return { token: null, username: null };
      }
      
      const token = decryptToken(encryptedToken);
      if (!token || !isValidToken(token, timestamp)) {
        SecureTokenManager.clearLogin();
        return { token: null, username: null };
      }
      
      return { token, username };
    } catch (error) {
      console.error('Failed to retrieve login tokens:', error);
      SecureTokenManager.clearLogin();
      return { token: null, username: null };
    }
  },

  hasLogin: () => {
    const { token } = this.getLoginTokens();
    return !!token;
  },

  // Repository tokens (repo access) - SECURE VERSION
  setRepoTokens: (token, username) => {
    if (!token || !username) {
      console.error('Invalid token or username provided');
      return false;
    }
    
    const encryptedToken = encryptToken(token);
    if (!encryptedToken) return false;
    
    try {
      localStorage.setItem('github_repo_token', encryptedToken);
      localStorage.setItem('github_repo_username', username);
      localStorage.setItem('github_repo_time', Date.now().toString());
      return true;
    } catch (error) {
      console.error('Failed to store repo tokens:', error);
      return false;
    }
  },

  getRepoTokens: () => {
    try {
      const encryptedToken = localStorage.getItem('github_repo_token');
      const username = localStorage.getItem('github_repo_username');
      const timestamp = localStorage.getItem('github_repo_time');
      
      if (!encryptedToken || !username || !timestamp) {
        return { token: null, username: null };
      }
      
      const token = decryptToken(encryptedToken);
      if (!token || !isValidToken(token, timestamp)) {
        SecureTokenManager.clearRepo();
        return { token: null, username: null };
      }
      
      return { token, username };
    } catch (error) {
      console.error('Failed to retrieve repo tokens:', error);
      SecureTokenManager.clearRepo();
      return { token: null, username: null };
    }
  },

  hasRepoAccess: () => {
    const { token } = SecureTokenManager.getRepoTokens();
    return !!token;
  },

  // Clear specific tokens
  clearLogin: () => {
    try {
      sessionStorage.removeItem('github_login_token');
      sessionStorage.removeItem('github_login_username');
      sessionStorage.removeItem('github_login_time');
    } catch (error) {
      console.error('Failed to clear login tokens:', error);
    }
  },

  clearRepo: () => {
    try {
      localStorage.removeItem('github_repo_token');
      localStorage.removeItem('github_repo_username');
      localStorage.removeItem('github_repo_time');
    } catch (error) {
      console.error('Failed to clear repo tokens:', error);
    }
  },

  // Clear all (full logout)
  clearAll: () => {
    SecureTokenManager.clearLogin();
    SecureTokenManager.clearRepo();
  },

  // Security check for token validity
  validateAllTokens: () => {
    const loginTokens = SecureTokenManager.getLoginTokens();
    const repoTokens = SecureTokenManager.getRepoTokens();
    
    return {
      loginValid: !!loginTokens.token,
      repoValid: !!repoTokens.token,
      needsRefresh: !loginTokens.token || !repoTokens.token
    };
  }
};

// ===========================================
// INPUT SANITIZATION
// ===========================================

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

// ===========================================
// SECURE API CALLS
// ===========================================

export const secureApiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'include', // Include cookies for session management
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle different response types securely
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// ===========================================
// XSS PROTECTION
// ===========================================

export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ===========================================
// CSRF PROTECTION
// ===========================================

export const getCSRFToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
};

export const addCSRFHeader = (options = {}) => {
  const token = getCSRFToken();
  if (token) {
    return {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': token
      }
    };
  }
  return options;
};

// ===========================================
// SECURITY VALIDATION
// ===========================================

export const validateUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateGitHubUrl = (url) => {
  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/)?$/;
  return githubRegex.test(url);
};
