require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Read admin credentials from command line
// Usage: node update-admin-credentials.js [username] <password>
const NEW_USERNAME = process.argv[2] || 'admin';
const NEW_PASSWORD = process.argv[3];

if (!NEW_PASSWORD) {
  console.log('❌ Please provide a password');
  console.log('Usage: node update-admin-credentials.js [username] <password>');
  console.log('Example: node update-admin-credentials.js admin MyPassword123');
  process.exit(1);
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.log('❌ Missing credentials in .env.local');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updateAdminCredentials() {
  try {
    console.log('🔐 Updating admin credentials...');
    console.log(`   Username: ${NEW_USERNAME}`);
    console.log('');

    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);
    console.log('✅ Password hash generated');

    const { data: existingAdmin, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', NEW_USERNAME)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.log('❌ Error checking for existing admin:', fetchError.message);
      process.exit(1);
    }

    let result;
    if (existingAdmin) {
      console.log('👤 Admin user exists, updating password...');
      result = await supabase
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('username', NEW_USERNAME);
    } else {
      console.log('👤 Creating new admin user...');
      result = await supabase
        .from('admin_users')
        .insert({ username: NEW_USERNAME, password_hash: passwordHash });
    }

    if (result.error) {
      console.log('❌ Error updating admin credentials:', result.error.message);
      process.exit(1);
    }

    console.log('');
    console.log('✅ SUCCESS! Admin credentials updated.');
    console.log('');
    console.log('📝 Login credentials:');
    console.log(`   Username: ${NEW_USERNAME}`);
    console.log('   Password: (the password you provided)');
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

updateAdminCredentials();
