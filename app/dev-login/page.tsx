'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitDevApplication, devLogin } from './actions';

export default function DevLoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    
    if (isRegistering) {
      const res = await submitDevApplication(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess('Application submitted successfully! Please wait for server-side approval before logging in.');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setIsRegistering(false), 3000);
      }
    } else {
      const res = await devLogin(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/developer-portal');
      }
    }
    setLoading(false);
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
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle bg glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-10 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 font-mono text-xl shadow-inner text-emerald-400">
              {'</>'}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
              {isRegistering ? 'Dev Application' : 'Developer Access'}
            </h1>
            <p className="text-zinc-500 text-sm max-w-[280px] mx-auto">
              {isRegistering 
                ? 'Apply for a developer workspace instance.' 
                : 'Enter your email to access your approved workspace.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
            
            {isRegistering && (
              <>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 shadow-sm block">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Jane Doe"
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 shadow-sm block">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="developer@domain.com"
                disabled={loading}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
              />
            </div>

            {isRegistering && (
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 shadow-sm block">Reason for Access</label>
                <textarea 
                  name="reason" 
                  required 
                  placeholder="I am building a..."
                  rows={3}
                  disabled={loading}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none disabled:opacity-50"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl">
                <p className="text-xs text-red-500 font-medium text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
                <p className="text-xs text-emerald-500 font-medium text-center">{success}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 w-full px-4 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                isRegistering ? 'Submit Application' : 'Authenticate'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-zinc-500 mt-6 pt-6 border-t border-zinc-900 relative z-10">
            {isRegistering ? (
              <p>Already approved? <button onClick={() => setIsRegistering(false)} className="text-white hover:underline transition-all">Sign in here</button></p>
            ) : (
              <p>Need access? <button onClick={() => setIsRegistering(true)} className="text-white hover:underline transition-all">Apply for an account</button></p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
