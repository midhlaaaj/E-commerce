'use client';

import { useState, useTransition } from 'react';
import { Star, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitReview } from '@/lib/actions/reviews';

interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
}

export const ProductReviews = ({ productId, reviews }: ProductReviewsProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Calculate dynamic stats
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
    : "5.0"; // Default per user request

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : (stars === 5 ? 100 : 0);
    return { stars, percentage };
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await submitReview(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Thank you for your archival contribution. Your review is now live.' });
        setIsFormOpen(false);
        // Reset message after delay
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to submit' });
      }
    });
  };

  return (
    <section className="py-24 border-t border-gray-100 relative">
      {/* Feedback Message */}
      {message && (
        <div className={cn(
          "fixed bottom-8 right-8 px-6 py-4 shadow-2xl z-50 animate-in slide-in-from-right duration-500",
          message.type === 'success' ? "bg-black text-white" : "bg-red-500 text-white"
        )}>
          <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-baseline mb-16 gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-4xl tracking-tighter uppercase leading-none text-[#1A1614]">
            <span className="font-light">CUSTOMER</span> <span className="font-extrabold">REVIEWS</span>
          </h2>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em]">Community insights & Feedback</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[#1A1614] text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5"
        >
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Rating Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <div className="flex items-center gap-6 mb-10">
            <span className="text-7xl font-black tracking-tighter text-[#1A1614]">{averageRating}</span>
            <div className="flex flex-col">
              <div className="flex text-[#D97706] gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-4 h-4 fill-current",
                      i >= Math.floor(Number(averageRating)) && "opacity-30"
                    )} 
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {reviewCount > 0 ? `Based on ${reviewCount} reviews` : "Default Rating (No reviews yet)"}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {ratingDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-4 group">
                <span className="text-[10px] font-black w-2 text-[#1A1614]">{row.stars}</span>
                <Star className="w-3 h-3 text-gray-200 fill-current group-hover:text-[#D97706] transition-colors" />
                <div className="flex-1 h-1 bg-gray-50 overflow-hidden">
                  <div 
                    className="h-full bg-[#1A1614]" 
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-black w-8 text-right text-gray-400">{Math.round(row.percentage)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-8 space-y-16">
          {reviewCount > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-16">
                 <div className="flex items-start justify-between mb-8">
                   <div className="flex items-center gap-5">
                     <div className="w-12 h-12 bg-[#1A1614] text-white flex items-center justify-center font-black text-xs">
                       {review.user_name.slice(0, 2).toUpperCase()}
                     </div>
                     <div>
                       <h4 className="text-xs font-black uppercase tracking-widest text-[#1A1614]">{review.user_name}</h4>
                       <div className="flex items-center gap-2 text-[9px] text-[#D97706] uppercase tracking-widest font-black mt-1.5">
                         <CheckCircle2 size={10} /> Verified Archive Member
                       </div>
                     </div>
                   </div>
                   <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                     {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                   </span>
                 </div>
                 <div className="flex text-[#D97706] gap-0.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-3 h-3 fill-current",
                          i >= review.rating && "opacity-20"
                        )} 
                      />
                    ))}
                 </div>
                 <p className="text-[#1A1614] text-xs font-medium leading-loose max-w-2xl">
                   "{review.comment}"
                 </p>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-gray-200">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">No reviews yet. Be the first to share your thoughts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white max-w-lg w-full p-10 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-10">
              <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Submit <span className="font-light">Review</span></h3>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Contribute to the collective knowledge.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <input type="hidden" name="productId" value={productId} />
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Rating</label>
                <div className="flex gap-2 text-[#D97706]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      type="button"
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        size={24} 
                        className={cn("fill-current", rating < s && "fill-none")} 
                      />
                    </button>
                  ))}
                  <input type="hidden" name="rating" value={rating} />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="userName" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <input 
                  required
                  id="userName"
                  name="userName"
                  type="text" 
                  placeholder="e.g. Julianne L."
                  className="w-full bg-gray-50 border-none px-4 py-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="comment" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Feedback</label>
                <textarea 
                  required
                  id="comment"
                  name="comment"
                  rows={4} 
                  placeholder="Share your experience with this archival piece..."
                  className="w-full bg-gray-50 border-none px-4 py-4 text-xs font-bold outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1A1614] text-white h-16 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
              >
                {isPending ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
