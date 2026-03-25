import { createAdminClient } from '@/lib/supabaseServer';
import CategoriesClient from './CategoriesClient';

export default async function CategoriesPage() {
  const supabase = await createAdminClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  return <CategoriesClient initialCategories={categories || []} />;
}
