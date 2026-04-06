'use client';

import { useCartStore } from '@/store/use-cart-store';
import { ArrowRight, CreditCard, Landmark, Wallet } from 'lucide-react';

interface OrderSummaryProps {
  onCheckout: () => void;
}

export const OrderSummary = ({ onCheckout }: OrderSummaryProps) => {
  const { subtotal, totalMRP, totalSavings } = useCartStore();
  const currentSubtotal = subtotal();
  const mrp = totalMRP();
  const savings = totalSavings();
  const shipping = currentSubtotal > 999 ? 0 : 150;
  const total = currentSubtotal + shipping;

  return (
    <div className="bg-[#FDFDFD] border border-gray-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-700">
      {savings > 0 && (
        <div className="bg-green-50/80 px-8 py-4 border-b border-green-100 flex items-center justify-center gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
            <span className="text-white text-[10px] font-black italic">!</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-green-700">
            You are saving ₹{savings.toLocaleString()} on this order
          </span>
        </div>
      )}

      <div className="p-8 space-y-8">
        <h2 className="text-[16px] font-black uppercase tracking-tight text-[#2D2D2D]">
          Order Summary
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <span>Subtotal</span>
            <span className="text-[#2D2D2D]">₹{currentSubtotal.toLocaleString()}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[#D97706]">
              <span>Discount on MRP</span>
              <span className="font-black">- ₹{savings.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span>Shipping</span>
            <span className="text-green-600 font-black">
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>

          <div className="h-px bg-gray-100 my-4" />

          <div className="flex justify-between items-center">
            <span className="text-[14px] font-black uppercase tracking-tight text-[#2D2D2D]">Order Total</span>
            <span className="text-[20px] font-black text-[#D97706]">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={onCheckout}
          className="w-full bg-[#D97706] text-white py-5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-[#B45309] group shadow-lg shadow-orange-100/20 active:scale-95"
        >
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
    </div>
  );
};
