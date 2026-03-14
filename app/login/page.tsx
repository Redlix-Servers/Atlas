'use client';

import { useActionState, useTransition } from 'react';
import { loginAction } from './actions';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans relative overflow-hidden text-zinc-100">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <Link href="/" className="group flex justify-center mb-8">
          <img
            src="https://ik.imagekit.io/dypkhqxip/logo_atlas.png"
            alt="Atlas Redlix Logo"
            className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          />
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2 text-white tracking-tight">System Login</h1>
          <p className="text-sm text-zinc-500">Access restricted to authorized personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block ml-1">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full bg-zinc-900 border border-white/5 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-600 shadow-inner"
              placeholder="Admin Username"
            />
          </div>
          
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-zinc-900 border border-white/5 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-600 shadow-inner"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="bg-red-950/40 border border-red-900 text-red-400 text-sm px-4 py-2.5 rounded-xl text-center shadow-inner">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-white text-black font-semibold rounded-xl py-3 mt-4 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                Authenticate
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
