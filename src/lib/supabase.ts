import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Generate a stable, unique ID for this browser tab.
 * Stored in sessionStorage so it:
 *   - Persists across page refreshes within the same tab
 *   - Is NOT shared with other tabs (sessionStorage is tab-scoped)
 *   - Disappears when the tab is closed
 *
 * This ID is appended to the Supabase storageKey, which Supabase uses
 * as the BroadcastChannel topic. Unique keys = no cross-tab auth sync.
 */
const getTabStorageKey = (role: string): string => {
  const idKey = `sb-tab-id-${role}`
  if (typeof window === 'undefined') return `sb-elitewear-${role}-auth`

  let tabId = window.sessionStorage.getItem(idKey)
  if (!tabId) {
    tabId = Math.random().toString(36).slice(2, 10)
    window.sessionStorage.setItem(idKey, tabId)
  }
  return `sb-elitewear-${role}-auth-${tabId}`
}

// Standard User Client — session is isolated to this tab only
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storageKey: getTabStorageKey('user'),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    },
  }
)

// Admin Client — session is isolated to this tab only, separate from user
export const adminSupabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storageKey: getTabStorageKey('admin'),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    },
  }
)

