import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';
import { createClient } from '@/lib/supabaseServer';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string },
  searchParams: { gender?: string }
}) {
  const supabase = await createClient();
  const categoryName = params.slug.replace(/-/g, ' ').toUpperCase();
  const gender = searchParams.gender || 'men';

  // Fetch category data to get correct ID and then fetch products
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', categoryName)
    .single();

  let products = [];
  if (categoryData) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryData.id)
      .eq('gender', gender);
    products = data || [];
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader 
            title1={categoryName.split(' ')[0]} 
            title2={categoryName.split(' ').slice(1).join(' ') || 'COLLECTION'} 
            subtitle={`${gender.toUpperCase()}'S EXCLUSIVE SELECTION`}
            className="mb-0"
          />
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {products.length} ITEMS FOUND
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <ShoppingBag size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold uppercase tracking-tighter">No products found</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                We couldn't find any products in the {categoryName} category for {gender}. 
                Try exploring our other curated collections.
              </p>
            </div>
            <Link 
              href={`/${gender}`}
              className="inline-block px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gray-800 transition-colors"
            >
              Back to {gender}'s
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
