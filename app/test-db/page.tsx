import { prisma } from '../lib/prisma';
import { TestForm } from './TestForm';
import Link from 'next/link';

export default async function TestDbPage() {
  let messages: any[] = [];
  let dbError: string | null = null;
  
  try {
    messages = await prisma.testMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  } catch (error: any) {
    dbError = error.message || 'Could not connect to the database.';
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans py-20 px-6 sm:px-12 flex flex-col items-center selection:bg-zinc-800">
      <Link href="/" className="fixed top-8 left-8 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group">
        <span className="transform transition-transform group-hover:-translate-x-1">←</span> 
        <span className="font-medium text-sm tracking-wide">Back Home</span>
      </Link>
      
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          Database Connection
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto text-lg leading-relaxed">
          A very simple form to test reading and writing to the database using Server Actions and Prisma.
        </p>
      </div>

      <TestForm />

      <div className="w-full max-w-md mt-16 pt-8 border-t border-zinc-900">
        <h3 className="text-xl font-semibold mb-6 flex items-center justify-between">
          Recent Data
          {dbError ? (
             <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">Disconnected</span>
          ) : (
             <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Connected</span>
          )}
        </h3>

        {dbError ? (
          <div className="p-4 rounded-2xl bg-[#1a0f0f] border border-red-900/40 text-red-300 text-sm shadow-inner shadow-red-900/10">
            <p className="font-semibold mb-2">Failed to connect to Prisma:</p>
            <p className="font-mono text-xs opacity-80 break-all leading-snug">{dbError}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-zinc-800 text-zinc-500 text-sm bg-zinc-950/50">
            No test messages yet. Submit one above!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className="px-5 py-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex justify-between items-center transition-all hover:bg-zinc-800 hover:border-zinc-700/80 shadow-sm backdrop-blur-sm group">
                <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">{msg.text}</span>
                <span className="text-xs font-mono text-zinc-500 tracking-tighter">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
