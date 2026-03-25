import { createAdminClient } from '@/lib/supabaseServer';
import AddProductClient from './AddProductClient';

export const dynamic = 'force-dynamic';

export default async function AddProductPage() {
  const supabase = await createAdminClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, gender');

  return <AddProductClient initialCategories={categories || []} />;
}
