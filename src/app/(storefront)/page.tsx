import { Hero } from '@/components/sections/Hero';
import { HomeSlider } from '@/components/sections/HomeSlider';
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
  const [heroResponse, genderCardsResponse, productsResponse, newArrivalsResponse, quoteResponse, saleResponse, sliderResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'main_hero').single(),
    supabase.from('homepage_content').select('*').in('section_key', ['gender_men', 'gender_women', 'gender_kids']),
    supabase.from('products').select('*').eq('is_featured', true).limit(5),
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('homepage_content').select('*').eq('section_key', 'editorial_quote').single(),
    supabase.from('products').select('*').not('offer_price', 'is', null).limit(5),
    supabase.from('slider_images').select('*').eq('is_active', true).order('order_index', { ascending: true })
  ]);

  const heroData = heroResponse.data;
  const genderCardsData = genderCardsResponse.data || [];
  const productsData = productsResponse.data || [];
  const newArrivalsData = newArrivalsResponse.data || [];
  const quoteData = quoteResponse.data || {};
  const saleData = saleResponse.data || [];
  const sliderData = sliderResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <Hero initialData={heroData} />
      <HomeSlider images={sliderData} />
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
