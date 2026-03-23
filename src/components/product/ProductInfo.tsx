import { ShoppingCart, Truck, RotateCcw } from 'lucide-react';

export const ProductInfo = () => {
  return (
    <div className="flex flex-col pt-4">
      <div className="text-[10px] font-bold text-[#D97706] tracking-[0.2em] uppercase mb-3">
        APPAREL &gt; TOPS
      </div>
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 tracking-tight mb-4">
        Ethereal Cotton Blouse
      </h1>
      
      <div className="flex items-center gap-4 mb-6">
        <span className="text-2xl font-bold text-[#D97706]">$89.00</span>
        <span className="bg-orange-50 text-[#D97706] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm">
          IN STOCK
        </span>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed mb-10">
        An elevated and elegant blouse crafted from 100% organic cotton. Features a relaxed fit, subtle pleated details, and sustainable mother-of-pearl buttons. Perfect for effortless transition from desk to dinner.
      </p>

      {/* Select Size */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900">SELECT SIZE</span>
          <span className="text-[10px] font-bold text-[#D97706] tracking-widest uppercase cursor-pointer hover:underline border-b border-[#D97706]/30 pb-0.5">Size Guide</span>
        </div>
        <div className="flex gap-3">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <button 
              key={size}
              className={`w-12 h-12 rounded-full border text-[10px] font-bold flex items-center justify-center transition-all 
                ${size === 'S' 
                  ? 'bg-[#B45309] border-[#B45309] text-white shadow-md' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Area */}
      <div className="flex gap-4 mb-10">
        <div className="flex items-center border border-gray-200 rounded-full h-14 px-4 bg-white">
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">-</button>
          <span className="w-8 text-center font-bold text-sm">1</span>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">+</button>
        </div>
        <button className="flex-1 bg-[#B45309] text-white rounded-full h-14 flex items-center justify-center gap-3 hover:bg-[#92400E] transition-all duration-300 shadow-xl shadow-orange-900/10 hover:shadow-orange-900/20">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-xs font-bold tracking-widest uppercase">Add to Bag</span>
        </button>
      </div>

      {/* Shipping Info */}
      <div className="flex flex-col gap-4 pt-8 border-t border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-600">
           <Truck className="w-5 h-5 text-[#D97706]" />
           <span className="font-medium">Free shipping on $100+</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
           <RotateCcw className="w-5 h-5 text-[#D97706]" />
           <span className="font-medium">30 days easy returns</span>
        </div>
      </div>
    </div>
  );
};
