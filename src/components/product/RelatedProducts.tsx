import { ProductCard } from '@/components/product/ProductCard';

export const RelatedProducts = ({ products = [] }: { products?: any[] }) => {
  if (!products.length) return null;

  return (
    <section className="py-24 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-baseline gap-4 mb-16">
        <h2 className="text-3xl sm:text-4xl tracking-tighter uppercase leading-none text-[#1A1614]">
          <span className="font-light">YOU MAY</span> <span className="font-extrabold">ALSO LIKE</span>
        </h2>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em]">Curated Recommendations</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
