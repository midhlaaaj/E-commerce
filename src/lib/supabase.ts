import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Unified client config to ensure session consistency and persistence
// storageKey is scoped specifically to this project's auth to prevent collisions (Instance Isolation)
const commonConfig = {
  auth: {
    storageKey: 'sb-elitewear-auth-v1',
    persistSession: true, // Enables Session Persistence across reloads/restarts
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  cookieOptions: {
    name: 'sb-elitewear-auth',
    lifetime: 60 * 60 * 24 * 7, // 7 days persistence
    domain: typeof window !== 'undefined' ? window.location.hostname : undefined,
    path: '/',
    sameSite: 'lax' as const,
  }
}

// Standard User Client
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  commonConfig
)

// Dedicated Admin Client (sharing same session for simplicity but conceptually isolated for management)
export const adminSupabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  commonConfig
)
