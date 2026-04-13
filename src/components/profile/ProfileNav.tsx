'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'details', label: 'PROFILE', href: '/profile' },
  { id: 'orders', label: 'ORDERS', href: '/profile/orders' },
  { id: 'addresses', label: 'ADDRESSES', href: '/profile/addresses' },
  { id: 'notifications', label: 'ALERTS', href: '/profile/notifications' },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-gray-100 mb-12 bg-white z-40">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between overflow-x-hidden">
        <nav className="flex items-center gap-6 md:gap-16">
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
      </div>
    </div>
  );
}
