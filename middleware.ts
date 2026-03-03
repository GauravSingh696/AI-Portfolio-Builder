import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const AUTH_PAGES = ['/signin', '/signup']
const PROTECTED_PATHS = [
  '/dashboard',
  '/generate-portfolio',
  '/customize',
  '/portfolio',
  '/portfolios',
  '/projects',
  '/publish-success',
  '/communities',
]

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = request.nextUrl

    const isAuthPage = AUTH_PAGES.includes(pathname)
    const isProtectedRoute = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

    if (!token && isProtectedRoute) {
        const signInUrl = new URL('/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
  matcher: PROTECTED_PATHS.map((path) => `${path}/:path*`),
}