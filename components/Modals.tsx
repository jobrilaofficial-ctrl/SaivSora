import React, { useEffect } from 'react';
import { X, Loader2, ShieldCheck, Check, Lock, Zap } from 'lucide-react';
import { UserPlan } from '../services/auth';

// --- Base Modal Wrapper ---
const ModalWrapper: React.FC<{ children: React.ReactNode; onClose?: () => void }> = ({ children, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
      {children}
    </div>
  </div>
);

// --- 1. Security Check Modal ---
export const SecurityCheckModal: React.FC = () => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
    <div className="relative flex flex-col items-center justify-center text-center z-10">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
        <ShieldCheck className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Security Check</h3>
      <p className="text-slate-400 font-medium">Verifying video source...</p>
    </div>
  </div>
);

// --- 2. Login Modal ---
export const LoginModal: React.FC<{ onClose: () => void; onLogin: () => void }> = ({ onClose, onLogin }) => (
  <ModalWrapper onClose={onClose}>
    <div className="p-6 text-center">
      <div className="mx-auto w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Login to SaveSora</h3>
      <p className="text-slate-400 mb-8 text-sm">All data is safeguarded. Create an account to access more downloads.</p>
      
      <button 
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3.5 rounded-xl transition-colors mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign in with Google
      </button>

      <div className="space-y-2 text-left bg-slate-950/50 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-300">
           <Check className="w-4 h-4 text-green-500" /> <span>Free downloads every day</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
           <Check className="w-4 h-4 text-green-500" /> <span>Works on any device</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
           <Check className="w-4 h-4 text-green-500" /> <span>Upgrade anytime</span>
        </div>
      </div>
    </div>
    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
      <X className="w-5 h-5" />
    </button>
  </ModalWrapper>
);

// --- 3. Limit Reached Modal ---
export const LimitReachedModal: React.FC<{ 
  isLoggedIn: boolean; 
  onClose: () => void; 
  onAction: () => void 
}> = ({ isLoggedIn, onClose, onAction }) => (
  <ModalWrapper onClose={onClose}>
    <div className="p-6 text-center">
      <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Download Limit Reached</h3>
      <p className="text-slate-400 mb-8">
        {isLoggedIn 
          ? "You’ve used all your free downloads today. Upgrade to continue downloading high-quality Sora videos." 
          : "Anonymous users can download once per day. Log in for more or return tomorrow."}
      </p>
      
      <button 
        onClick={onAction}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
      >
        {isLoggedIn ? "Upgrade to Premium" : "Login for More"}
      </button>
      
      <button onClick={onClose} className="text-slate-500 hover:text-white text-sm font-medium">
        Maybe later
      </button>
    </div>
  </ModalWrapper>
);

// --- 4. Plans Modal ---
const PricingCard: React.FC<{
  price: string;
  downloads: string;
  avg: string;
  highlight?: boolean;
  onSelect: () => void;
}> = ({ price, downloads, avg, highlight, onSelect }) => (
  <div className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
    highlight 
      ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20' 
      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
  }`} onClick={onSelect}>
    {highlight && (
      <span className="absolute -top-2.5 left-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
        Best Value
      </span>
    )}
    <div>
      <h4 className="text-xl font-bold text-white">{price} <span className="text-sm font-normal text-slate-400">/mo</span></h4>
      <p className="text-sm text-slate-400 mt-1">{downloads} Downloads</p>
    </div>
    <div className="text-right">
       <p className="text-sm font-medium text-white">{avg} <span className="text-slate-500">/vid</span></p>
       <button className="mt-1 text-xs font-bold text-blue-400 uppercase tracking-wide">Select</button>
    </div>
  </div>
);

export const PlansModal: React.FC<{ onClose: () => void; onUpgrade: (plan: UserPlan) => void }> = ({ onClose, onUpgrade }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Upgrade Plan</h3>
          <p className="text-slate-400 text-sm">Unlock high-volume downloads and priority speed.</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button className="flex-1 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-500 bg-slate-800/50">Monthly</button>
        <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-300">Yearly (Save 20%)</button>
        <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-300">Enterprise</button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 overflow-y-auto">
        <PricingCard 
          price="$14.99" 
          downloads="200" 
          avg="$0.0750" 
          onSelect={() => onUpgrade('basic')} 
        />
        <PricingCard 
          price="$29.99" 
          downloads="450" 
          avg="$0.0666" 
          highlight 
          onSelect={() => onUpgrade('pro')} 
        />
        <PricingCard 
          price="$89.99" 
          downloads="1,500" 
          avg="$0.0600" 
          onSelect={() => onUpgrade('vip')} 
        />

        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
           <div className="flex items-center gap-2 text-sm text-slate-400">
             <Zap className="w-4 h-4 text-yellow-500" /> Instant Delivery
           </div>
           <div className="flex items-center gap-2 text-sm text-slate-400">
             <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Payment
           </div>
        </div>
      </div>
    </div>
  </div>
);
