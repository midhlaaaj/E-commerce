import { createAdminClient } from '@/lib/supabaseServer';
import SliderManagementClient from './SliderManagementClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SlidersPage() {
  const supabase = await createAdminClient();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/admin');
  }

  const { data: sliders, error } = await supabase
    .from('slider_images')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sliders:', error);
  }

  return (
    <div className="w-full">
      <SliderManagementClient 
        key={sliders?.length.toString() + (sliders?.[0]?.id || 'empty')} 
        initialData={sliders || []} 
      />
    </div>
  );
}
