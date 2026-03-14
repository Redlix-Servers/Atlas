import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-900/50 py-8 px-4 sm:px-6 lg:px-8 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <Link href="/">
            <img
              src="https://ik.imagekit.io/dypkhqxip/logo_atlas.png"
              alt="Atlas Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>
        
        <p className="text-xs text-zinc-600 font-medium">
          &copy; {new Date().getFullYear()} Redlix Systems. All rights reserved.
        </p>
        
        <div className="flex gap-6">
          <Link href="#" className="text-zinc-600 hover:text-white transition-colors text-xs font-medium">Terms</Link>
          <Link href="#" className="text-zinc-600 hover:text-white transition-colors text-xs font-medium">Privacy</Link>
          <Link href="#" className="text-zinc-600 hover:text-white transition-colors text-xs font-medium">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
