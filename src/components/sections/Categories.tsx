import Link from 'next/link';

const categories = [
  {
    title: 'MEN',
    subtitle: 'Active Clothing',
    image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066&auto=format&fit=crop',
  },
  {
    title: 'WOMEN',
    subtitle: 'Chic Elegance',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'KIDS',
    subtitle: 'Playful Comfort',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1924&auto=format&fit=crop',
  },
];

export const Categories = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-heading font-bold tracking-tight">SHOP BY CATEGORY</h2>
        <Link href="/all" className="text-xs font-bold text-[#D97706] underline underline-offset-4 tracking-widest">
          VIEW ALL
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.title} className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-heading font-bold">{category.title}</h3>
              <p className="text-xs opacity-80">{category.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
