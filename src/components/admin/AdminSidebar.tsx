'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminSupabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Package,
  Layers,
  Home,
  LogOut,
  ChevronRight,
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
    if (pathname.includes('/admin/categories')) setExpandedSections(prev => ({ ...prev, Categories: true }));
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
      subItems: ['MEN', 'WOMEN', 'KIDS']
    },
    { 
      icon: Layers, 
      label: 'Categories', 
      href: '/admin/categories',
      hasDropdown: true,
      subItems: ['MEN', 'WOMEN', 'KIDS']
    },
    { icon: Home, label: 'Homepage Content', href: '/admin/homepage' },
  ];

  const handleSignOut = async () => {
    await adminSupabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-black text-white flex flex-col border-r border-white/5 shadow-2xl z-20">
      <div className="p-8 pb-4">
        <Link href="/admin">
          <h1 className="text-xl font-heading font-black tracking-tighter italic">
            ELITE<span className="text-[#D97706]">WEAR</span> <span className="text-[10px] bg-[#D97706]/20 text-[#D97706] px-2 py-0.5 rounded font-bold ml-2">ADMIN</span>
          </h1>
        </Link>
      </div>

      <div className="px-6 py-4 mb-4">
         <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate leading-tight uppercase tracking-wider">{profile?.full_name || 'Administrator'}</p>
              <p className="text-[9px] text-gray-500 truncate mt-0.5">{user?.email}</p>
            </div>
         </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const isExpanded = expandedSections[item.label];
          
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex gap-1">
                <Link
                  href={item.href}
                  className={`flex-1 flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-[#D97706] text-white shadow-lg shadow-[#D97706]/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className={`${isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="text-xs font-bold tracking-widest uppercase">{item.label}</span>
                </Link>
                
                {item.hasDropdown && (
                  <button 
                    onClick={() => toggleSection(item.label)}
                    className={`px-3 rounded-xl transition-colors ${
                      isExpanded ? 'bg-white/10 text-white' : 'text-gray-600 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              
              {item.hasDropdown && isExpanded && (
                <div className="ml-12 space-y-1 border-l border-white/5 pl-4 animate-in slide-in-from-top-2 duration-300">
                  {item.subItems.map((sub) => {
                    const subHref = `/admin/${item.label.toLowerCase()}/${sub.toLowerCase()}`;
                    const isSubActive = pathname === subHref;
                    return (
                      <Link 
                        key={sub} 
                        href={subHref}
                        className={`block text-[10px] font-bold tracking-[0.2em] py-2 transition-colors ${
                          isSubActive ? 'text-[#D97706]' : 'text-gray-500 hover:text-white'
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
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
           onClick={handleSignOut}
           className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold tracking-widest uppercase">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
