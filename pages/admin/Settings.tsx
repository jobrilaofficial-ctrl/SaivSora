import React, { useState, useEffect } from 'react';
import { AdminSettings, SiteSettings } from '../../services/adminSettings';
import { Save, RefreshCw, Layout, Type, ToggleLeft, Megaphone } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(AdminSettings.get());
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'homepage' | 'nav' | 'announcement'>('branding');

  const handleSave = () => {
    setIsSaving(true);
    AdminSettings.save(settings);
    setTimeout(() => setIsSaving(false), 600);
  };

  const updateField = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-70"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'branding' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          <Layout className="w-4 h-4" /> Branding
        </button>
        <button 
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'homepage' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          <Type className="w-4 h-4" /> Homepage Content
        </button>
        <button 
          onClick={() => setActiveTab('nav')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'nav' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          <ToggleLeft className="w-4 h-4" /> Navigation & Features
        </button>
        <button 
          onClick={() => setActiveTab('announcement')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'announcement' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          <Megaphone className="w-4 h-4" /> Announcement Bar
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        
        {/* 1. Branding Section */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Site Identity</h3>
              <div className="grid gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Site Title</label>
                  <input 
                    type="text" 
                    value={settings.branding.siteTitle}
                    onChange={(e) => updateField('branding', 'siteTitle', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Tagline (Browser Tab)</label>
                  <input 
                    type="text" 
                    value={settings.branding.tagline}
                    onChange={(e) => updateField('branding', 'tagline', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-800">
               <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Accent Color</label>
                  <div className="flex gap-3">
                    {['blue', 'indigo', 'violet', 'cyan', 'emerald', 'rose'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateField('branding', 'accentColor', color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          settings.branding.accentColor === color ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: `var(--color-${color}-500, ${color})` }} // Simple mock, in real app map to hex
                      >
                         <div className={`w-full h-full rounded-full bg-${color}-500`}></div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Currently strictly uses Blue theme in code, but this setting is saved for future CSS variable implementation.</p>
               </div>
            </div>
          </div>
        )}

        {/* 2. Homepage Content */}
        {activeTab === 'homepage' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Main Hero Title</label>
              <input 
                type="text" 
                value={settings.homepage.mainTitle}
                onChange={(e) => updateField('homepage', 'mainTitle', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Hero Subtitle</label>
              <textarea 
                rows={2}
                value={settings.homepage.subtitle}
                onChange={(e) => updateField('homepage', 'subtitle', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Footer Description</label>
              <textarea 
                rows={3}
                value={settings.homepage.description}
                onChange={(e) => updateField('homepage', 'description', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* 3. Navigation & Features */}
        {activeTab === 'nav' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">Feature Toggles</h3>
            
            <div className="space-y-4">
              {[
                { key: 'showLogin', label: 'User Login System', desc: 'Allow users to sign in and manage accounts.' },
                { key: 'showPricing', label: 'Pricing Plans', desc: 'Show the pricing link in navigation.' },
                { key: 'showTikTok', label: 'TikTok Downloader Page', desc: 'Enable the /tiktok route (Coming Soon).' },
                { key: 'showFakeSora', label: 'FakeSora Page', desc: 'Enable the /fakesora route (Coming Soon).' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div>
                    <h4 className="text-sm font-medium text-white">{item.label}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.navigation[item.key as keyof typeof settings.navigation]}
                      onChange={(e) => updateField('navigation', item.key, e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Announcement Bar */}
        {activeTab === 'announcement' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-white">Top Banner</h3>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.announcement.enabled}
                    onChange={(e) => updateField('announcement', 'enabled', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300">
                    {settings.announcement.enabled ? 'Active' : 'Disabled'}
                  </span>
                </label>
            </div>

            <div className={`space-y-5 transition-opacity ${settings.announcement.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Banner Text</label>
                  <input 
                    type="text" 
                    value={settings.announcement.text}
                    onChange={(e) => updateField('announcement', 'text', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Background Color</label>
                  <select
                     value={settings.announcement.bgColor}
                     onChange={(e) => updateField('announcement', 'bgColor', e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                  >
                    <option value="bg-blue-600">Blue</option>
                    <option value="bg-indigo-600">Indigo</option>
                    <option value="bg-purple-600">Purple</option>
                    <option value="bg-green-600">Green</option>
                    <option value="bg-red-600">Red</option>
                    <option value="bg-orange-500">Orange</option>
                  </select>
               </div>
            </div>
            
            {/* Preview */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Live Preview</p>
              {settings.announcement.enabled ? (
                <div className={`${settings.announcement.bgColor} text-white px-4 py-2 rounded text-center text-sm font-medium`}>
                  {settings.announcement.text}
                </div>
              ) : (
                <div className="border border-dashed border-slate-700 text-slate-600 px-4 py-2 rounded text-center text-sm">
                  Banner is hidden
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;