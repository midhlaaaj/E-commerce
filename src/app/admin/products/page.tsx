import { createAdminClient } from '@/lib/supabaseServer';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = await createAdminClient();

  const [productsResponse, categoriesResponse, herosResponse] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase.from('homepage_content').select('section_key, image_url').in('section_key', ['men_hero', 'women_hero', 'kids_hero'])
  ]);

  const products = productsResponse.data || [];
  const categories = categoriesResponse.data || [];
  const heros = herosResponse.data || [];

  return <ProductsClient initialProducts={products} initialCategories={categories} initialHeros={heros} />;
}
