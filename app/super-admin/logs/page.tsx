'use server';

import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';

export default async function AuditLogPage() {
  const cookieStore = await cookies();
  const superToken = cookieStore.get('super_admin_token');

  if (!superToken || superToken.value !== 'true') return <div className="p-8 text-rose-500">Access Denied</div>;

  const logs = await prisma.auditLog.findMany({
    include: { developer: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="p-8 sm:p-12 w-full flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Audit Logs</h1>
          <p className="text-zinc-400 text-sm">
            Live surveillance of all developer activity across the cluster.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 border-dashed rounded-3xl p-12 text-center text-zinc-500">
             No activity recorded yet.
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[10px] font-bold text-rose-500">
                  {log.action.split('_')[0]}
                </div>
                <div>
                   <p className="text-sm font-semibold text-white tracking-tight">{log.action}</p>
                   <p className="text-xs text-zinc-500 mt-1">{log.details}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:items-end">
                 <p className="text-xs font-medium text-zinc-400">{log.developer.name}</p>
                 <p className="text-[10px] text-zinc-600 font-mono mt-1">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
