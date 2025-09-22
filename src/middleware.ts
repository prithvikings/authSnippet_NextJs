import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value || ''

  // Root redirect first
  if (path === '/') {
    return NextResponse.redirect(new URL(token ? '/profile' : '/login', request.url))
  }

  // Public routes
  const publicPaths = ['/login', '/signup', '/verifyemail', '/resetpassword']
  const isPublicPath = publicPaths.some((p) => path.startsWith(p))

  // If logged in and visiting public → redirect to profile
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  // If not logged in and visiting private → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verifyemail',
    '/resetpassword',
    '/profile/:path*'
  ],
}
