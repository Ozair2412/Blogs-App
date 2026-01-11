require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.log('❌ Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkLogin() {
  console.log('Testing login for user: admin');
  
  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', 'admin')
    .single();

  if (error || !admin) {
    console.log('❌ User "admin" not found in database!');
    if (error) console.log('Error:', error.message);
    return;
  }

  const password = 'AdminPass@100';
  const valid = await bcrypt.compare(password, admin.password_hash);

  if (valid) {
    console.log(`✅ Success! database password matches "${password}".`);
  } else {
    console.log(`❌ Failed. Database password does NOT match "${password}".`);
    console.log('Hash in DB:', admin.password_hash);
  }
}

checkLogin();
