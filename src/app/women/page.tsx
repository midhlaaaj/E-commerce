import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WomenHero } from '@/components/sections/WomenHero';
import { WomenCategories } from '@/components/sections/WomenCategories';
import { WomenProducts } from '@/components/sections/WomenProducts';
import { Newsletter } from '@/components/sections/Newsletter';
import { createClient } from '@/lib/supabaseServer';

export default async function WomenPage() {
  const supabase = await createClient();

  // Parallel fetch for Women's content
  const [heroResponse, categoriesResponse, productsResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'women_hero').single(),
    supabase.from('categories').select('*').eq('gender', 'women').order('created_at', { ascending: false }),
    supabase.from('products').select('*').eq('gender', 'women').limit(6)
  ]);

  const heroData = heroResponse.data;
  const categoriesData = categoriesResponse.data || [];
  const productsData = productsResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <WomenHero initialData={heroData} />
      <WomenCategories initialData={categoriesData} />
      <WomenProducts initialData={productsData} />
      <Newsletter />
      <Footer />
    </main>
  );
}
