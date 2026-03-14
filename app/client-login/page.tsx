'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clientLogin } from './actions';

export default function ClientLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await clientLogin(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/client-portal');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Site
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle branding accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-12 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 mb-8 shadow-inner text-blue-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
              Client Portal
            </h1>
            <p className="text-zinc-500 text-sm max-w-[280px] mx-auto leading-relaxed">
              Enter your unique Client ID to access your project dashboard and collaborate with your team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block ml-1">Client Identification</label>
              <input 
                type="text" 
                name="clientId" 
                required 
                placeholder="cl_xxxxxxxxxxxxxx"
                disabled={loading}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50"
              />
              <p className="mt-3 text-[10px] text-zinc-600 ml-1">
                Your ID was provided by your project administrator during onboarding.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-1">
                <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 w-full px-5 py-4 bg-white text-black rounded-2xl text-sm font-bold hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-900 text-center relative z-10">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
              Secure Enterprise Access · Protected by Atlas Infrastructure
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
