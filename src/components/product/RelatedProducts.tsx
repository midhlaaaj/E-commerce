import Link from 'next/link';
import Image from 'next/image';

export const RelatedProducts = ({ products = [] }: { products?: any[] }) => {
  if (!products.length) return null;

  return (
    <section className="py-24">
      <h2 className="text-2xl font-black tracking-tighter uppercase mb-12 text-[#1C1C1C]">You May Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer block">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#F8F9FA] mb-4 relative transition-all duration-700">
              <Image 
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop'} 
                alt={product.name}
                fill
                className="object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <div className="px-1 text-center sm:text-left">
              <h3 className="text-[10px] font-black tracking-[0.1em] mb-1 uppercase text-[#2D2D2D] line-clamp-1">{product.name}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                 <p className={`text-[11px] font-bold ${product.offer_price ? 'text-gray-400 line-through' : 'text-[#2D2D2D]'}`}>
                   ₹{Number(product.price).toFixed(2)}
                 </p>
                 {product.offer_price ? (
                   <p className="text-[11px] font-bold text-[#D97706]">₹{Number(product.offer_price).toFixed(2)}</p>
                 ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
