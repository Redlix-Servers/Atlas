'use client';

import React, { useState } from 'react';
import { superAdminLogin } from './actions';
import { useRouter } from 'next/navigation';

export default function SuperAdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await superAdminLogin(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/super-admin');
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans tracking-tight selection:bg-rose-500/30 p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Super Admin Ops</h1>
          <p className="text-zinc-400 text-sm">System administration portal</p>
        </div>

        <div className="bg-zinc-950/40 backdrop-blur-xl border border-zinc-900 rounded-[2rem] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Username</label>
              <input
                name="username"
                type="text"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_4px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_4px_30px_rgba(225,29,72,0.4)] disabled:opacity-50 mt-4 flex justify-center items-center h-[52px]"
            >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Authenticate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
