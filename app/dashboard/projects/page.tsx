'use client';

import React, { useEffect, useState } from 'react';
import { createProjectAction } from './actions';

type LiveProject = {
  id: string;
  name: string;
  environment: string;
  status: string;
  api: string;
  db: string;
  connections: number;
  latency: string;
  issue: string;
};

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchLiveMetrics = async (mounted = true) => {
    try {
      const res = await fetch('/api/projects/monitor');
      if (!res.ok) throw new Error('Failed to fetch project metrics');
      
      const data = await res.json();
      
      if (mounted) {
        setProjects(data.projects || []);
        setError(null);
        setLastUpdated(new Date());
        setIsLoading(false);
      }
    } catch (err: any) {
      if (mounted) {
        setError('Failed to connect to monitoring server.');
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initial fetch
    fetchLiveMetrics(mounted);

    // Poll every 5 seconds
    const intervalId = setInterval(() => fetchLiveMetrics(mounted), 5000);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createProjectAction(formData);

    if (res.error) {
      setModalError(res.error);
    } else {
      setIsModalOpen(false);
      // Immediately refresh live metrics
      setIsLoading(true);
      fetchLiveMetrics(true);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="p-8 sm:p-12 max-w-6xl mx-auto min-h-screen relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Supabase Infrastructure Monitor</h1>
          <p className="text-zinc-400 text-sm">
            Live health, metrics, and analytics for all registered projects.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 mb-2">
            <span className={`flex h-2 w-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></span>
            <span className="text-xs font-mono text-zinc-300 tracking-wide">
              {error ? 'POLLING FAILED' : 'POLLING METRICS'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono uppercase font-semibold">
            {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Syncing...'}
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-3 px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors shadow-sm"
          >
            + New Project
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 mb-8 rounded-2xl bg-[#110505] border border-red-900/50 text-red-400">
          <p className="font-semibold mb-1 tracking-tight">Monitoring Alert</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      )}

      {isLoading && !error ? (
        <div className="h-40 flex items-center justify-center text-zinc-500 font-medium">
          <div className="flex items-center gap-3">
             <div className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
             Establishing connection to projects...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && !error ? (
             <div className="col-span-full h-40 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm font-medium">
               <p>No Supabase projects registered for monitoring yet.</p>
               <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-1.5 bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
               >
                 Add First Project
               </button>
             </div>
          ) : (
            projects.map((project) => (
              <div 
                key={project.id} 
                className={`flex flex-col rounded-2xl border bg-zinc-950 p-6 shadow-sm transition-all hover:shadow-md
                  ${project.status === 'error' ? 'border-red-900/30' : 
                    project.status === 'warning' ? 'border-yellow-900/30' : 
                    'border-zinc-800/60 hover:border-zinc-700/80'}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-2 w-2 rounded-full ${project.status === 'error' ? 'bg-red-500' : project.status === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></span>
                    <h3 className="text-lg font-medium text-white tracking-tight truncate max-w-[180px]">{project.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0 tracking-wider">
                    {project.environment}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 mb-6 flex-grow">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">API Status</span>
                    <span className={`font-medium text-xs ${project.api === 'Operational' ? 'text-zinc-300' : 'text-red-400'}`}>{project.api}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">DB Status</span>
                    <span className={`font-medium text-xs ${project.db === 'Operational' ? 'text-zinc-300' : 'text-red-400'}`}>{project.db}</span>
                  </div>
                  <div className="w-full h-[1px] bg-zinc-800/40 my-1"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Connections</span>
                    <span className="font-mono text-xs text-zinc-300">{project.connections}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Latency</span>
                    <span className="font-mono text-xs text-zinc-300">{project.latency}</span>
                  </div>
                </div>

                {project.issue ? (
                  <div className={`mt-auto px-3 py-2 rounded-lg text-xs font-medium border ${
                    project.status === 'error' ? 'bg-red-400/5 text-red-400 border-red-500/10' : 'bg-yellow-400/5 text-yellow-500 border-yellow-500/10'
                  }`}>
                    {project.issue}
                  </div>
                ) : (
                  <div className="mt-auto px-3 py-2 rounded-lg text-xs font-medium border bg-white/[0.02] text-zinc-400 border-white/[0.05] flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500/50"></span>
                    System optimal
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Project Side Panel */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
        
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-y-auto transition-transform duration-300 transform ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-8 h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-white mb-2">Track a New Project</h2>
            <p className="text-sm text-zinc-400 mb-8">Add your database details below so our system can monitor it.</p>
            
            <form onSubmit={handleAddProject} className="flex flex-col gap-5 flex-grow">
              
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Project Name</label>
                <input type="text" name="name" required placeholder="For example: My Awesome App" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Environment</label>
                <select name="environment" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]">
                  <option value="production">Production (Live App)</option>
                  <option value="staging">Staging (Testing)</option>
                  <option value="development">Development (Local)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Project Reference ID</label>
                <input type="text" name="projectRef" required placeholder="Example: abcd1234efgh" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  Go to <strong>Project Settings &gt; General</strong> in your Supabase dashboard. It's the 20-letter random unguessable ID.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">API URL</label>
                <input type="url" name="projectUrl" required placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  Go to <strong>Project Settings &gt; API</strong> and copy the Project URL.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Service Role Secret Key</label>
                <input type="password" name="serviceRoleKey" required placeholder="eyJhbGciOiJIUzI1NiIsInR5c..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  Go to <strong>Project Settings &gt; API</strong>. We strictly need the <span className="text-red-400 font-semibold">'service_role' secret</span>, not your anon public key. This allows the server to skip row level security and read system data securely.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Database Connection String</label>
                <input type="password" name="databaseUrl" required placeholder="postgres://postgres.abcd:password@db.supabase.co:5432/postgres" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  Go to <strong>Project Settings &gt; Database</strong>. Copy the URI under "Connection string". Do not forget to replace <code>[YOUR-PASSWORD]</code> with your actual database password!
                </p>
              </div>

              {modalError && (
                <div className="bg-red-950/40 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl mt-2 font-medium">
                  {modalError}
                </div>
              )}

              <div className="flex gap-4 mt-auto pt-6 border-t border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] flex-[2]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Testing Connect...
                    </>
                  ) : (
                    "Save & Monitor Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
