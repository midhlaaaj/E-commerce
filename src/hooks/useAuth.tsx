'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, adminSupabase } from '@/lib/supabase';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  profileLoading: boolean;
  isAdmin: boolean;
  supabase: SupabaseClient;
  signOut: () => Promise<void>;
}

const UserContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: true,
  isAdmin: false,
  supabase: supabase,
  signOut: async () => {},
});

const AdminContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: true,
  isAdmin: false,
  supabase: adminSupabase,
  signOut: async () => {},
});

const createAuthProvider = (Context: React.Context<AuthContextType>, client: SupabaseClient) => {
  return ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async (uid: string) => {
      setProfileLoading(true);
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single();
        
        if (error) throw error;
        if (data) setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    useEffect(() => {
      let mounted = true;

      // 1. Initial Session Check (Fastest)
      client.auth.getSession()
        .then(({ data: { session } }) => {
          if (!mounted) return;
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          
          // Mark session loading as done immediately
          setLoading(false);
          
          if (currentUser) {
            fetchProfile(currentUser.id);
          } else {
            setProfileLoading(false);
          }
        })
        .catch((err) => {
          if (!mounted) return;
          console.error('Session fetching error:', err);
          setLoading(false);
          setProfileLoading(false);
        });

      // 2. Auth State Change listener
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        const currentUser = session?.user ?? null;
        
        // Only trigger updates if the user ID or event changed meaningfully
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          // Fetch profile but don't AWAIT it here to prevent blocking state updates
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
          setProfileLoading(false);
        }

        // Centralized refresh for all session events
        // This ensures Server Components stay in sync with Client Auth state
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          router.refresh();
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }, [router]);

    const signOut = async () => {
      // Optimistic instant checkout
      setUser(null);
      setProfile(null);
      setProfileLoading(false);
      setLoading(false);
      
      // Dispatching this keeps legacy listeners happy if any exist
      window.dispatchEvent(new CustomEvent('auth:signout'));

      try {
        await client.auth.signOut();
        // router.refresh() will be triggered by onAuthStateChange listener
      } catch (err) {
        console.error('Sign out error:', err);
      }
    };

    const isAdmin = profile?.role === 'admin';

    return (
      <Context.Provider value={{ user, profile, loading, profileLoading, isAdmin, signOut, supabase: client }}>
        {children}
      </Context.Provider>
    );
  };
};

export const UserProvider = createAuthProvider(UserContext, supabase);
export const AdminProvider = createAuthProvider(AdminContext, adminSupabase);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <AdminProvider>
      {children}
    </AdminProvider>
  </UserProvider>
);

export const useAuth = () => useContext(UserContext);

export const useAdminAuth = () => useContext(AdminContext);
