'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Package,
  Home,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Images,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: any;
  profile: any;
}

export default function AdminSidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname.includes('/admin/products')) {
      setExpandedSections(prev => ({ ...prev, Products: true }));
    }
  }, [pathname]);

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { 
      icon: Package, 
      label: 'Products', 
      href: '/admin/products',
      hasDropdown: true,
      subItems: ['Men', 'Women', 'Kids']
    },
    { icon: Home, label: 'Homepage Content', href: '/admin/homepage' },
    { icon: Images, label: 'Sliders', href: '/admin/sliders' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  ];

  const { signOut } = useAdminAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <aside className="w-64 bg-white flex flex-col border-r border-gray-200 z-20 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-lg group-hover:bg-black transition-colors shadow-sm">
            <span className="font-bold text-sm leading-none">E</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">Admin<span className="text-gray-400 font-normal">Panel</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const isExpanded = expandedSections[item.label];
          
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex">
                <Link
                  href={item.href}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive 
                      ? "bg-gray-100 text-gray-900" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon size={18} className={isActive ? "text-gray-900" : "text-gray-400"} />
                  {item.label}
                </Link>
                
                {item.hasDropdown && (
                  <button 
                    onClick={() => toggleSection(item.label)}
                    className="p-2 ml-1 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    <ChevronDown size={16} className={cn("transition-transform duration-200", isExpanded && "rotate-180")} />
                  </button>
                )}
              </div>
              
              {item.hasDropdown && isExpanded && (
                <div className="pl-10 space-y-1 py-1">
                  {item.subItems.map((sub) => {
                    const baseLabel = item.label === 'Products' ? 'products' : item.label.toLowerCase();
                    const subHref = `/admin/${baseLabel}/${sub.toLowerCase()}`;
                    const isSubActive = pathname === subHref;
                    return (
                      <Link 
                        key={sub} 
                        href={subHref}
                        className={cn(
                          "block py-1.5 px-3 rounded-md text-sm transition-colors",
                          isSubActive 
                            ? "text-gray-900 font-medium bg-gray-50" 
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                        )}
                      >
                        {sub}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile & Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded-xl">
           <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm flex-shrink-0">
             <UserIcon size={14} />
           </div>
           <div className="overflow-hidden">
             <p className="text-sm font-medium text-gray-900 truncate">
               {profile?.full_name || 'Admin User'}
             </p>
             <p className="text-xs text-gray-500 truncate mt-0.5">
               {user?.email}
             </p>
           </div>
        </div>

        <button
           onClick={handleSignOut}
           disabled={isSigningOut}
           className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <LogOut size={18} />
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
