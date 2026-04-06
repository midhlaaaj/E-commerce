'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'details', label: 'PROFILE', href: '/profile' },
  { id: 'orders', label: 'ORDERS', href: '/profile/orders' },
  { id: 'addresses', label: 'ADDRESSES', href: '/profile/addresses' },
  { id: 'notifications', label: 'ALERTS', href: '/profile/notifications' },
];

export function ProfileNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="w-full border-b border-gray-100 mb-12 bg-white z-40">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
        <nav className="flex items-center gap-10 md:gap-16">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="relative py-6 group"
              >
                <span className={cn(
                  "text-[10px] font-black tracking-[0.2em] transition-all duration-300",
                  isActive ? "text-black" : "text-gray-400 group-hover:text-black"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 py-6 group disabled:opacity-50"
        >
          {isSigningOut ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : (
            <LogOut size={16} className="text-gray-400 group-hover:text-black transition-colors" />
          )}
          <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">
            {isSigningOut ? 'WAIT...' : 'LOG OUT'}
          </span>
        </button>
      </div>
    </div>
  );
}
