'use client';

import React, { useState } from 'react';
import { createClient, deleteClient } from './actions';

type Developer = { id: string; name: string; email: string };
type Client = { id: string; clientRef: string; name: string; email: string; company: string | null; developer?: { name: string } | null; createdAt: Date };

export default function ClientManager({ developers, clients }: { developers: Developer[], clients: Client[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createClient(formData);
    
    if (res?.error) setError(res.error);
    else (e.target as HTMLFormElement).reset();
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
     if (confirm('Are you sure you want to remove this client?')) {
       await deleteClient(id);
     }
  };

  return (
    <div className="p-8 sm:p-12 w-full flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Manage Clients</h1>
          <p className="text-zinc-400 text-sm">
            Provision new clients and assign them to developers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Panel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-medium text-white mb-6 border-b border-zinc-900 pb-4">Assign New Client</h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Client Name</label>
              <input name="name" type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Client Email</label>
              <input name="email" type="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Company (Optional)</label>
              <input name="company" type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Assign To Developer</label>
              <select name="developerId" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 appearance-none">
                <option value="">Unassigned</option>
                {developers.map(dev => (
                  <option key={dev.id} value={dev.id}>{dev.name} ({dev.email})</option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm">
              {loading ? 'Processing...' : 'Provision Client'}
            </button>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 space-y-4">
           {clients.length === 0 ? (
             <div className="bg-zinc-950 border border-zinc-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                 <p className="text-zinc-500 text-sm">No clients provisioned yet.</p>
             </div>
           ) : (
             clients.map(client => (
               <div key={client.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row shadow-sm hover:border-zinc-700 transition-colors items-center justify-between gap-4">
                 <div>
                   <h3 className="text-white font-medium flex items-center gap-3">
                     {client.name} 
                     <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold">{client.clientRef}</span>
                     {client.company && <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{client.company}</span>}
                   </h3>
                   <p className="text-sm text-zinc-400 mt-1">{client.email}</p>
                   
                   <div className="mt-3 flex items-center gap-2">
                     <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Handler:</span>
                     <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20 font-medium">
                       {client.developer ? client.developer.name : 'Unassigned'}
                     </span>
                   </div>
                 </div>

                 <button onClick={() => handleDelete(client.id)} className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
             ))
           )}
        </div>

      </div>
    </div>
  );
}
