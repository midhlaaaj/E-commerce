import { Hero } from '@/components/sections/Hero';
import { Categories } from '@/components/sections/Categories';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { OnSaleProducts } from '@/components/sections/OnSaleProducts';
import { RecentlyVisited } from '@/components/sections/RecentlyVisited';
import { Sustainability } from '@/components/sections/Sustainability';
import { Newsletter } from '@/components/sections/Newsletter';
import { Footer } from '@/components/layout/Footer';
import { EditorialQuote } from '@/components/sections/EditorialQuote';
import { createClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  
  // Parallel fetch for speed
  const [heroResponse, genderCardsResponse, productsResponse, newArrivalsResponse, quoteResponse, saleResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'main_hero').single(),
    supabase.from('homepage_content').select('*').in('section_key', ['gender_men', 'gender_women', 'gender_kids']),
    supabase.from('products').select('*').eq('is_featured', true).limit(4),
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('homepage_content').select('*').eq('section_key', 'editorial_quote').single(),
    supabase.from('products').select('*').not('offer_price', 'is', null).limit(4)
  ]);

  const heroData = heroResponse.data;
  const genderCardsData = genderCardsResponse.data || [];
  const productsData = productsResponse.data || [];
  const newArrivalsData = newArrivalsResponse.data || [];
  const quoteData = quoteResponse.data || {};
  const saleData = saleResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <Hero initialData={heroData} />
      <Categories initialData={genderCardsData} />
      <NewArrivals initialData={newArrivalsData} />
      <EditorialQuote data={quoteData} />
      <FeaturedProducts initialData={productsData} />
      <OnSaleProducts initialData={saleData} />
      <RecentlyVisited />
      <Sustainability />
      <Newsletter />
      <Footer />
    </main>
  );
}
