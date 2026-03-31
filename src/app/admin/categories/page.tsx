import { createAdminClient } from '@/lib/supabaseServer';
import CategoriesClient from './CategoriesClient';

export default async function CategoriesPage() {
  const supabase = await createAdminClient();

  const [categoriesResponse, herosResponse] = await Promise.all([
    supabase.from('categories').select('*').order('created_at', { ascending: false }),
    supabase.from('homepage_content').select('section_key, image_url').in('section_key', ['men_hero', 'women_hero', 'kids_hero'])
  ]);

  const categories = categoriesResponse.data || [];
  const heros = herosResponse.data || [];

  return <CategoriesClient initialCategories={categories} initialHeros={heros} />;
}
