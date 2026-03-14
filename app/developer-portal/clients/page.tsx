import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';

export default async function DeveloperClientsPage() {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');

  if (!devToken || !devToken.value) {
    redirect('/dev-login');
  }

  const clients = await prisma.client.findMany({
    where: { developerId: devToken.value },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 sm:p-12 w-full flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">My Clients</h1>
          <p className="text-zinc-400 text-sm">
            Organizations and profiles assigned to your workspace unit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {clients.length === 0 ? (
            <div className="col-span-full py-20 border border-zinc-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                 <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No Assigned Clients</h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                You do not currently have any active clients assigned to your developer token. Contact a Super Admin for provisioning.
              </p>
            </div>
         ) : (
            clients.map(client => (
               <div key={client.id} className="bg-zinc-950/50 border border-zinc-800/60 rounded-3xl p-6 shadow-sm flex flex-col transition-all hover:bg-zinc-950 hover:border-zinc-700/60 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] group relative overflow-hidden">
                 
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="flex items-start justify-between mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shrink-0">
                      <span className="text-xl font-bold tracking-tighter uppercase">{client.name.charAt(0)}</span>
                   </div>
                   <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest shrink-0">
                     Active Client
                   </div>
                 </div>

                 <div className="flex-grow">
                   <h2 className="text-xl font-medium tracking-tight text-white mb-1">{client.name}</h2>
                   <p className="text-[10px] font-bold text-emerald-500/80 mb-3 tracking-widest">{client.clientRef}</p>
                   {client.company && (
                     <p className="text-zinc-500 text-sm font-medium mb-4 flex items-center gap-1.5">
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                       {client.company}
                     </p>
                   )}
                 </div>

                 <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-zinc-400 text-sm">
                   <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   <span className="truncate">{client.email}</span>
                 </div>

               </div>
            ))
         )}
      </div>
    </div>
  );
}
