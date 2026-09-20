import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const rawUserData = request.cookies.get('user_data')?.value;
  const path = request.nextUrl.pathname;

  let userRole = null;
  if (rawUserData) {
    try {
      const data = JSON.parse(rawUserData);
      userRole = data.role;
    } catch (e) {
        // failed to parse
    }
  }

  // PROTECT /admin routes
  if (path.startsWith('/admin')) {
    if (!token || userRole !== 'admin_space') {
      const resp = NextResponse.redirect(new URL('/login', request.url));
      // Force clear bad cookies to prevent loop
      if (token && userRole !== 'admin_space') {
         resp.cookies.delete('access_token');
         resp.cookies.delete('user_data');
      }
      return resp;
    }
  }

  // PROTECT /history & /profile routes (Member only)
  if (path.startsWith('/history') || path.startsWith('/profile')) {
     if (!token || userRole !== 'member') {
       const resp = NextResponse.redirect(new URL('/login', request.url));
       if (token && userRole !== 'member') {
          resp.cookies.delete('access_token');
          resp.cookies.delete('user_data');
       }
       return resp;
     }
  }

  // IF LOGGED IN, STOP THEM FROM GOING BACK TO /login
  if (path.startsWith('/login') || path.startsWith('/register/member')) {
      if (token && userRole) {
          if (userRole === 'admin_space') return NextResponse.redirect(new URL('/admin', request.url));
          if (userRole === 'member') return NextResponse.redirect(new URL('/profile', request.url));
          
          // If role is invalid (e.g. leftover superadmin), wipe them and stay on login
          const resp = NextResponse.next();
          resp.cookies.delete('access_token');
          resp.cookies.delete('user_data');
          return resp;
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/history/:path*', '/profile', '/login', '/register/:path*'],
};
