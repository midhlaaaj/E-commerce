import { createAdminClient } from '@/lib/supabaseServer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(`[${new Date().toISOString()}] ADMIN_LAYOUT: START createAdminClient`);
  const supabase = await createAdminClient();
  console.log(`[${new Date().toISOString()}] ADMIN_LAYOUT: START getUser`);
  const { data: { user } } = await supabase.auth.getUser();
  console.log(`[${new Date().toISOString()}] ADMIN_LAYOUT: END getUser -> ${user?.email || 'NULL'}`);

  // 1. INITIAL PASS-THROUGH
  // If no user, we let the children (likely /admin/login) handle the state
  // Middleware handles the redirects for all other /admin routes
  if (!user) {
    return <div className="min-h-screen bg-[#fcfcfc]">{children}</div>;
  }

  // 2. ROLE VERIFICATION
  console.log(`[${new Date().toISOString()}] ADMIN_LAYOUT: START profile fetch for ${user.id}`);
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  console.log(`[${new Date().toISOString()}] ADMIN_LAYOUT: END profile fetch -> ${profile?.role || 'NONE'}`);

  // 3. RESTRICTED ACCESS UI
  // If user is logged in but lacks admin clearance, show a premium restricted card
  if (!profile || profile.role !== 'admin') {
    return (
      <AuthLayoutWrapper
        title1="ACCESS"
        title2="RESTRICTED"
        subtitle="CLEARANCE FAILURE"
        imageUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
      >
        <div className="space-y-10 text-center">
           <div className="p-6 bg-red-500/5 border border-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
              Your identity does not possess administrative protocols for this sector.
           </div>

           <div className="flex flex-col gap-4">
              <Link 
                href="/"
                className="w-full py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 transition-all"
              >
                Return to Storefront
              </Link>
              
              <Link 
                href="/login"
                className="w-full py-5 border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all underline underline-offset-8 decoration-black/10"
              >
                Switch Identity
              </Link>
           </div>

           <p className="text-[8px] text-black/20 font-black uppercase tracking-[0.6em]">
             Unauthorized access is strictly logged
           </p>
        </div>
      </AuthLayoutWrapper>
    );
  }

  // 4. AUTHENTICATED ADMIN SHELL
  return (
    <div className="flex h-screen bg-[#fcfcfc] font-sans overflow-hidden">
      <AdminSidebar user={user} profile={profile} />
      
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-white shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.02)]">
        <div className="p-12 md:p-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
