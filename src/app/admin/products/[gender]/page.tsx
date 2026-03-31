import { createAdminClient } from '@/lib/supabaseServer';
import ProductsClient from '../ProductsClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ gender: string }>;
}

export default async function GenderProductsPage({ params }: Props) {
  const { gender } = await params;
  
  if (!['men', 'women', 'kids'].includes(gender)) {
    return notFound();
  }

  const supabase = await createAdminClient();

  // Parallel fetch for Products, Categories, and Hero images
  const [productsResponse, categoriesResponse, herosResponse] = await Promise.all([
    supabase.from('products').select('*').eq('gender', gender).order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase.from('homepage_content').select('section_key, image_url').in('section_key', ['men_hero', 'women_hero', 'kids_hero'])
  ]);

  const products = productsResponse.data || [];
  const categories = categoriesResponse.data || [];
  const heros = herosResponse.data || [];

  return (
    <ProductsClient 
      initialProducts={products} 
      initialCategories={categories} 
      initialHeros={heros}
      forcedGender={gender as 'men' | 'women' | 'kids'} 
    />
  );
}
