'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, adminSupabase } from '@/lib/supabase';
import { User, SupabaseClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  profileLoading: boolean;
  isAdmin: boolean;
  supabase: SupabaseClient; // Added this
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

    const fetchProfile = async (uid: string) => {
      setProfileLoading(true);
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
        setProfileLoading(false);
      }
    };

    useEffect(() => {
      // 1. Initial Session Check (Fastest)
      client.auth.getSession()
        .then(({ data: { session } }) => {
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
          console.error('Session fetching error:', err);
          setLoading(false);
          setProfileLoading(false);
        });

      // 2. Auth State Change listener
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
          setProfileLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
      // Optimistic instant checkout
      setUser(null);
      setProfile(null);
      setProfileLoading(false);
      setLoading(false);
      window.dispatchEvent(new CustomEvent('auth:signout'));

      client.auth.signOut().catch((err) => {
        console.error('Sign out error:', err);
      });
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

export const useAuth = () => {
  const userAuth = useContext(UserContext);
  const adminAuth = useContext(AdminContext);
  
  if (!userAuth.user && adminAuth.user) {
    return adminAuth;
  }
  
  return userAuth;
};

export const useAdminAuth = () => useContext(AdminContext);
