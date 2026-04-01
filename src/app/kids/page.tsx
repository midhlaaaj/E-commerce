import { Footer } from '@/components/layout/Footer';
import { KidsHero } from '@/components/sections/KidsHero';
import { KidsCategories } from '@/components/sections/KidsCategories';
import { KidsProducts } from '@/components/sections/KidsProducts';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { OnSaleProducts } from '@/components/sections/OnSaleProducts';
import { createClient } from '@/lib/supabaseServer';

export default async function KidsPage() {
  const supabase = await createClient();

  // Parallel fetch for Kids' content
  const [heroResponse, categoriesResponse, newArrivalsResponse, saleResponse, selectionResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'kids_hero').single(),
    supabase.from('categories').select('*').eq('gender', 'kids').order('created_at', { ascending: false }),
    supabase.from('products').select('*').eq('gender', 'kids').order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('gender', 'kids').not('offer_price', 'is', null).limit(4),
    supabase.from('products').select('*').eq('gender', 'kids').limit(8)
  ]);

  const heroData = heroResponse.data;
  const categoriesData = categoriesResponse.data || [];
  const newArrivalsData = newArrivalsResponse.data || [];
  const saleData = saleResponse.data || [];
  const selectionData = selectionResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <KidsHero initialData={heroData} />
      <KidsCategories initialData={categoriesData} />
      <NewArrivals initialData={newArrivalsData} gender="kids" />
      <OnSaleProducts initialData={saleData} gender="kids" />
      <KidsProducts initialData={selectionData} />
      <Footer />
    </main>
  );
}
