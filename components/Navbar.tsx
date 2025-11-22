import React, { useState, useEffect } from 'react';
import { Menu, X, DownloadCloud, ChevronDown, Zap } from 'lucide-react';
import { User } from '../services/auth';
import { AdminSettings, SiteSettings } from '../services/adminSettings';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onPlansClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogoutClick, onPlansClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(AdminSettings.get());

  useEffect(() => {
    return AdminSettings.subscribe(() => {
      setSettings(AdminSettings.get());
    });
  }, []);

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <DownloadCloud className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">{settings.branding.siteTitle}</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">How it works</a>
            
            {settings.navigation.showPricing && (
              <button onClick={onPlansClick} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Pricing</button>
            )}
            
            {!user ? (
              settings.navigation.showLogin && (
                <button 
                  onClick={onLoginClick}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 py-1.5 px-2 rounded-full transition-all"
                >
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full bg-slate-700" />
                  <span className="text-sm font-medium text-white max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-800">
                       <p className="text-xs text-slate-500 uppercase font-bold">Plan</p>
                       <p className="text-sm font-medium text-blue-400 flex items-center gap-1">
                         <Zap className="w-3 h-3" /> {user.plan.toUpperCase()}
                       </p>
                    </div>
                    {settings.navigation.showPricing && (
                      <button 
                        onClick={() => { onPlansClick(); setIsProfileOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white"
                      >
                        Upgrade Plan
                      </button>
                    )}
                    <button 
                      onClick={() => { onLogoutClick(); setIsProfileOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-800">How it works</a>
            {settings.navigation.showPricing && (
               <button onClick={onPlansClick} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Pricing</button>
            )}
            {user ? (
              <>
                 <div className="px-3 py-2 flex items-center gap-3 border-t border-slate-800 mt-2 pt-4">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className="text-blue-400 text-xs font-bold uppercase">{user.plan}</p>
                    </div>
                 </div>
                 <button onClick={onLogoutClick} className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300">Logout</button>
              </>
            ) : (
              settings.navigation.showLogin && (
                <button onClick={onLoginClick} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300">Login</button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;