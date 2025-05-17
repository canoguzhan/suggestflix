import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for the admin panel
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For now, we'll use a simple authentication check
    // You should replace this with proper authentication later
    const isAuthenticated = request.cookies.get('admin_token');
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: '/admin/:path*',
}; 