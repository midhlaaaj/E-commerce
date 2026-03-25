import { createAdminClient } from '@/lib/supabaseServer';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = await createAdminClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return <ProductsClient initialProducts={products || []} />;
}
