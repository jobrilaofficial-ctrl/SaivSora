export type UserPlan = 'anon' | 'free' | 'basic' | 'pro' | 'vip';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: UserPlan;
}

const STORAGE_KEY_USER = 'savesora_user';
const STORAGE_KEY_ANON_USAGE = 'anon_downloads_today';
const STORAGE_KEY_USER_USAGE = 'user_downloads_today';

interface UsageData {
  date: string;
  count: number;
}

export const PLAN_LIMITS: Record<UserPlan, number> = {
  anon: 1,
  free: 3,
  basic: 200,
  pro: 450,
  vip: 1500
};

export const AuthService = {
  // --- User Management ---
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    return stored ? JSON.parse(stored) : null;
  },

  login: (): User => {
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: 'Sora Creator',
      email: 'creator@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sora',
      plan: 'free' // Default to free on login
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
    return mockUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  upgradePlan: (plan: UserPlan): User | null => {
    const user = AuthService.getUser();
    if (!user) return null;
    
    const updatedUser = { ...user, plan };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    return updatedUser;
  },

  // --- Usage & Limits ---
  getRemainingDownloads: (user: User | null): number => {
    const plan = user ? user.plan : 'anon';
    const limit = PLAN_LIMITS[plan];
    
    // Select the correct storage key based on auth state
    const usageKey = user ? STORAGE_KEY_USER_USAGE : STORAGE_KEY_ANON_USAGE;
    const usage = AuthService.getUsageCount(usageKey);
    
    return Math.max(0, limit - usage);
  },

  canDownload: (user: User | null): boolean => {
    return AuthService.getRemainingDownloads(user) > 0;
  },

  incrementUsage: () => {
    const user = AuthService.getUser();
    const usageKey = user ? STORAGE_KEY_USER_USAGE : STORAGE_KEY_ANON_USAGE;
    
    const usageData = AuthService.getUsageData(usageKey);
    usageData.count += 1;
    usageData.date = new Date().toDateString(); // Ensure date is fresh
    
    localStorage.setItem(usageKey, JSON.stringify(usageData));
  },

  // --- Internal Helpers ---
  getUsageData: (key: string): UsageData => {
    if (typeof window === 'undefined') return { date: new Date().toDateString(), count: 0 };
    
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Reset if date doesn't match today
      if (parsed.date !== new Date().toDateString()) {
        return { date: new Date().toDateString(), count: 0 };
      }
      return parsed;
    }
    // Initialize if empty
    return { date: new Date().toDateString(), count: 0 };
  },

  getUsageCount: (key: string): number => {
    return AuthService.getUsageData(key).count;
  }
};