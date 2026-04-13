'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User as UserIcon, LogOut, LayoutDashboard, Menu, X, ChevronRight } from 'lucide-react';
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
            className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm animate-in fade-in duration-500"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full xs:w-[320px] bg-[#1A1614] z-[70] lg:hidden animate-in slide-in-from-left duration-500 shadow-2xl flex flex-col text-white">
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white flex items-center justify-center rounded-sm">
                  <span className="font-bold text-lg italic text-black">E</span>
                </div>
                <span className="font-heading font-black text-lg tracking-tight uppercase">ELITEWEAR</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X size={24} className="text-white/60" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
              {/* Main Collections */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Collections</p>
                {['MEN', 'WOMEN', 'KIDS'].map((item, index) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group block py-4 animate-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-light tracking-tighter uppercase group-hover:pl-4 transition-all duration-300">
                        {item}
                      </span>
                      <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/5 my-10" />

              {/* Account & Support */}
              <div className="space-y-8 animate-in fade-in duration-700 delay-300">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Service & Support</p>
                  <div className="grid gap-6">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                      <UserIcon size={18} strokeWidth={1.5} />
                      My Account
                    </Link>
                    <Link 
                      href="/wishlist" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                      <Heart size={18} strokeWidth={1.5} />
                      Wishlist
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 text-sm font-medium text-[#D97706] hover:text-[#FBBF24] transition-colors"
                      >
                        <LayoutDashboard size={18} strokeWidth={1.5} />
                        Admin Portal
                      </Link>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Connect</p>
                   <div className="flex gap-6">
                      {['Instagram', 'Twitter', 'Facebook'].map(social => (
                        <a key={social} href="#" className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">{social}</a>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 pt-0 border-t border-white/5 bg-[#1A1614]">
              {user ? (
                <button 
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-5 mt-8 bg-white/5 hover:bg-red-500/10 text-xs font-black text-red-400 uppercase tracking-[0.3em] transition-all rounded-sm border border-red-500/20"
                >
                  Terminate Session
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-white/5"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSignupModalOpen(true);
                    }}
                    className="py-4 border border-white/20 hover:border-white text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    Join
                  </button>
                </div>
              )}
              <p className="mt-8 text-center text-[8px] font-medium text-white/20 uppercase tracking-[0.5em]">Elite Wear &copy; 2024</p>
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
