'use client';

import { useEffect, useState } from 'react';

type DBFeedItem = {
  id: number;
  text: string;
  createdAt: string;
};

export default function DashboardFeedPage() {
  const [items, setItems] = useState<DBFeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Poll exactly every 1.5 seconds for true real-time feeling
  useEffect(() => {
    let mounted = true;
    
    async function fetchFeed() {
      try {
        const res = await fetch('/api/feed');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        if (mounted) {
          setItems(data);
          setError(null);
          setLastUpdated(new Date());
        }
      } catch (err: any) {
        if (mounted) setError("Lost connection to the database layer.");
      }
    }

    // Initial fetch
    fetchFeed();

    // Polling interval
    const intervalId = setInterval(fetchFeed, 1500);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="p-8 sm:p-12 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Live Database Feed</h1>
          <p className="text-zinc-400 text-sm">
            Real-time synchronization with the Atlas cluster.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 mb-2">
            <span className={`flex h-2 w-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></span>
            <span className="text-xs font-mono text-zinc-300">
              {error ? 'DISCONNECTED' : 'SYNCING LIVE'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono uppercase">
            Last Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl bg-[#110505] border border-red-900/50 text-red-400">
          <p className="font-semibold mb-1 tracking-tight">System Alert</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
             <div 
               key={item.id} 
               className={`px-5 py-4 rounded-xl bg-zinc-900 border flex justify-between items-center group transition-colors shadow-sm
                 ${i === 0 ? 'border-zinc-700 bg-zinc-800/80 shadow-[0_0_15px_rgba(255,255,255,0.03)]' : 'border-zinc-800/50 hover:bg-zinc-800/50'}
               `}
             >
               <div className="flex items-center gap-4">
                 <div className="font-mono text-[10px] text-zinc-600 w-12 text-center group-hover:text-zinc-400 transition-colors">#{item.id}</div>
                 <div className={`font-medium tracking-wide ${i === 0 ? 'text-white' : 'text-zinc-300'}`}>
                   {item.text}
                 </div>
               </div>
               <span className="text-xs font-mono text-zinc-500 tracking-tighter">
                 {new Date(item.createdAt).toLocaleTimeString()}
               </span>
             </div>
          ))}

          {items.length === 0 && (
            <div className="h-40 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm font-medium">
              No entries logged in the system currently. (Add some from the Test DB page to see them appear here instantly!)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
