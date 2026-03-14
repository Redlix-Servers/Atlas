'use client';

import React, { useEffect, useState } from 'react';

type Stats = {
  tasksCount: number;
  clientsCount: number;
  activeSince: string;
};

export default function RealTimeStats({ initialStats }: { initialStats: Stats }) {
  const [stats, setStats] = useState(initialStats);
  const [pulse, setPulse] = useState(false);

  // In a real app, this could be a subscription or poll
  // Here we just use the hydrated initial stats
  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 2000);
    return () => clearTimeout(timer);
  }, [initialStats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between group transition-all hover:bg-zinc-900/40">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Active Tasks</p>
          <p className="text-2xl font-bold text-white tracking-tighter">{stats.tasksCount}</p>
        </div>
        <div className={`w-2 h-2 rounded-full bg-emerald-500 ${pulse ? 'animate-ping' : 'shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
      </div>

      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between group transition-all hover:bg-zinc-900/40">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Assigned Clients</p>
          <p className="text-2xl font-bold text-white tracking-tighter">{stats.clientsCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <svg className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </div>
      </div>

      <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between group transition-all hover:bg-zinc-900/40 sm:col-span-2 lg:col-span-1">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Account Continuity</p>
          <p className="text-sm font-medium text-white tracking-tight">{stats.activeSince}</p>
        </div>
        <div className="text-[10px] font-mono font-bold text-emerald-500/50 uppercase">Verified</div>
      </div>
    </div>
  );
}
