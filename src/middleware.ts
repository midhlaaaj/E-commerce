import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith('/admin')
  
  // Create a client for the specific route role first
  const cookieRole = isAdminRoute ? 'admin' : 'user'
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: `sb-elitewear-${cookieRole}-auth` },
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Use getSession for faster check if we just need to see if a cookie exists effectively
  // but getUser is safer. We'll stick with getUser for security but avoid double-calling.
  const { data: { user } } = await supabase.auth.getUser()

  // 1. PATH PROTECTION: /admin
  if (isAdminRoute && pathname !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 2. PATH PROTECTION: /profile
  if (pathname.startsWith('/profile') && !user) {
    // If NOT logged in as user, check if we're logged in as admin as a fallback
    // We only do this check if the user is visiting a profile page and is NOT a regular user
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: { name: 'sb-elitewear-admin-auth' },
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value },
          set: () => {},
          remove: () => {},
        },
      }
    )
    const { data: { user: adminUser } } = await adminSupabase.auth.getUser()
    
    if (!adminUser) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 3. REVERSE PROTECTION: /login, /signup
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
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
