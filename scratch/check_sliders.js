const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSliders() {
  const { data, error } = await supabase
    .from('slider_images')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching sliders:', error);
    return;
  }

  console.log('--- Slider Images ---');
  data.forEach((img, i) => {
    console.log(`[${i}] Title: ${img.title}`);
    console.log(`    URL: ${img.image_url}`);
  });
}

checkSliders();
