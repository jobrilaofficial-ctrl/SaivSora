import React, { useState } from 'react';
import { VideoMetadata } from '../types';
import { Download, CheckCircle, Shield, Monitor, Smartphone, Loader2, Check, Share2, Link as LinkIcon } from 'lucide-react';
import { User, AuthService } from '../services/auth';

interface DownloadResultProps {
  data: VideoMetadata;
  user: User | null;
  onReset: () => void;
  onShowSecurity: (show: boolean) => Promise<void>;
  onLimitReached: () => void;
  onIncrementUsage: () => void;
}

const DownloadResult: React.FC<DownloadResultProps> = ({ 
  data, 
  user, 
  onReset, 
  onShowSecurity, 
  onLimitReached,
  onIncrementUsage
}) => {
  const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: number }>({});
  const [downloadSpeeds, setDownloadSpeeds] = useState<{ [key: number]: string }>({});
  const [isCopied, setIsCopied] = useState(false);

  const handleDownloadClick = async (index: number, url: string, filename: string) => {
    // 1. Check Limits First
    if (!AuthService.canDownload(user)) {
      onLimitReached();
      return;
    }

    // 2. Show Security Check (Wait for it to finish)
    await onShowSecurity(true);

    // 3. Start Download Simulation
    startDownload(index, url, filename);
    
    // 4. Count Usage
    onIncrementUsage();
  };

  const startDownload = (index: number, url: string, filename: string) => {
    // Prevent multiple clicks on same button while downloading
    if (downloadProgress[index] > 0 && downloadProgress[index] < 100) return;

    setDownloadProgress((prev) => ({ ...prev, [index]: 1 }));
    setDownloadSpeeds((prev) => ({ ...prev, [index]: 'Connecting...' }));

    let progress = 0;
    const interval = setInterval(() => {
      // Randomize progress increment for realistic feel
      progress += Math.random() * 15 + 5; 
      
      // Simulate Speed: 2.5 - 8.5 MB/s
      const randomSpeed = (Math.random() * 6 + 2.5).toFixed(1);
      setDownloadSpeeds((prev) => ({ ...prev, [index]: `${randomSpeed} MB/s` }));
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Trigger actual download
        triggerBrowserDownload(url, filename);
      }

      setDownloadProgress((prev) => ({ ...prev, [index]: progress }));
    }, 200);
  };

  const triggerBrowserDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareUrl = data.resolutions[0]?.url || '';
    if (!shareUrl) return;

    const shareData = {
      title: data.title,
      text: `Check out this Sora video: ${data.title}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const previewUrl = data.resolutions[0]?.url;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-fade-in-up px-4">
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Video Player Section */}
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="group relative aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-lg ring-1 ring-white/10">
                {previewUrl ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain bg-black"
                    poster={data.thumbnailUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                     <span className="text-slate-500 text-xs">Preview Unavailable</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2 leading-tight break-all">
                  {data.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Video Found
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    Secure
                  </span>
                  
                  {/* Share Button */}
                  <button 
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer ml-auto md:ml-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Resolution List */}
              <div className="space-y-3 mt-auto">
                {data.resolutions.map((res, index) => {
                  const is4K = res.label.includes('4K');
                  const progress = downloadProgress[index] || 0;
                  const isDownloading = progress > 0 && progress < 100;
                  const isCompleted = progress === 100;
                  const currentSpeed = downloadSpeeds[index];
                  
                  return (
                    <div
                      key={index}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 gap-4 sm:gap-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg transition-colors ${is4K ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {is4K ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm tracking-wide">{res.label}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <span className="uppercase">{res.format}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <span>{res.size}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadClick(index, res.url, `SaveSora_${data.id}.mp4`)}
                        disabled={isDownloading}
                        className={`relative flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-lg overflow-hidden min-w-[160px]
                          ${isDownloading 
                            ? 'bg-slate-800 text-white border border-slate-700 cursor-wait' 
                            : isCompleted 
                              ? 'bg-green-600 hover:bg-green-500 text-white border border-green-500 shadow-green-900/20' 
                              : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 shadow-blue-900/20 hover:shadow-blue-500/30 active:scale-95'
                          }
                        `}
                      >
                        {/* Progress Bar Background */}
                        {isDownloading && (
                          <div 
                            className="absolute inset-y-0 left-0 bg-blue-500/30 transition-all duration-200 ease-out z-0"
                            style={{ width: `${progress}%` }}
                          />
                        )}
                        
                        {/* Content Layer */}
                        <span className="relative z-10 flex items-center gap-2">
                          {isDownloading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <div className="flex flex-col items-start leading-none gap-0.5">
                                <span className="tabular-nums text-sm">{Math.floor(progress)}%</span>
                                <span className="text-[10px] opacity-75 font-normal tabular-nums">{currentSpeed}</span>
                              </div>
                            </>
                          ) : isCompleted ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Downloaded</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-center">
          <button 
            onClick={onReset}
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors hover:underline decoration-slate-700 underline-offset-4"
          >
            Convert another video
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadResult;