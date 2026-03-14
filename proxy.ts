import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin Dashboard
  if (pathname.startsWith('/dashboard')) {
    const adminToken = request.cookies.get('atlas_admin_token');
    if (!adminToken || adminToken.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Developer Portal
  if (pathname.startsWith('/developer-portal')) {
    const devToken = request.cookies.get('dev_token');
    if (!devToken || !devToken.value) {
      return NextResponse.redirect(new URL('/dev-login', request.url));
    }
  }

  // Protect Super Admin Portal
  if (pathname.startsWith('/super-admin')) {
    const superToken = request.cookies.get('super_admin_token');
    if (!superToken || superToken.value !== 'true') {
      return NextResponse.redirect(new URL('/super-admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/developer-portal/:path*', '/super-admin/:path*'],
};
