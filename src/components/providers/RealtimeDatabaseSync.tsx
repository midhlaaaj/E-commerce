'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, adminSupabase } from '@/lib/supabase';

/**
 * RealtimeDatabaseSync Component
 * 
 * Listens for PostgreSQL changes via Supabase Realtime and invalidates 
 * corresponding React Query caches to ensure the UI stays in sync 
 * across all users and tabs without page refreshes.
 */
export const RealtimeDatabaseSync = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Tables we want to monitor for real-time synchronization
    const tablesToSync = [
      'orders',
      'products',
      'categories',
      'homepage_content',
      'slider_images',
      'profiles'
    ];

    const channels: any[] = [];

    // Setup listeners for both standard and admin clients 
    // (Admin client might be on a different session/role)
    const clients = [supabase, adminSupabase];

    clients.forEach((client, clientIdx) => {
      tablesToSync.forEach((table) => {
        const channel = client
          .channel(`global_sync_${table}_${clientIdx}`)
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to INSERT, UPDATE, and DELETE
              schema: 'public',
              table: table,
            },
            (payload) => {
              console.log(`[Realtime Sync] Change detected in ${table}:`, payload);
              
              // Invalidate the cache for this table
              // Components should use query keys matching the table names
              queryClient.invalidateQueries({ queryKey: [table] });

              // If it's a specific item, we could also invalidate specific IDs 
              // but for now, table-level invalidation is safer and simpler.
            }
          )
          .subscribe();
        
        channels.push(channel);
      });
    });

    return () => {
      channels.forEach(channel => {
        const client = channel.supabase; // Internal reference
        if (client) {
          client.removeChannel(channel);
        }
      });
    };
  }, [queryClient]);

  return <>{children}</>;
};
