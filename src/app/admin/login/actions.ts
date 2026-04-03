'use server';

import { createClient } from '@/lib/supabaseServer';

export async function adminLogin(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to Admin Dashboard (Layout will verify role)
  return { success: true };
}
