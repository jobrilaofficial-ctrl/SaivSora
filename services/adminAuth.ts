export interface AdminUser {
  email: string;
  role: 'admin';
  token: string;
  expiresAt: number;
}

const ADMIN_STORAGE_KEY = 'savesora_admin_session';

export const AdminAuth = {
  isAuthenticated: (): boolean => {
    const sessionStr = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!sessionStr) return false;

    try {
      const session = JSON.parse(sessionStr);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  getAdminUser: (): AdminUser | null => {
    const sessionStr = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      return null;
    }
  },

  login: (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        if (email === 'admin@savesora.com' && password === 'admin123') {
          const session: AdminUser = {
            email,
            role: 'admin',
            token: 'mock_admin_token_' + Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          };
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    // Force reload to clear states or simple redirect handled by component
    window.location.hash = '#/admin/login';
  }
};