import { createAdminClient } from '@/lib/supabaseServer';
import ProductsClient from '../../ProductsClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ gender: string; category: string }>;
}

export default async function CategoryProductsPage({ params }: Props) {
  const { gender, category: categoryName } = await params;
  
  if (!['men', 'women', 'kids'].includes(gender)) {
    return notFound();
  }

  const supabase = await createAdminClient();

  // 1. Fetch the category record by name and gender
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .eq('gender', gender)
    .ilike('name', categoryName)
    .single();

  if (catError || !catData) {
    console.error('Category not found:', categoryName, gender);
    return notFound();
  }

  // 2. Fetch products for this category
  const [productsResponse, allCategoriesResponse, herosResponse] = await Promise.all([
    supabase.from('products').select('*').eq('category_id', catData.id).order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase.from('homepage_content').select('section_key, image_url').in('section_key', ['men_hero', 'women_hero', 'kids_hero'])
  ]);

  const products = productsResponse.data || [];
  const categories = allCategoriesResponse.data || [];
  const heros = herosResponse.data || [];

  return (
    <ProductsClient 
      initialProducts={products} 
      initialCategories={categories} 
      initialHeros={heros}
      forcedGender={gender as 'men' | 'women' | 'kids'}
      forcedCategoryId={catData.id}
    />
  );
}
