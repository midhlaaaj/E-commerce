'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * useRealtime Hook
 * 
 * Provides real-time synchronization for database tables. 
 * Enables "Real Time Sync" and "Instance Persistence" by ensuring the UI 
 * reflects the latest shared state instantly.
 */
export const useRealtime = <T extends { [key: string]: any }>(
  table: string, 
  callback: (payload: RealtimePostgresChangesPayload<T>) => void,
  filter?: string
) => {
  useEffect(() => {
    // 1. Define the channel with a unique instance ID (Isolation)
    const channelName = `realtime_${table}_${filter || 'all'}`;
    
    // 2. Subscribe to INSERT, UPDATE, and DELETE events (Real Time Sync)
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          console.log(`[Realtime Sync] Update in ${table}:`, payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime Sync] Subscribed to ${table}`);
        }
      });

    // 3. Cleanup on unmount to prevent memory leaks (Instance Isolation)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, filter]);
};
