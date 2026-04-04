'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User as UserIcon, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/use-cart-store';
import { useWishlistStore } from '@/store/use-wishlist-store';
import { cn } from '@/lib/utils';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';

interface NavbarProps {
  transparent?: boolean;
}

export const Navbar = ({ transparent = false }: NavbarProps) => {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();

  const cartCount = useCartStore((state) => state.totalItems());
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminPath, setIsAdminPath] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAdminPath(pathname?.startsWith('/admin'));
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Listen for sign-out events to refresh server components
    const handleSignout = () => router.refresh();
    window.addEventListener('auth:signout', handleSignout);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth:signout', handleSignout);
    };
  }, [router]);

  const isHeroPage = ['/', '/men', '/women', '/kids'].includes(pathname);
  const showSolid = !transparent || isScrolled || !isHeroPage;

  const navClasses = cn(
    "fixed top-0 z-50 w-full flex flex-col transition-all duration-500"
  );

  const textClasses = showSolid ? "text-black" : "text-white";
  const mutedTextClasses = showSolid ? "text-gray-400" : "text-white/60";

  if (isAdminPath) return null;

  return (
    <nav className={navClasses}>
      {/* Main Nav Row */}
      <div className={cn(
        "w-full px-4 md:px-8 flex items-center justify-between transition-all duration-500",
        showSolid 
          ? "bg-white border-b border-gray-100 shadow-sm py-3" 
          : "bg-transparent border-b border-transparent py-5"
      )}>
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile) */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn("lg:hidden p-1 transition-colors", textClasses)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className={cn(
              "w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-500",
              showSolid ? "bg-black" : "bg-white"
            )}>
              <span className={cn(
                "font-bold text-xl italic transition-colors",
                showSolid ? "text-white" : "text-black"
              )}>E</span>
            </div>
            <span className={cn(
              "hidden md:block font-heading font-bold text-xl tracking-tighter transition-colors uppercase",
              showSolid ? "text-black group-hover:text-gray-600" : "text-white group-hover:text-white/80"
            )}>ELITEWEAR</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 ml-10">
            {['MEN', 'WOMEN', 'KIDS'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className={cn(
                  "text-[10px] font-bold tracking-[0.2em] transition-colors",
                  showSolid ? "text-gray-400 hover:text-black" : "text-white/70 hover:text-white"
                )}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Icons Section */}
        <div className="flex items-center gap-4 md:gap-7">
          {/* Desktop Search */}
          <div className="hidden lg:relative lg:block w-full max-w-[200px] xl:max-w-[300px]">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", showSolid ? "text-gray-400" : "text-white/50")} />
            <Input
              placeholder="Search products..."
              className={cn(
                "pl-10 h-10 border-none rounded-full text-xs transition-all cursor-pointer",
                showSolid ? "bg-gray-50 text-black" : "bg-white/10 text-white placeholder:text-white/40 focus:bg-white/20"
              )}
              onClick={() => router.push('/search')}
              readOnly
            />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Button (Mobile) */}
            <button 
              onClick={() => router.push('/search')}
              className={cn("lg:hidden transition-colors", textClasses)}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <Link href="/wishlist" className="relative cursor-pointer group">
              <Heart className={cn(
                "w-5.5 h-5.5 md:w-5 md:h-5 transition-colors",
                mounted && useWishlistStore.getState().items.length > 0 
                  ? "text-red-500 fill-red-500" 
                  : showSolid ? "text-gray-400 hover:text-black" : "text-white/60 hover:text-white"
              )} strokeWidth={1.5} />
              {mounted && useWishlistStore.getState().items.length > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] min-w-[14px] h-3.5 flex items-center justify-center p-0 rounded-full border border-white">
                  {useWishlistStore.getState().items.length}
                </Badge>
              )}
            </Link>

            <Link href="/cart" className="relative cursor-pointer group">
              <ShoppingBag className={cn(
                "w-5.5 h-5.5 md:w-5 md:h-5 transition-colors",
                showSolid ? "text-gray-400 group-hover:text-black" : "text-white/60 group-hover:text-white"
              )} strokeWidth={1.5} />
              {mounted && cartCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 bg-[#D97706] text-white text-[9px] min-w-[14px] h-3.5 flex items-center justify-center p-0 rounded-full border border-white">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-6">
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className={cn(
                        "transition-colors",
                        showSolid ? "text-gray-400 hover:text-[#D97706]" : "text-white/70 hover:text-white"
                      )}
                    >
                      <LayoutDashboard size={20} />
                    </Link>
                  )}
                  <Link 
                    href="/profile" 
                    className={cn(
                      "transition-colors",
                      showSolid ? "text-gray-400 hover:text-black" : "text-white/70 hover:text-white"
                    )}
                  >
                    <UserIcon size={20} />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className={cn("text-[10px] font-bold tracking-widest uppercase transition-colors outline-none", showSolid ? "hover:text-[#D97706]" : "text-white hover:text-white/80")}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setIsSignupModalOpen(true)}
                    className={cn(
                      "px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all outline-none",
                      showSolid ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-100"
                    )}
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Mobile Sidebar Menu (Overlay) */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white z-[70] lg:hidden animate-in slide-in-from-left duration-300 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="font-heading font-bold text-lg tracking-tight uppercase">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6">
              <div className="px-6 space-y-6">
                {['MEN', 'WOMEN', 'KIDS'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-bold tracking-[0.1em] text-gray-900"
                  >
                    {item}
                  </Link>
                ))}
                
                <div className="h-px bg-gray-100 my-8" />
                
                <div className="space-y-6">
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium text-gray-600"
                  >
                    <UserIcon size={18} />
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-sm font-medium text-gray-600"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              {user ? (
                <button 
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-4 text-sm font-bold text-red-500 uppercase tracking-widest border border-red-100 rounded-sm"
                >
                  Log Out
                </button>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full py-4 text-sm font-bold bg-black text-white uppercase tracking-widest rounded-sm"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSignupModalOpen(true);
                    }}
                    className="w-full py-4 text-sm font-bold border border-black text-black uppercase tracking-widest rounded-sm"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}


      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </nav>
  );
};
