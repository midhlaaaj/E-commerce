'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Bell, 
  LogOut,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const MENU_ITEMS = [
  { id: 'details', label: 'Profile Details', icon: User, href: '/profile' },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin, href: '/profile/addresses' },
  { id: 'orders', label: 'Order History', icon: ShoppingBag, href: '/profile/orders' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/profile/notifications' },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Perform a full sign out (client + server)
      await signOut();
      
      // Sign out will trigger a full page reload via the hook, 
      // ensuring no session state is leaked.
    } catch (error) {
      console.error('Logout error:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-0">
      <div className="space-y-1 flex-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-[#F3E8DF] text-[#8C5E45]" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon 
                size={18} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-[#8C5E45]" : "text-gray-400 group-hover:text-gray-600"
                )} 
              />
              <span className="text-xs font-semibold tracking-widest uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="mt-12 flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group disabled:opacity-50"
      >
        {isSigningOut ? (
          <Loader2 size={18} className="animate-spin text-red-400" />
        ) : (
          <LogOut size={18} className="text-red-400 group-hover:text-red-500" />
        )}
        <span className="text-xs font-semibold tracking-widest uppercase text-red-500">
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </span>
      </button>
    </div>
  );
}
