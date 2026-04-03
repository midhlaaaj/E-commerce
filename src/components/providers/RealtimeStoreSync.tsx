'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/use-cart-store';
import { useWishlistStore } from '@/store/use-wishlist-store';

/**
 * RealtimeStoreSync Provider
 * 
 * Implements "Real Time Sync" and "Session Persistence" across multiple tabs.
 * Listens for local storage changes from other instances of the same session 
 * and hydrates the current state instantly.
 */
export const RealtimeStoreSync = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // 1. Cross-tab synchronization logic
    const handleStorageChange = (e: StorageEvent) => {
      // 2. Identify the storage keys for isolation (Instance Isolation)
      if (e.key === 'elitewear-cart-storage') {
        console.log('[Realtime Store Sync] Cart update from another instance.');
        useCartStore.persist.rehydrate(); // Persistence Update
      }
      
      if (e.key === 'elitewear-wishlist-storage') {
        console.log('[Realtime Store Sync] Wishlist update from another instance.');
        useWishlistStore.persist.rehydrate(); // Persistence Update
      }
    };

    // 3. Register global sync listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <>{children}</>;
};
