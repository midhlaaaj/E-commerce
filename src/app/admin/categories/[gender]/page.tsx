import { createAdminClient } from '@/lib/supabaseServer';
import CategoriesClient from '../CategoriesClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ gender: string }>;
}

export default async function GenderCategoriesPage({ params }: Props) {
  const { gender } = await params;
  
  if (!['men', 'women', 'kids'].includes(gender)) {
    return notFound();
  }

  const supabase = await createAdminClient();

  // Parallel fetch for Categories and Hero images
  const [categoriesResponse, herosResponse] = await Promise.all([
    supabase.from('categories').select('*').eq('gender', gender).order('created_at', { ascending: false }),
    supabase.from('homepage_content')
      .select('section_key, image_url')
      .in('section_key', ['men_hero', 'women_hero', 'kids_hero'])
  ]);

  const categories = categoriesResponse.data || [];
  const heros = herosResponse.data || [];

  return (
    <CategoriesClient 
      initialCategories={categories} 
      initialHeros={heros} 
      forcedGender={gender as 'men' | 'women' | 'kids'} 
    />
  );
}
