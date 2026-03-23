import { Star, CheckCircle2 } from 'lucide-react';

export const ProductReviews = () => {
  return (
    <section className="border-t border-gray-200 pt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Customer Reviews</h2>
          <p className="text-gray-500 text-sm">What our community thinks about this piece.</p>
        </div>
        <button className="border border-[#D97706] text-[#D97706] px-8 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#D97706] hover:text-white transition-colors">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Rating Summary */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-6xl font-bold font-heading text-[#B45309]">4.8</span>
            <div className="flex flex-col">
              <div className="flex text-[#D97706] mb-1">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current fill-current/50" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Based on 124 reviews</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-8">
            {[ 
              { star: 5, pct: 85 },
              { star: 4, pct: 10 },
              { star: 3, pct: 3 },
              { star: 2, pct: 1 },
              { star: 1, pct: 1 },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <span className="w-2">{row.star}</span>
                <Star className="w-3 h-3 text-gray-400" />
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D97706] rounded-full" 
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-8 space-y-10">
          <div className="border-b border-gray-100 pb-10">
             <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#F5E6DA] text-[#92400E] rounded-full flex items-center justify-center font-bold text-sm">
                   SC
                 </div>
                 <div>
                   <h4 className="font-bold text-sm text-gray-900">Sarah C.</h4>
                   <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                     <CheckCircle2 className="w-3 h-3 text-green-600" /> Verified Purchaser
                   </div>
                 </div>
               </div>
               <span className="text-xs text-gray-400">2 days ago</span>
             </div>
             <div className="flex text-[#D97706] mb-3">
               {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
             </div>
             <p className="text-gray-600 text-sm leading-relaxed">
               Absolutely love the quality of the cotton. It's breathable and looks so sophisticated. I get compliments every time I wear it. Sizing is true to the guide.
             </p>
          </div>

          <div className="pb-10">
             <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#E8EAE6] text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
                   JL
                 </div>
                 <div>
                   <h4 className="font-bold text-sm text-gray-900">Julianne L.</h4>
                   <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                     <CheckCircle2 className="w-3 h-3 text-green-600" /> Verified Purchaser
                   </div>
                 </div>
               </div>
               <span className="text-xs text-gray-400">1 week ago</span>
             </div>
             <div className="flex text-[#D97706] mb-3">
               {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
             </div>
             <p className="text-gray-600 text-sm leading-relaxed">
               The detail on the pleats is beautiful. Highly recommend as an elegant top for both office and casual wear. Very happy with the purchase.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};
