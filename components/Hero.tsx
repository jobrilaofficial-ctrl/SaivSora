import React, { useState, useEffect } from 'react';
import { ArrowRight, Link as LinkIcon, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { fetchVideoMetadata } from '../services/api';
import { VideoMetadata, FetchState, ApiError } from '../types';
import DownloadResult from './DownloadResult';
import { User } from '../services/auth';
import { AdminSettings, SiteSettings } from '../services/adminSettings';

interface HeroProps {
  user: User | null;
  onShowSecurity: (show: boolean) => Promise<void>;
  onLimitReached: () => void;
  onIncrementUsage: () => void;
}

const Hero: React.FC<HeroProps> = ({ user, onShowSecurity, onLimitReached, onIncrementUsage }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<FetchState>(FetchState.IDLE);
  const [error, setError] = useState<ApiError | null>(null);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(AdminSettings.get());
  
  // Turnstile State
  const [cfToken, setCfToken] = useState<string | null>(null);

  useEffect(() => {
    return AdminSettings.subscribe(() => {
      setSettings(AdminSettings.get());
    });
  }, []);

  // Initialize global Turnstile callback
  useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      console.log("Turnstile solved:", token);
      setCfToken(token);
      setError(null);
    };

    // Cleanup
    return () => {
      (window as any).onTurnstileSuccess = undefined;
    };
  }, []);

  // Re-render Turnstile if needed (optional, for SPA navigation usually handled by script)
  useEffect(() => {
    if ((window as any).turnstile && (window as any).turnstile.render) {
        // If the widget div exists but is empty, we could manually render, 
        // but the data-callback usually handles auto-render on script load.
    }
  }, []);

  useEffect(() => {
    if (!url) {
      setIsUrlValid(false);
      return;
    }
    
    const soraRegex = /https?:\/\/(?:www\.)?(?:sora\.chatgpt\.com|sora\.com)\/.+/i;
    const directFileRegex = /^https?:\/\/.*\.(mp4|webm|mov|mkv)(\?.*)?$/i;
    
    // Allow Sora links OR direct file links
    const isValid = soraRegex.test(url) || directFileRegex.test(url);
    setIsUrlValid(isValid);
  }, [url]);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !isUrlValid) return;
    if (!cfToken) {
        setError({ message: "Please complete the security check first." });
        return;
    }

    setStatus(FetchState.LOADING);
    setError(null);
    setVideoData(null);

    try {
      const data = await fetchVideoMetadata(url, cfToken);
      setVideoData(data);
      setStatus(FetchState.SUCCESS);
    } catch (err: any) {
      setError({ message: err.message || 'Failed to fetch video details.' });
      setStatus(FetchState.ERROR);
      // Reset token on error if backend consumes it (optional)
      // setCfToken(null); 
      // if (window.turnstile) window.turnstile.reset();
    }
  };

  const handleReset = () => {
    setUrl('');
    setStatus(FetchState.IDLE);
    setVideoData(null);
    setError(null);
    setIsTouched(false);
    setCfToken(null);
    if ((window as any).turnstile) {
        try {
            (window as any).turnstile.reset();
        } catch(e) { /* ignore */ }
    }
  };

  return (
    <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 px-4 overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-xs font-semibold mb-8 backdrop-blur-md shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Updated for Sora v1.0
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          {settings.homepage.mainTitle}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {settings.homepage.subtitle}
        </p>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleFetch} className="relative group z-20 flex flex-col gap-6">
            
            {/* Input Container */}
            <div className="relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-20 blur transition duration-500 ${isUrlValid ? 'opacity-50' : 'group-hover:opacity-30'}`}></div>
                
                <div className={`relative flex items-center bg-slate-900 rounded-full p-2 shadow-2xl border transition-colors duration-300 ${
                isTouched && !isUrlValid ? 'border-red-500/50' : isUrlValid ? 'border-blue-500/50' : 'border-slate-800'
                }`}>
                <div className="pl-5 pr-3 text-slate-500">
                    <LinkIcon className={`w-5 h-5 transition-colors ${isUrlValid ? 'text-blue-400' : ''}`} />
                </div>
                
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                    setUrl(e.target.value);
                    setIsTouched(true);
                    }}
                    onBlur={() => setIsTouched(true)}
                    placeholder="Paste your Sora video link (e.g., https://sora.chatgpt.com/...)"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 h-12 text-base md:text-lg w-full min-w-0"
                    disabled={status === FetchState.LOADING}
                />

                {/* Desktop Button */}
                <button
                    type="submit"
                    disabled={status === FetchState.LOADING || !isUrlValid || !cfToken}
                    className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 h-12 rounded-full font-semibold transition-all active:scale-95 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 disabled:shadow-none whitespace-nowrap"
                >
                    {status === FetchState.LOADING ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing
                    </>
                    ) : (
                    <>
                        Start <ArrowRight className="w-4 h-4" />
                    </>
                    )}
                </button>
                
                {/* Mobile Button */}
                <button
                    type="submit"
                    disabled={status === FetchState.LOADING || !isUrlValid || !cfToken}
                    className="md:hidden flex-shrink-0 bg-blue-600 disabled:bg-slate-800 text-white p-3.5 rounded-full ml-2 transition-colors"
                >
                    {status === FetchState.LOADING ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                    <ArrowRight className="w-5 h-5" />
                    )}
                </button>
                </div>
                
                {/* Validation Hint */}
                {isTouched && !isUrlValid && url.length > 0 && (
                <div className="absolute -bottom-8 left-6 text-xs text-red-400 font-medium animate-fade-in">
                    Please enter a valid Sora link or direct MP4 URL
                </div>
                )}
            </div>

            {/* Turnstile Widget Container */}
            <div className="flex flex-col items-center justify-center gap-2 min-h-[65px]">
                <div 
                    className="cf-turnstile" 
                    data-sitekey="PUT_YOUR_TURNSTILE_SITE_KEY_HERE" 
                    data-callback="onTurnstileSuccess"
                    data-theme="dark"
                ></div>
                
                {!cfToken && isUrlValid && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 animate-fade-in">
                        <ShieldCheck className="w-3 h-3" />
                        Please complete the security check first
                    </p>
                )}
            </div>

          </form>

          {/* Error Message */}
          {status === FetchState.ERROR && error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-left animate-fade-in shadow-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Result Section */}
      {status === FetchState.SUCCESS && videoData && (
        <div className="relative z-10">
           <DownloadResult 
              data={videoData} 
              onReset={handleReset}
              user={user}
              onShowSecurity={onShowSecurity}
              onLimitReached={onLimitReached}
              onIncrementUsage={onIncrementUsage}
           />
        </div>
      )}
    </section>
  );
};

export default Hero;