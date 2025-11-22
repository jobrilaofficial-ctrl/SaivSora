import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { AuthService, User, UserPlan } from '../services/auth';
import { LoginModal, PlansModal, SecurityCheckModal, LimitReachedModal } from '../components/Modals';
import { AdminSettings, SiteSettings } from '../services/adminSettings';

const Home: React.FC = () => {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(AdminSettings.get());
  const [modalState, setModalState] = useState({
    login: false,
    plans: false,
    security: false,
    limit: false
  });

  // Init User & Settings on Load
  useEffect(() => {
    const storedUser = AuthService.getUser();
    if (storedUser) setUser(storedUser);

    return AdminSettings.subscribe(() => {
      setSettings(AdminSettings.get());
    });
  }, []);

  // --- Auth Handlers ---
  const handleLogin = () => {
    const newUser = AuthService.login();
    setUser(newUser);
    setModalState(prev => ({ ...prev, login: false }));
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  const handleUpgrade = (plan: UserPlan) => {
    if (!user) {
      // If not logged in, go to login first
      setModalState(prev => ({ ...prev, plans: false, login: true }));
      return;
    }
    const updatedUser = AuthService.upgradePlan(plan);
    setUser(updatedUser);
    setModalState(prev => ({ ...prev, plans: false }));
  };

  // --- Modal Handlers ---
  const toggleModal = (modal: keyof typeof modalState, isOpen: boolean) => {
    setModalState(prev => ({ ...prev, [modal]: isOpen }));
  };

  const handleSecurityCheck = async (show: boolean) => {
    if (show) {
      toggleModal('security', true);
      // Simulate 1.5s verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      toggleModal('security', false);
    } else {
      toggleModal('security', false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-blue-500/30 selection:text-blue-200">
      {/* Announcement Bar */}
      {settings.announcement.enabled && (
        <div className={`${settings.announcement.bgColor} text-white text-xs sm:text-sm font-medium py-2 px-4 text-center animate-fade-in`}>
          {settings.announcement.text}
        </div>
      )}

      <Navbar 
        user={user}
        onLoginClick={() => toggleModal('login', true)}
        onLogoutClick={handleLogout}
        onPlansClick={() => toggleModal('plans', true)}
      />
      
      <main className="flex-grow">
        <Hero 
          user={user}
          onShowSecurity={handleSecurityCheck}
          onLimitReached={() => toggleModal('limit', true)}
          onIncrementUsage={AuthService.incrementUsage}
        />
        <Features />
      </main>
      
      <Footer />
      <Chatbot />

      {/* --- Modals --- */}
      {modalState.login && (
        <LoginModal 
          onClose={() => toggleModal('login', false)} 
          onLogin={handleLogin} 
        />
      )}
      
      {modalState.plans && (
        <PlansModal 
          onClose={() => toggleModal('plans', false)} 
          onUpgrade={handleUpgrade} 
        />
      )}
      
      {modalState.limit && (
        <LimitReachedModal 
          isLoggedIn={!!user}
          onClose={() => toggleModal('limit', false)}
          onAction={() => {
            toggleModal('limit', false);
            toggleModal(user ? 'plans' : 'login', true);
          }}
        />
      )}
      
      {modalState.security && <SecurityCheckModal />}
    </div>
  );
};

export default Home;