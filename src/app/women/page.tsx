import { Footer } from '@/components/layout/Footer';
import { WomenHero } from '@/components/sections/WomenHero';
import { WomenCategories } from '@/components/sections/WomenCategories';
import { WomenProducts } from '@/components/sections/WomenProducts';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { OnSaleProducts } from '@/components/sections/OnSaleProducts';
import { createClient } from '@/lib/supabaseServer';

export default async function WomenPage() {
  const supabase = await createClient();

  // Parallel fetch for Women's content
  const [heroResponse, categoriesResponse, newArrivalsResponse, saleResponse, selectionResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'women_hero').single(),
    supabase.from('categories').select('*').eq('gender', 'women').order('created_at', { ascending: false }),
    supabase.from('products').select('*').eq('gender', 'women').order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('gender', 'women').not('offer_price', 'is', null).limit(4),
    supabase.from('products').select('*').eq('gender', 'women').limit(8)
  ]);

  const heroData = heroResponse.data;
  const categoriesData = categoriesResponse.data || [];
  const newArrivalsData = newArrivalsResponse.data || [];
  const saleData = saleResponse.data || [];
  const selectionData = selectionResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <WomenHero initialData={heroData} />
      <WomenCategories initialData={categoriesData} />
      <NewArrivals initialData={newArrivalsData} gender="women" />
      <OnSaleProducts initialData={saleData} gender="women" />
      <WomenProducts initialData={selectionData} />
      <Footer />
    </main>
  );
}
