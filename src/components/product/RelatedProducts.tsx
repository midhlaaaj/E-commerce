export const RelatedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Tailored Linen Trousers',
      price: '$124.00',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop',
      color: 'bg-[#FDF2D9]'
    },
    {
      id: 2,
      name: 'Silk Midi Skirt',
      price: '$105.00',
      image: 'https://images.unsplash.com/photo-1583391733958-650fac5dac3c?q=80&w=1974&auto=format&fit=crop',
      color: 'bg-[#F2F4F7]'
    },
    {
      id: 3,
      name: 'Organic Knit Cardigan',
      price: '$110.00',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop',
      color: 'bg-[#FDF2D9]'
    },
    {
      id: 4,
      name: 'Minimal Leather Tote',
      price: '$275.00',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop',
      color: 'bg-[#EAEAEA]'
    }
  ];

  return (
    <section className="pt-20">
      <h2 className="text-2xl font-heading font-bold tracking-tight mb-10">You May Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className={`aspect-[4/5] rounded-3xl overflow-hidden ${product.color} mb-4 relative`}>
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110 opacity-90"
              />
            </div>
            <h3 className="text-xs font-bold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-sm font-bold text-[#D97706]">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
