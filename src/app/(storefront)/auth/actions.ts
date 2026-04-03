'use server';

import { createClient } from '@/lib/supabaseServer';
import { cookies } from 'next/headers';

export async function signOutAction() {
  const supabase = await createClient();
  
  // Sign out from Supabase (this will trigger cookie removal via the client's cookie handler)
  await supabase.auth.signOut();
  
  // Optional: Force delete the cookie to be absolutely sure
  const cookieStore = await cookies();
  cookieStore.set('sb-elitewear-auth', '', { maxAge: 0, path: '/' });
  
  return { success: true };
}
