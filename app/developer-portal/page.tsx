import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '../lib/prisma';
import RealTimeStats from './RealTimeStats';

export default async function DeveloperPortalOverview() {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');

  if (!devToken || !devToken.value) {
    redirect('/dev-login');
  }

  const dev = await prisma.developer.findUnique({
    where: { id: devToken.value },
    include: {
      _count: {
        select: { tasks: true, clients: true }
      }
    }
  });

  if (!dev) {
    redirect('/dev-login');
  }

  const initialStats = {
    tasksCount: dev._count.tasks,
    clientsCount: dev._count.clients,
    activeSince: new Date(dev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  return (
    <div className="p-8 sm:p-12 max-w-6xl mx-auto min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Hello, {dev.name}</h1>
          <p className="text-zinc-400 text-sm max-w-lg">
            Welcome back to the Atlas infrastructure environment. As an approved developer, you have access to internal workspaces and cluster APIs.
          </p>
        </div>
      </div>

      <RealTimeStats initialStats={initialStats} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* API Card */}
        <div className="flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-700/80">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </span>
              <h3 className="text-lg font-medium text-white tracking-tight">API Interface</h3>
            </div>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-grow">Generate highly available endpoints mapped automatically to your underlying Postgres tables.</p>
          <button className="w-full mt-auto py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-white hover:text-black transition-colors">Launch Sandbox</button>
        </div>

        {/* Database Sync Card */}
        <div className="flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-700/80">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              </span>
              <h3 className="text-lg font-medium text-white tracking-tight">Postgres Engine</h3>
            </div>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-grow">Execute SQL schemas and design relationships securely embedded directly in the Atlas ecosystem.</p>
          <button className="w-full mt-auto py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-white hover:text-black transition-colors">Open Client</button>
        </div>

        {/* Auth Config Card */}
        <div className="flex flex-col rounded-2xl border border-zinc-800/60 bg-zinc-950 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-700/80">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <h3 className="text-lg font-medium text-white tracking-tight">Identity Vault</h3>
            </div>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-grow">Manage cryptographic keys, configure Row Level Security bypass protocols, and implement OAuth integrations.</p>
          <button className="w-full mt-auto py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-white hover:text-black transition-colors">Access Vault</button>
        </div>

      </div>
    </div>
  );
}
