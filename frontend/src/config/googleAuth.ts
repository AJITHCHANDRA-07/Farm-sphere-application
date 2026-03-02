// Google OAuth Configuration
// This file contains the configuration for Google OAuth 2.0 integration

export const GOOGLE_CONFIG = {
  // Google OAuth 2.0 endpoints
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  
  // OAuth 2.0 client configuration
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
  redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'http://localhost:8080/auth/google/callback',
  
  // OAuth scopes
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
  ].join(' '),
  
  // Response type
  responseType: 'code',
  
  // Access type
  accessType: 'offline',
  
  // Prompt for consent
  prompt: 'consent'
};

// Google OAuth helper functions
export const googleAuthHelpers = {
  // Generate Google OAuth URL
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.clientId,
      redirect_uri: GOOGLE_CONFIG.redirectUri,
      scope: GOOGLE_CONFIG.scope,
      response_type: GOOGLE_CONFIG.responseType,
      access_type: GOOGLE_CONFIG.accessType,
      prompt: GOOGLE_CONFIG.prompt
    });
    
    return `${GOOGLE_CONFIG.authUrl}?${params.toString()}`;
  },
  
  // Exchange authorization code for tokens
  exchangeCodeForTokens: async (code: string) => {
    try {
      const response = await fetch(GOOGLE_CONFIG.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CONFIG.clientId,
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || 'your-client-secret',
          code,
          grant_type: 'authorization_code',
          redirect_uri: GOOGLE_CONFIG.redirectUri,
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  },
  
  // Get user information from Google
  getUserInfo: async (accessToken: string) => {
    try {
      const response = await fetch(GOOGLE_CONFIG.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  },
  
  // Handle Google OAuth callback
  handleCallback: async (code: string) => {
    try {
      // Exchange code for tokens
      const tokenResponse = await googleAuthHelpers.exchangeCodeForTokens(code);
      
      // Get user information
      const userInfo = await googleAuthHelpers.getUserInfo(tokenResponse.access_token);
      
      // Return user data
      return {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
      };
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw error;
    }
  }
};

// Mock Google OAuth for development
export const mockGoogleAuth = {
  // Simulate Google OAuth flow
  simulateAuth: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user data
    return {
      id: 'google-user-' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  }
};

// Export default configuration
export default {
  GOOGLE_CONFIG,
  googleAuthHelpers,
  mockGoogleAuth
};
