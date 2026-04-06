import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Generate a role-specific storage key.
 * This ensures that:
 *   - Sessions are persistent across multiple tabs of the same role (localStorage)
 *   - Admin and Storefront sessions are isolated and don't leak into each other
 */
const getRoleStorageKey = (role: string): string => {
  return `sb-elitewear-${role}-auth`
}

// Standard User Client — shared across all Storefront tabs via localStorage
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storageKey: getRoleStorageKey('user'),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

// Admin Client — isolated session for administrative duties
export const adminSupabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storageKey: getRoleStorageKey('admin'),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
