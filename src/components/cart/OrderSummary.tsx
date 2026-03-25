'use client';

import { useCartStore } from '@/store/use-cart-store';
import { ArrowRight, CreditCard, Landmark, Wallet } from 'lucide-react';

export const OrderSummary = () => {
  const { subtotal } = useCartStore();
  const currentSubtotal = subtotal();
  const shipping = currentSubtotal > 5000 ? 0 : 150;
  const tax = currentSubtotal * 0.12; // 12% GST
  const total = currentSubtotal + shipping + tax;

  return (
    <div className="bg-[#FDFDFD] p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <h2 className="text-[18px] font-black uppercase tracking-tight text-[#2D2D2D]">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
          <span>Subtotal</span>
          <span className="text-[#2D2D2D]">₹{currentSubtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
          <span>Shipping</span>
          <span className="text-green-600 font-black">
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
          <span>Tax (12%)</span>
          <span className="text-[#2D2D2D]">₹{tax.toLocaleString()}</span>
        </div>
        <div className="h-px bg-gray-100 my-4" />
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-black uppercase tracking-tight text-[#2D2D2D]">Total</span>
          <span className="text-[18px] font-black text-[#D97706]">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <button className="w-full bg-[#D97706] text-white py-5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-[#B45309] group shadow-lg shadow-orange-100/20 active:scale-95">
        <span>Proceed to Checkout</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="pt-4">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Promo Code</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="ENTER CODE" 
            className="flex-1 bg-white border border-gray-100 px-4 py-3 text-[10px] font-bold tracking-widest focus:outline-none focus:border-[#D97706] transition-colors"
          />
          <button className="bg-[#2D2D2D] text-white px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex justify-center gap-6 pt-6 text-gray-300">
        <CreditCard size={20} />
        <Wallet size={20} />
        <Landmark size={20} />
      </div>
    </div>
  );
};
