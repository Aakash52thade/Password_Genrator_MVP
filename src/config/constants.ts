export const APP_CONFIG = {
    name: 'SecureVault',
    description: 'Password Generator & Secure Vault',
    version: '1.0.0',
  } as const;
  
  export const PASSWORD_CONFIG = {
    minLength: 8,
    maxLength: 64,
    defaultLength: 16,
    autoClipboardClearTime: 15000, // 15 seconds
  } as const;
  
  export const CRYPTO_CONFIG = {
    algorithm: 'AES',
    keySize: 256,
    iterations: 100000,
    saltLength: 16,
  } as const;
  
  export const AUTH_CONFIG = {
    jwtExpiresIn: '7d',
    cookieName: 'auth_token',
    cookieMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  } as const;
  
  export const API_ROUTES = {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      logout: '/api/auth/logout',
    },
    vault: {
      base: '/api/vault',
      byId: (id: string) => `/api/vault/${id}`,
      search: '/api/vault/search',
    },
  } as const;
  
  export const APP_ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    vault: '/vault',
    generator: '/generator',
  } as const;