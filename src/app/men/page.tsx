import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MenHero } from '@/components/sections/MenHero';
import { MenCategories } from '@/components/sections/MenCategories';
import { MenProducts } from '@/components/sections/MenProducts';
import { Newsletter } from '@/components/sections/Newsletter';
import { createClient } from '@/lib/supabaseServer';

export default async function MenPage() {
  const supabase = await createClient();

  // Parallel fetch for Men's content
  const [heroResponse, categoriesResponse, productsResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'men_hero').single(),
    supabase.from('categories').select('*').eq('gender', 'men').order('created_at', { ascending: false }),
    supabase.from('products').select('*').eq('gender', 'men').limit(6)
  ]);

  const heroData = heroResponse.data;
  const categoriesData = categoriesResponse.data || [];
  const productsData = productsResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <MenHero initialData={heroData} />
      <MenCategories initialData={categoriesData} />
      <MenProducts initialData={productsData} />
      <Newsletter />
      <Footer />
    </main>
  );
}
