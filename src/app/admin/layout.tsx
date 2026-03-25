import { createAdminClient } from '@/lib/supabaseServer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If no user, we are likely on the login page or middleware is about to redirect
  // We just render children and let the page handle its own state
  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Fetch profile to verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If user is logged in but not an admin, show restricted access
  // (Middleware should ideally handle this role check too, but this is a fail-safe)
  if (!profile || profile.role !== 'admin') {
     return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center font-sans">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-100/50">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-heading font-black tracking-tighter italic mb-4">ACCESS RESTRICTED</h1>
          <p className="text-gray-500 text-sm max-w-sm mb-10 font-medium leading-relaxed uppercase tracking-widest">
             Your current session does not have administrative clearance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
               href="/"
               className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D97706] transition-all"
            >
              Back to Store
            </Link>
          </div>
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AdminSidebar user={user} profile={profile} />
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
