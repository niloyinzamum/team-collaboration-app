import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define public routes that should be accessible without authentication
const publicRoutes = ['/login', '/register'];

// Define protected routes that require authentication

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // First check if it's a public route
  if (publicRoutes.includes(pathname)) {
    const token = request.cookies.get('authToken')?.value;
    
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        // If user is already authenticated, redirect to root (dashboard)
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        console.error('JWT verification failed:', error);
        return NextResponse.next();
      }
    }
    // No token, allow access to public routes
    return NextResponse.next();
  }

  // For all other routes (including root path), check authentication
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/settings/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ]
};