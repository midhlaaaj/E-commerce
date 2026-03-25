'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User as UserIcon, LogOut, LayoutDashboard, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/use-cart-store';
import { useWishlistStore } from '@/store/use-wishlist-store';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { user, profile, loading, isAdmin, signOut } = useAuth();

  const cartCount = useCartStore((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = cn(
    "fixed top-0 z-50 w-full px-6 py-4 flex items-center justify-between transition-all duration-500",
    isScrolled 
      ? "bg-white border-b border-gray-100 py-3 shadow-sm" 
      : "bg-transparent border-b border-transparent py-5"
  );

  const textClasses = isScrolled ? "text-black" : "text-white";
  const mutedTextClasses = isScrolled ? "text-gray-400" : "text-white/60";

  return (
    <nav className={navClasses}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        <div className={cn(
          "w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-500",
          isScrolled ? "bg-black" : "bg-white"
        )}>
          <span className={cn(
            "font-bold text-xl italic transition-colors",
            isScrolled ? "text-white" : "text-black"
          )}>E</span>
        </div>
        <span className={cn(
          "font-heading font-bold text-xl tracking-tighter transition-colors uppercase",
          isScrolled ? "text-black group-hover:text-gray-600" : "text-white group-hover:text-white/80"
        )}>ELITEWEAR</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden lg:flex items-center gap-8 ml-10">
        {['MEN', 'WOMEN', 'KIDS', 'NEW ARRIVALS'].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase().replace(' ', '-')}`}
            className={cn(
              "text-[10px] font-bold tracking-[0.2em] transition-colors",
              isScrolled ? "text-gray-400 hover:text-black" : "text-white/70 hover:text-white"
            )}
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Search and Icons */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        <div className="hidden md:relative md:block w-full max-w-[200px] lg:max-w-[300px]">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", isScrolled ? "text-gray-400" : "text-white/50")} />
          <Input
            placeholder="Search collection..."
            className={cn(
              "pl-10 h-10 border-none rounded-full text-xs transition-all",
              isScrolled ? "bg-gray-50 text-black" : "bg-white/10 text-white placeholder:text-white/40 focus:bg-white/20"
            )}
          />
        </div>
        
        <div className={cn("flex items-center gap-4 border-l pl-6 transition-colors", isScrolled ? "border-gray-100" : "border-white/10")}>
          {loading ? (
             <Loader2 className="animate-spin text-gray-300" size={18} />
          ) : user ? (
            <div className="flex items-center gap-4">
               {isAdmin && (
                  <Link 
                    href="/admin" 
                    className={cn(
                      "flex items-center gap-2 text-[10px] font-bold tracking-widest transition-colors uppercase",
                      isScrolled ? "text-[#D97706] hover:text-black" : "text-white hover:text-white/80"
                    )}
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
               )}
               <div className="flex items-center gap-2 group cursor-pointer">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                    isScrolled ? "bg-gray-100 text-black" : "bg-white/10 text-white"
                  )}>
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <button onClick={signOut} className={cn("transition-colors", isScrolled ? "text-gray-400 hover:text-red-600" : "text-white/60 hover:text-red-400")}>
                    <LogOut size={18} />
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className={cn("text-[10px] font-bold tracking-widest uppercase transition-colors", isScrolled ? "hover:text-[#D97706]" : "text-white hover:text-white/80")}>Login</Link>
              <Link href="/signup" className={cn(
                "px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all",
                isScrolled ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-100"
              )}>Join</Link>
            </div>
          )}

          <div className={cn("w-[1px] h-4 hidden sm:block transition-colors", isScrolled ? "bg-gray-100" : "bg-white/10")} />
          
          <Link href="/wishlist" className="relative cursor-pointer group">
            <Heart className={cn(
              "w-5 h-5 transition-colors",
              mounted && useWishlistStore.getState().items.length > 0 
                ? "text-red-500 fill-red-500" 
                : isScrolled ? "text-gray-400 hover:text-black" : "text-white/60 hover:text-white"
            )} />
            {mounted && useWishlistStore.getState().items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center p-0.5 rounded-full border-2 border-white tabular-nums">
                {useWishlistStore.getState().items.length}
              </Badge>
            )}
          </Link>
          <Link href="/cart" className="relative cursor-pointer group">
            <ShoppingBag className={cn(
              "w-5 h-5 transition-colors",
              isScrolled ? "text-gray-400 group-hover:text-black" : "text-white/60 group-hover:text-white"
            )} />
            {mounted && cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-[#D97706] text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center p-0.5 rounded-full border-2 border-white tabular-nums">
                {cartCount}
              </Badge>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};
