export default function TopBanner() {
  return (
    <div className="w-full bg-black border-b border-white/[0.05] text-center py-2.5 px-4 sm:px-6 z-50 relative group cursor-pointer transition-colors hover:bg-white/[0.02]">
      <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        <span className="hidden sm:inline">Announcing our new platform phase:</span>
        <span className="text-white">Atlas Redlix Servers are LIVE.</span>
        
        <a href="#" className="flex items-center group/btn text-xs text-zinc-300 hover:text-white transition-colors ml-1 sm:ml-2">
          Explore Servers
          <svg className="ml-1 w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </p>
    </div>
  );
}
