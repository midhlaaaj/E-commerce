import { Card, CardContent } from "@/components/ui/card";

const products = [
  { id: 1, name: 'SILK SOFT DOWN', type: 'Oversized Silk', price: '$444.60', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2072&auto=format&fit=crop' },
  { id: 2, name: 'ARTISAN CHICKEN DRESS', type: 'Antique Linen', price: '$624.50', image: 'https://images.unsplash.com/photo-1539109132314-d5109bbee96d?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, name: 'STRAIGHT BOOT BLACK', type: 'Handwoven Rayon', price: '$224.50', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop' },
  { id: 4, name: 'TRAINER CHECKED JACKET', type: 'Classic Tweed', price: '$334.50', image: 'https://images.unsplash.com/photo-1594932224010-75f2a77af94c?q=80&w=1964&auto=format&fit=crop' },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-heading font-bold tracking-tight mb-4 uppercase">FEATURED PRODUCTS</h2>
      <div className="w-16 h-1 bg-[#D97706] mx-auto mb-6" />
      <p className="text-sm text-gray-500 mb-16 max-w-2xl mx-auto">
        Selected high-end pieces representing the pinnacle of our seasonal curation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-6 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-xs font-bold tracking-wider mb-1 uppercase">{product.name}</h3>
            <p className="text-[10px] text-gray-500 mb-2 uppercase">{product.type}</p>
            <p className="text-sm font-bold text-[#D97706]">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
