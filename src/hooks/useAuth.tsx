'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, adminSupabase } from '@/lib/supabase';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { signOutAction } from '@/app/auth/actions';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

const AdminContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

const createAuthProvider = (Context: React.Context<AuthContextType>, client: SupabaseClient) => {
  return ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (uid: string) => {
      try {
        const { data } = await client
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single();
        if (data) setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      client.auth.getSession()
        .then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          if (session?.user) fetchProfile(session.user.id);
          else setLoading(false);
        })
        .catch((err) => {
          console.error('Session fetching error:', err);
          setLoading(false);
        });

      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await fetchProfile(session.user.id);
        else {
          setProfile(null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
      try {
        // Clear local state immediately for optimistic UI
        setUser(null);
        setProfile(null);
        
        // Parallel sign out for speed: server and client
        // The server action will specifically clear the httpOnly cookies
        await Promise.all([
          client.auth.signOut(),
          signOutAction()
        ]);
        
        // Force reload to completely clean up any memory/context state
        window.location.href = '/';
      } catch (err) {
        console.error('Sign out error:', err);
        // Fallback reload if something goes wrong
        window.location.href = '/';
      }
    };

    const isAdmin = profile?.role === 'admin';

    return (
      <Context.Provider value={{ user, profile, loading, isAdmin, signOut }}>
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
