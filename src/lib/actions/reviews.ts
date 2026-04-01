'use server';

import { createClient } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function getReviews(productId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  
  const productId = formData.get('productId') as string;
  const userName = formData.get('userName') as string;
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;

  if (!productId || !userName || !rating || !comment) {
    return { error: 'All fields are required' };
  }

  const { error } = await supabase
    .from('reviews')
    .insert([
      {
        product_id: productId,
        user_name: userName,
        rating,
        comment,
      },
    ]);

  if (error) {
    console.error('Error submitting review:', error);
    return { error: 'Failed to submit review' };
  }

  revalidatePath(`/product/${productId}`);
  return { success: true };
}
