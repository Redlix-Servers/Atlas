import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '../lib/prisma';

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const clientToken = cookieStore.get('client_token');

  if (!clientToken || !clientToken.value) {
    redirect('/client-login');
  }

  const client = await prisma.client.findUnique({
    where: { id: clientToken.value },
    include: {
        developer: true
    }
  });

  if (!client) {
    redirect('/client-login');
  }

  const initials = client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-blue-500/30">
      
      {/* Client Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col h-screen sticky top-0 z-20">
        <div className="h-20 flex items-center px-6 border-b border-zinc-900">
          <Link href="/client-portal" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-black text-[10px] text-white group-hover:bg-blue-500 transition-colors">
              A
            </div>
            <span className="text-sm font-black tracking-tighter text-white uppercase italic">Atlas</span>
          </Link>
        </div>
        
        <div className="px-6 py-6 border-b border-zinc-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{client.name}</p>
              <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-tighter">{client.company || 'Private Client'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Portal Active</span>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-1.5 flex-grow">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-3 mt-4 mb-3">Project Hub</div>
          
          <Link href="/client-portal" className="px-3 py-2.5 rounded-xl bg-blue-500 text-white text-[13px] font-semibold flex items-center gap-3 hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
          </Link>
          
          <Link href="/client-portal/collaboration" className="px-3 py-2.5 rounded-xl text-zinc-400 text-[13px] font-medium hover:bg-zinc-900/50 hover:text-white transition-all flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
            Chat & Updates
          </Link>

          <Link href="/client-portal/files" className="px-3 py-2.5 rounded-xl text-zinc-400 text-[13px] font-medium hover:bg-zinc-900/50 hover:text-white transition-all flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Deliverables
          </Link>

          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-3 mt-6 mb-3">Support</div>
          
          <Link href="/client-portal/ticket" className="px-3 py-2.5 rounded-xl text-zinc-400 text-[13px] font-medium hover:bg-zinc-900/50 hover:text-white transition-all flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Request Help
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-900">
          <form action={async () => {
            'use server';
            const cookieStore = await cookies();
            cookieStore.delete('client_token');
            redirect('/client-login');
          }}>
            <button type="submit" className="w-full text-center px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-900/40 hover:bg-red-950/20 hover:text-red-400 text-zinc-500 transition-all text-[11px] font-black uppercase tracking-widest">
              Exit Portal
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-black relative">
        {/* Decorative noise/gradient */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
