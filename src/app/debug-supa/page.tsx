'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugSupa() {
  const [status, setStatus] = useState<any>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    async function check() {
      try {
        setUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING URL');
        
        // Check Auth User
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          setStatus({ type: 'AUTH_ERROR', message: userError.message, details: userError });
          return;
        }

        // Check Profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        const { data: products, error: dbError } = await supabase.from('products').select('*').limit(1);
        
        setStatus({
          user: user?.email,
          userId: user?.id,
          profile: profile,
          profileError: profileError,
          dbAccess: dbError ? 'FAILED' : 'SUCCESS',
          dbError: dbError
        });
      } catch (err: any) {
        setStatus({ type: 'FATAL_ERROR', message: err.message, stack: err.stack });
      }
    }
    check();
  }, []);

  return (
    <div className="p-10 font-mono text-xs space-y-4">
      <h1 className="text-xl font-bold">Supabase Diagnostic</h1>
      <div>
        <strong>URL:</strong> {url}
      </div>
      <div className="p-4 bg-gray-100 rounded border">
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}
