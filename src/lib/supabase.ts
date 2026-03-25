import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Unified client config to ensure session consistency
const commonConfig = {
  auth: {
    storageKey: 'sb-elitewear-auth',
    persistSession: true,
    autoRefreshToken: true,
  },
  cookieOptions: {
    name: 'sb-elitewear-auth',
  }
}

// Standard User Client
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  commonConfig
)

// Dedicated Admin Client (sharing same session for simplicity)
export const adminSupabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  commonConfig
)
