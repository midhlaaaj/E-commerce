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
} from 'lucide-react';

interface SidebarProps {
  user: any;
  profile: any;
}

export default function AdminSidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Auto-expand sections based on path
    if (pathname.includes('/admin/products')) setExpandedSections(prev => ({ ...prev, Products: true }));
  }, [pathname]);

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', href: '/admin' },
    { 
      icon: Package, 
      label: 'COLLECTION', 
      href: '/admin/products',
      hasDropdown: true,
      subItems: ['MEN', 'WOMEN', 'KIDS']
    },
    { icon: Home, label: 'EDITORIAL', href: '/admin/homepage' },
  ];

  const { signOut } = useAdminAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <aside className="w-72 bg-[#fcfcfc] text-black flex flex-col border-r border-gray-100 z-20">
      {/* Branded Header */}
      <div className="p-10 pb-12 border-b border-gray-50 flex flex-col gap-8">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-6 h-6 flex items-center justify-center bg-black transition-all group-hover:opacity-80">
            <span className="font-bold text-sm italic text-white leading-none">E</span>
          </div>
          <h1 className="text-sm font-black tracking-[0.4em] uppercase">
             MANAGEMENT
          </h1>
        </Link>

        {/* Admin Identifier */}
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xs">
              {profile?.full_name?.charAt(0) || 'A'}
           </div>
           <div className="overflow-hidden text-left">
             <p className="text-[10px] font-black tracking-[0.2em] uppercase leading-tight truncate">
               {profile?.full_name || 'Administrator'}
             </p>
             <p className="text-[8px] text-black/40 font-bold uppercase tracking-widest mt-1">
               Level: Superuser
             </p>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="mb-8">
           <p className="text-[8px] font-black text-black/20 tracking-[0.5em] uppercase mb-10 ml-4">Portal Navigation</p>
           
           <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const isExpanded = expandedSections[item.label];
              
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex group">
                    <Link
                      href={item.href}
                      className={`flex-1 flex items-center gap-5 px-4 py-4 transition-all duration-500 border-l-[3px] ${
                        isActive
                          ? 'border-black bg-white shadow-sm'
                          : 'border-transparent text-black/40 hover:text-black'
                      }`}
                    >
                      <item.icon size={14} className={isActive ? 'text-black' : 'text-black/30 group-hover:text-black'} />
                      <span className="text-[9px] font-black tracking-[0.4em] uppercase">{item.label}</span>
                    </Link>
                    
                    {item.hasDropdown && (
                      <button 
                        onClick={() => toggleSection(item.label)}
                        className={`px-4 bg-transparent transition-colors ${
                          isExpanded ? 'text-black' : 'text-black/20 hover:text-black'
                        }`}
                      >
                        <ChevronDown size={12} className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  
                  {item.hasDropdown && isExpanded && (
                    <div className="ml-[45px] space-y-3 py-4 animate-in fade-in slide-in-from-left-2 duration-700 fill-mode-both">
                      {item.subItems.map((sub) => {
                        const baseLabel = item.label === 'COLLECTION' ? 'products' : item.label.toLowerCase();
                        const subHref = `/admin/${baseLabel}/${sub.toLowerCase()}`;
                        const isSubActive = pathname === subHref;
                        return (
                          <Link 
                            key={sub} 
                            href={subHref}
                            className={`block text-[8px] font-black tracking-[0.3em] uppercase py-1 border-b border-transparent hover:border-black/10 w-fit transition-all ${
                              isSubActive ? 'text-black border-black/20' : 'text-black/30 hover:text-black'
                            }`}
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
           </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-8 border-t border-gray-50 bg-white/50 space-y-6">
        <Link 
           href="/"
           className="w-full flex items-center gap-5 px-4 py-4 text-black/40 hover:text-black transition-all group"
        >
          <Home size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[9px] font-black tracking-[0.4em] uppercase">Return to Store</span>
        </Link>

        <button
           onClick={handleSignOut}
           disabled={isSigningOut}
           className="w-full flex items-center gap-5 px-4 py-4 text-black/40 hover:text-red-600 transition-all group disabled:opacity-50"
        >
          <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[9px] font-black tracking-[0.4em] uppercase text-left">
            {isSigningOut ? 'Terminating...' : 'Terminate Session'}
          </span>
        </button>
      </div>
    </aside>
  );
}
