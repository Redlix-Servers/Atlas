'use client';

import React, { useState } from 'react';
import { updateSettings } from './actions';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    await updateSettings(formData);
    
    setSuccess(true);
    setLoading(false);

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="p-8 sm:p-12 max-w-4xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Platform Settings</h1>
          <p className="text-zinc-400 text-sm">
            Manage global infrastructure configurations and security policies.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* Core Settings Block */}
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-medium text-white mb-6 border-b border-zinc-900 pb-4">General Configuration</h2>
          
          <div className="space-y-6 max-w-xl">
            <div>
              <label className="text-sm font-semibold text-zinc-300 mb-2 block">System Name</label>
              <input 
                type="text" 
                name="system_name" 
                defaultValue="Atlas Core Infrastructure"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <p className="text-[11px] text-zinc-500 mt-2">This is the internal reference identifier for the cluster.</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-300 mb-2 block">Admin Contact Email</label>
              <input 
                type="email" 
                name="admin_email" 
                defaultValue="system-admin@atlas-core.io"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors"
                disabled // read-only default
              />
            </div>
          </div>
        </div>

        {/* Security / Toggles Block */}
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-medium text-white mb-6 border-b border-zinc-900 pb-4">Security & Access</h2>
          
          <div className="space-y-6">
            
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="pr-8">
                <h4 className="text-sm font-semibold text-white mb-1">Strict Maintenance Mode</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Instantly lock out all incoming Developer Portal traffic and redirect APIs to offline maintenance statuses.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" name="maintenance_mode" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-500/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 outline-none"></div>
              </label>
            </div>

             {/* Toggle 2 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="pr-8">
                <h4 className="text-sm font-semibold text-white mb-1">Auto-Approve Developer Tokens</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Automatically grant dashboard access to new developer applications instantly without requiring manual Admin review.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" name="auto_approve_devs" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-500/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 outline-none"></div>
              </label>
            </div>

          </div>
        </div>

        {/* Global Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-zinc-800 gap-4">
          <div className="flex-1">
            {success && (
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                 <span className="text-xs text-emerald-400 font-medium">Config synchronization successful.</span>
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
            ) : "Save Settings"}
          </button>
        </div>

      </form>
    </div>
  );
}
