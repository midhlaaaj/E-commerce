import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. PATH PROTECTION: /admin
  if (isAdminRoute && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // 2. PATH PROTECTION: /profile
  // For /profile, we allow ALREADY authenticated 'user' OR we check 'admin'
  if (pathname.startsWith('/profile') && !user) {
    // Check if they are logged in as admin
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: { name: 'sb-elitewear-admin-auth' },
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value },
          set: () => {}, // No need to set here
          remove: () => {},
        },
      }
    )
    const { data: { user: adminUser } } = await adminSupabase.auth.getUser()
    
    if (!adminUser) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // 3. REVERSE PROTECTION: /login, /signup, /admin/login
  // Redirect authenticated users away from these pages
  if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/admin/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
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
