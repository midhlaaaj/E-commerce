import { createAdminClient } from '@/lib/supabaseServer';
import HomepageManagementClient from './HomepageManagementClient';

export const dynamic = 'force-dynamic';

export default async function HomepageManagementPage() {
  const supabase = await createAdminClient();
  
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .order('section_key');

  if (error) {
    console.error('Error fetching homepage content:', error);
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-bold uppercase tracking-widest text-xs">Error Loading Configuration</p>
        <p className="text-red-400 text-[10px] mt-2 leading-relaxed">Please ensure the database tables are correctly configured.</p>
      </div>
    );
  }

  return <HomepageManagementClient initialData={data || []} />;
}
