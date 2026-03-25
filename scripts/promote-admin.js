import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires Service Role Key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- 🛡️ ELITEWEAR ADMIN PROMOTER ---');

rl.question('Enter the EMAIL of the user you want to make an ADMIN: ', async (email) => {
  try {
    // 1. Get user ID from Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;

    const user = users.find(u => u.email === email);

    if (!user) {
      console.log(`❌ User with email "${email}" not found. Please sign up first at http://localhost:3000/signup`);
      process.exit(1);
    }

    // 2. Update Role in Profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (profileError) throw profileError;

    console.log(`✅ Success! User "${email}" is now an ADMIN.`);
    console.log('You can now log in at http://localhost:3000/admin/login');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    rl.close();
  }
});
