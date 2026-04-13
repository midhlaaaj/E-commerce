'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/use-cart-store';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { ShoppingBag, ChevronLeft, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { useAuth } from '@/hooks/useAuth';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RecentlyVisited } from '@/components/sections/RecentlyVisited';
import { WishlistSection } from '@/components/sections/WishlistSection';
import { ShippingAddress } from '@/components/cart/ShippingAddress';
import { Skeleton } from '@/components/profile/ProfileSkeleton';

export default function CartPage() {
  const { user, supabase } = useAuth();
  const { items, totalItems, clearCart, subtotal, selectedAddressId } = useCartStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fix hydration issues with zustand persist
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to complete your purchase');
      return;
    }

    if (!selectedAddressId) {
      alert('Please select a shipping address');
      const addressSection = document.getElementById('shipping-address-section');
      if (addressSection) {
        addressSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    console.log('[DEBUG CHECKOUT] Starting...', { userId: user.id, selectedAddressId });
    setIsCheckingOut(true);
    try {
      const currentSubtotal = subtotal();
      const shipping = currentSubtotal > 999 ? 0 : 150;
      const totalAmount = currentSubtotal + shipping;

      console.log('[DEBUG CHECKOUT] Inserting order...', { totalAmount });
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address_id: selectedAddressId,
          status: 'confirmed',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (orderError) {
        console.error('[DEBUG CHECKOUT] Order Insert Error:', orderError);
        throw orderError;
      }

      console.log('[DEBUG CHECKOUT] Order created successfully:', order.id);

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color || null,
        product_name: item.name,
        product_image: item.image
      }));

      console.log('[DEBUG CHECKOUT] Inserting order items...', orderItems);
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('[DEBUG CHECKOUT] Items Insert Error:', itemsError);
        throw itemsError;
      }

      console.log('[DEBUG CHECKOUT] Checkout complete!');

      // 3. Success!
      setIsOrdered(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('[DEBUG CHECKOUT] Final Error:', error);
      alert(
        `CHECKOUT FAILED!\n\n` +
        `Error: ${error.message}\n` +
        `Code: ${error.code || 'Unknown'}\n` +
        `Details: ${error.details || 'None'}\n\n` +
        `Please ensure you have run the SQL setup and your tables exist.`
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  // If order is successful, show the confirmation screen
  if (isOrdered) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <Navbar />
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-1000">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-10 shadow-xl shadow-green-100/50">
            <CheckCircle2 className="text-green-500" size={40} />
          </div>
          
          <div className="mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-600 mb-4 block">THANK YOU FOR YOUR PURCHASE</span>
            <SectionHeader title1="ORDER" title2="CONFIRMED" />
          </div>

          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-12 max-w-sm leading-relaxed mx-auto">
            Your order has been placed successfully. A confirmation email will be sent shortly with your tracking details.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="/" 
              className="bg-[#2D2D2D] text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5 flex items-center justify-center gap-3 group"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/profile/orders" 
              className="bg-white border border-gray-100 text-black px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:border-black transition-all active:scale-95 flex items-center justify-center"
            >
              View My Orders
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Handle empty bag or initial loading state
  if (isLoaded && items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mb-8">
            <ShoppingBag className="text-gray-300" size={32} />
          </div>
          <SectionHeader title1="YOUR BAG" title2="IS EMPTY" />
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 max-w-xs leading-relaxed">
            Looks like you haven't added anything to your bag yet.
          </p>
          <Link
            href="/"
            className="bg-[#2D2D2D] text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5"
          >
            Start Shopping
          </Link>
        </div>
        <WishlistSection />
        <RecentlyVisited hideWhenEmpty />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-10 md:pb-14">
        <Link
          href="/"
          className="group flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all mb-6"
        >
          <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          <span>CONTINUE SHOPPING</span>
        </Link>
        <div className="mb-12">
          {!isLoaded ? (
            <Skeleton className="h-20 w-1/2" />
          ) : (
            <SectionHeader title1="SHOPPING" title2="BAG" subtitle={`YOU HAVE ${totalItems()} ITEMS IN YOUR SELECTION`} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Items */}
          <div className="lg:col-span-8">
            {!isLoaded ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
              </div>
            ) : (
              <div className="space-y-2 border-t border-gray-100">
                {items.map((item) => (
                  <CartItem key={`${item.id}-${item.size}`} item={item} />
                ))}
              </div>
            )}

            <div id="shipping-address-section" className="mt-16 border-t border-gray-100 pt-16">
              {!isLoaded ? <Skeleton className="h-64 w-full" /> : <ShippingAddress />}
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            {!isLoaded ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <div className="relative">
                {isCheckingOut && (
                  <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <Loader2 className="animate-spin text-[#D97706]" size={32} />
                  </div>
                )}
                <OrderSummary onCheckout={handleCheckout} />
              </div>
            )}
          </div>
        </div>
      </div>

      <WishlistSection />
      <RecentlyVisited hideWhenEmpty />
      <Footer />
    </main>
  );
}
