import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full bg-red-600 border-b border-red-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">

            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group flex items-center">
                {/* Paste your external image link in the src below */}
                <img
                  src="https://ik.imagekit.io/dypkhqxip/logo_atlas.png"
                  alt="Logo"
                  className="h-14 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
                />
              </Link>
            </div>

            {/* Links Section */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/test-db" className="text-sm font-medium text-red-100 hover:text-white transition-colors">
                Test DB
              </Link>
              <Link href="#" className="text-sm font-medium text-red-100 hover:text-white transition-colors">
                Documentation
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="h-9 px-5 inline-flex items-center justify-center rounded-md border border-white text-white text-sm font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Server Login
            </Link>

            <Link
              href="#"
              className="h-9 px-5 inline-flex items-center justify-center rounded-md bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}