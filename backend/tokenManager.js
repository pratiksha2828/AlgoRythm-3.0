// src/utils/tokenManager.js
export const TokenManager = {
  // Login tokens (platform access)
  setLoginTokens: (token, username) => {
    localStorage.setItem('github_login_token', token);
    localStorage.setItem('github_login_username', username);
    localStorage.setItem('github_login_time', Date.now().toString());
  },

  getLoginTokens: () => {
    return {
      token: localStorage.getItem('github_login_token'),
      username: localStorage.getItem('github_login_username')
    };
  },

  hasLogin: () => {
    return !!localStorage.getItem('github_login_token');
  },

  // Repository tokens (repo access)
  setRepoTokens: (token, username) => {
    localStorage.setItem('github_repo_token', token);
    localStorage.setItem('github_repo_username', username);
    localStorage.setItem('github_repo_time', Date.now().toString());
  },

  getRepoTokens: () => {
    return {
      token: localStorage.getItem('github_repo_token'),
      username: localStorage.getItem('github_repo_username')
    };
  },

  hasRepoAccess: () => {
    return !!localStorage.getItem('github_repo_token');
  },

  // Clear specific tokens
  clearLogin: () => {
    localStorage.removeItem('github_login_token');
    localStorage.removeItem('github_login_username');
    localStorage.removeItem('github_login_time');
  },

  clearRepo: () => {
    localStorage.removeItem('github_repo_token');
    localStorage.removeItem('github_repo_username');
    localStorage.removeItem('github_repo_time');
  },

  // Clear all (full logout)
  clearAll: () => {
    TokenManager.clearLogin();
    TokenManager.clearRepo();
  }
};