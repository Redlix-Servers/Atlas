'use client';

import React, { useState } from 'react';
import { createClient, deleteClient } from './actions';

type Developer = { id: string; name: string; email: string };
type Client = { 
  id: string; 
  clientRef: string; 
  name: string; 
  email: string; 
  company: string | null; 
  companyType: string | null;
  authorizedName: string | null;
  phone: string | null;
  address: string | null;
  developer?: { name: string } | null; 
  createdAt: Date 
};

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
            Provision new clients with complete metadata and assign them to developers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Panel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-medium text-white mb-6 border-b border-zinc-900 pb-4">Assign New Client</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Contact Name</label>
              <input name="name" type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Contact Email</label>
              <input name="email" type="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Company Name</label>
                <input name="company" type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50" placeholder="Acme Inc" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Company Type</label>
                <select name="companyType" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 appearance-none">
                  <option value="">Select Type</option>
                  <option value="Startup">Startup</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="SME">SME</option>
                  <option value="Non-Profit">Non-Profit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Authorized Person</label>
              <input name="authorizedName" type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50" placeholder="Legal Representative" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                <input name="phone" type="tel" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50" placeholder="+1..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Developer</label>
                <select name="developerId" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 appearance-none">
                  <option value="">Unassigned</option>
                  {developers.map(dev => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">Office Address</label>
              <textarea name="address" rows={2} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 resize-none" placeholder="Primary work location..." />
            </div>

            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-bold tracking-wide transition-all shadow-sm">
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
               <div key={client.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-700 transition-all flex flex-col gap-4">
                 <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                   <div className="space-y-1">
                     <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white tracking-tight">{client.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black tracking-widest">{client.clientRef}</span>
                        {client.companyType && <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase">{client.companyType}</span>}
                     </div>
                     <p className="text-sm text-zinc-400 font-medium">{client.email} {client.phone && <span className="text-zinc-600 block sm:inline sm:before:content-['•'] sm:before:mx-2">{client.phone}</span>}</p>
                   </div>
                   <button onClick={() => handleDelete(client.id)} className="text-zinc-600 hover:text-red-500 transition-colors p-2 -mr-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-zinc-900">
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Business Entity</h4>
                      <p className="text-xs text-white font-medium">{client.company || 'N/A'}</p>
                      {client.authorizedName && <p className="text-[10px] text-zinc-400 mt-1 italic">Auth: {client.authorizedName}</p>}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Handler Assigned</h4>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${client.developer ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div>
                         <span className="text-xs font-semibold text-zinc-200">{client.developer ? client.developer.name : 'Infrastructure Pool'}</span>
                      </div>
                    </div>
                 </div>

                 {client.address && (
                    <div className="pt-3 border-t border-zinc-900">
                       <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Registered Address</h4>
                       <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">{client.address}</p>
                    </div>
                 )}
               </div>
             ))
           )}
        </div>

      </div>
    </div>
  );
}
