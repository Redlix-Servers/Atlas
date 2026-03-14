'use client';

import React, { useState } from 'react';
import { updateDeveloperSettings } from './actions';

type Developer = {
  name: string;
  email: string;
  reason: string;
  createdAt: Date;
};

export default function SettingsForm({ developer }: { developer: Developer }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateDeveloperSettings(formData);

    if (res.error) {
       setError(res.error);
    } else {
       setSuccess(true);
       setTimeout(() => setSuccess(false), 3000);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8 sm:p-12 max-w-4xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Account Settings</h1>
          <p className="text-zinc-400 text-sm">
            Manage your developer profile and access configurations here.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        
        {/* Profile Card */}
        <div className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)] relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
          
          <h2 className="text-lg font-medium text-white mb-6 border-b border-zinc-900 pb-4 relative z-10">Personal Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl relative z-10">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Display Name</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={developer.name}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Email Address</label>
              <input 
                type="email" 
                value={developer.email}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-500 opacity-70 focus:outline-none cursor-not-allowed transition-colors"
                disabled
              />
              <p className="text-[11px] text-zinc-600 mt-2 font-medium">To change your primary email, please contact a cluster administrator.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Workspace Access Reason</label>
              <textarea 
                name="reason" 
                defaultValue={developer.reason}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                disabled={loading}
              />
            </div>

             <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-zinc-900 gap-4 mt-8">
              <div className="flex-1">
                {success && (
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     <span className="text-xs text-emerald-400 font-medium">Profile updated successfully.</span>
                   </div>
                )}
                {error && (
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-900/50">
                     <span className="w-2 h-2 rounded-full bg-red-500"></span>
                     <span className="text-xs text-red-400 font-medium">{error}</span>
                   </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] disabled:opacity-50 flex justify-center items-center h-[44px]"
              >
                {loading ? (
                   <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Read-Only Status Card */}
        <div className="bg-zinc-950 border border-zinc-800/50 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)] relative overflow-hidden">
           <h2 className="text-lg font-medium text-white mb-6 border-b border-zinc-900 pb-4 relative z-10">Access Data</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                 <h4 className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase mb-1">Status</h4>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse"></span>
                    <p className="text-sm font-medium text-emerald-400">Approved Developer</p>
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                 <h4 className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase mb-1">Member Since</h4>
                 <p className="text-sm font-medium text-white">{new Date(developer.createdAt).toLocaleDateString()}</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
