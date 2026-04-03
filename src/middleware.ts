import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Supabase SSR Client for Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // Unified cookie name across all routes
        name: 'sb-elitewear-auth',
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Essential: Refreshing the session cookie
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // 1. PATH PROTECTION: /admin
  // If trying to access any admin route (except the login page) without auth
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // 2. PATH PROTECTION: /profile
  if (pathname.startsWith('/profile') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. REVERSE PROTECTION: /login, /signup, /admin/login
  // Redirect authenticated users away from these pages
  if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/admin/login')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/admin/login' ? '/admin' : '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (.*\\.(?:svg|png|jpg|jpeg|gif|webp)$ )
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
