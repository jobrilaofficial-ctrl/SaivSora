export interface SiteSettings {
  branding: {
    siteTitle: string;
    tagline: string;
    accentColor: string;
  };
  homepage: {
    mainTitle: string;
    subtitle: string;
    description: string;
  };
  navigation: {
    showTikTok: boolean;
    showFakeSora: boolean;
    showLogin: boolean;
    showPricing: boolean;
  };
  announcement: {
    enabled: boolean;
    text: string;
    bgColor: string; // e.g. 'bg-blue-600'
  };
}

const SETTINGS_KEY = 'savesora_admin_settings';

const DEFAULT_SETTINGS: SiteSettings = {
  branding: {
    siteTitle: 'SaveSora',
    tagline: 'Fast Online Video Downloader',
    accentColor: 'blue',
  },
  homepage: {
    mainTitle: 'SaveSora: Fast Online Video Downloader',
    subtitle: 'Easily download high-quality videos from a link—no watermark, no hassle.',
    description: 'The fastest and most secure way to download Sora videos online. No installation required, completely free, and high quality guaranteed.',
  },
  navigation: {
    showTikTok: false,
    showFakeSora: false,
    showLogin: true,
    showPricing: true,
  },
  announcement: {
    enabled: false,
    text: '🎉 New Feature: 4K Downloads are now available for Pro users!',
    bgColor: 'bg-blue-600',
  },
};

export const AdminSettings = {
  get: (): SiteSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    try {
      // Merge with defaults to handle new fields in future updates
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  save: (settings: SiteSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Dispatch event so components can react immediately without page reload
    window.dispatchEvent(new Event('savesora-settings-changed'));
  },
  
  // Helper to subscribe to changes in React components
  subscribe: (callback: () => void) => {
    window.addEventListener('savesora-settings-changed', callback);
    return () => window.removeEventListener('savesora-settings-changed', callback);
  }
};