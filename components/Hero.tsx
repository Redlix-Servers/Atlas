import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden w-full flex flex-col justify-center min-h-[60vh] py-20">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] bg-white/[0.04] rounded-[100%] blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-zinc-600/[0.06] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left">
        <div className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs sm:text-sm text-zinc-300 backdrop-blur-md shadow-sm md:py-1.5 md:px-5 mb-8 transition-transform hover:scale-105 cursor-default">
          <span className="flex h-2.5 w-2.5 flex-none rounded-full bg-emerald-500 mr-2.5 animate-pulse" />
          Systems are online and operational
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500 leading-[1.1] pb-2">
          Build the <br className="sm:hidden" /> Future
        </h1>
        
        <p className="mt-8 text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed font-medium">
          The ultimate foundation for builders and creators. Empower your ideas with our state-of-the-art infrastructure. Start crafting today.
        </p>
        
        <div className="mt-12 flex flex-col justify-start sm:flex-row gap-5 items-center w-full sm:w-auto">
          <Link
            href="/dev-login"
            className="group flex w-full sm:w-auto items-center justify-center px-8 py-4 text-sm font-semibold rounded-full bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5"
          >
            Developer Access
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/test-db"
            className="flex w-full sm:w-auto items-center justify-center px-8 py-4 text-sm font-semibold rounded-full bg-[#0a0a0a] border border-white/10 text-white hover:bg-zinc-900 hover:border-white/20 transition-all hover:-translate-y-0.5"
          >
            Explore Test Database
          </Link>
        </div>
      </div>
    </div>
  );
}
