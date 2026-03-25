import { createAdminClient } from '@/lib/supabaseServer';
import EditProductClient from './EditProductClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createAdminClient();

  // Parallel fetch product and categories
  const [productResponse, categoriesResponse] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name, gender')
  ]);

  if (productResponse.error || !productResponse.data) {
    notFound();
  }

  return (
    <EditProductClient 
      initialProduct={productResponse.data} 
      initialCategories={categoriesResponse.data || []} 
    />
  );
}
