import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    
    // Skip middleware for these paths
    const isPublicPath = 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/static') || 
      pathname.startsWith('/api') || 
      pathname === '/favicon.ico';
    
    if (isPublicPath) {
      return null;
    }

    // Define auth-related paths
    const isAuthPage = pathname.startsWith('/auth');
    const isSignOutPage = pathname === '/auth/signout';
    const isRootPage = pathname === '/';

    // 1. Handle sign out
    if (isSignOutPage) {
      return null;
    }

    // 2. Handle root page
    if (isRootPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 3. Handle auth pages (login, register)
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    // 4. Handle protected pages
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => true  // Let the middleware handle auth
    },
    pages: {
      signIn: '/auth/login',
    }
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}; 