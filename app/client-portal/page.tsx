import { cookies } from 'next/headers';
import { prisma } from '../lib/prisma';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';

export default async function ClientDashboardPage() {
  const cookieStore = await cookies();
  const clientToken = cookieStore.get('client_token');

  const client = await prisma.client.findUnique({
    where: { id: clientToken?.value },
    include: {
      developer: true
    }
  });

  if (!client) return null;

  return (
    <div className="p-8 sm:p-12 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Overview
          </h1>
          <p className="text-zinc-500 font-medium">
            Welcome back, {client.name.split(' ')[0]}. Here is what's happening with your project.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Plan: Enterprise
            </span>
            <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500">
                Region: Global
            </span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-sm group hover:border-zinc-800 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Project</span>
          </div>
          <p className="text-xl font-bold text-white mb-1">{client.company || 'Standard Implementation'}</p>
          <p className="text-xs text-zinc-600 font-medium italic">Project ID: {client.id.slice(0, 8)}...</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-sm group hover:border-zinc-800 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Milestones</span>
          </div>
          <p className="text-xl font-bold text-white mb-1">Phase 2: Alpha</p>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[65%] shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-sm group hover:border-zinc-800 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Next Demo</span>
          </div>
          <p className="text-xl font-bold text-white mb-1">Thursday, 14:00</p>
          <p className="text-xs text-orange-500 font-black uppercase tracking-tighter mt-1">In 3 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Contact */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden">
          <div className="px-8 py-6 border-b border-zinc-900 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Assigned Developer
            </h3>
            <ExternalLink className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="p-8">
            {client.developer ? (
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-300">
                  {client.developer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{client.developer.name}</h4>
                  <p className="text-zinc-500 text-sm mb-3">Principal Infrastructure Engineer</p>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Thread
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-zinc-500 text-sm mb-1 italic">No developer assigned yet.</p>
                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Pending Assignment</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-zinc-800 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Project Proposal</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">PDF · 2.4 MB</p>
                    </div>
                </div>
                <button className="text-zinc-700 group-hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-zinc-800 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Asset Guidelines</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Shared Drive</p>
                    </div>
                </div>
                <button className="text-zinc-700 group-hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-20 pt-8 border-t border-zinc-900 flex items-center justify-between">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Atlas Client Infrastructure v2.1</p>
        <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-zinc-700 hover:text-zinc-500 cursor-pointer transition-colors uppercase tracking-[0.2em]">Privacy</span>
            <span className="text-[10px] font-black text-zinc-700 hover:text-zinc-500 cursor-pointer transition-colors uppercase tracking-[0.2em]">Compliance</span>
        </div>
      </div>
    </div>
  );
}
