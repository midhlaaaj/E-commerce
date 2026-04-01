import { Footer } from '@/components/layout/Footer';
import { MenHero } from '@/components/sections/MenHero';
import { MenCategories } from '@/components/sections/MenCategories';
import { MenProducts } from '@/components/sections/MenProducts';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { OnSaleProducts } from '@/components/sections/OnSaleProducts';
import { createClient } from '@/lib/supabaseServer';

export default async function MenPage() {
  const supabase = await createClient();

  // Parallel fetch for Men's content
  const [heroResponse, categoriesResponse, newArrivalsResponse, saleResponse, selectionResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'men_hero').single(),
    supabase.from('categories').select('*').eq('gender', 'men').order('created_at', { ascending: false }),
    supabase.from('products').select('*').eq('gender', 'men').order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('gender', 'men').not('offer_price', 'is', null).limit(4),
    supabase.from('products').select('*').eq('gender', 'men').limit(8)
  ]);

  const heroData = heroResponse.data;
  const categoriesData = categoriesResponse.data || [];
  const newArrivalsData = newArrivalsResponse.data || [];
  const saleData = saleResponse.data || [];
  const selectionData = selectionResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <MenHero initialData={heroData} />
      <MenCategories initialData={categoriesData} />
      <NewArrivals initialData={newArrivalsData} gender="men" />
      <OnSaleProducts initialData={saleData} gender="men" />
      <MenProducts initialData={selectionData} />
      <Footer />
    </main>
  );
}
