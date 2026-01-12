require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except space and hyphen)
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens
}

async function fixTable(tableName) {
  console.log(`Checking ${tableName}...`);
  const { data: items, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    return;
  }

  for (const item of items) {
    // Generate a clean slug from title
    let newSlug = generateSlug(item.title);
    
    // Fallback if slug becomes empty (e.g. only special chars title)
    if (!newSlug) {
      newSlug = `item-${item.id.substring(0, 8)}`;
    }

    // Check if the current slug is "broken" (has spaces or special chars)
    // or if we just want to enforce the clean format.
    // We'll enforce the clean format.
    const isClean = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug);
    
    if (item.slug !== newSlug) {
      console.log(`Fixing ${item.title}:`);
      console.log(`   Old: "${item.slug}"`);
      console.log(`   New: "${newSlug}"`);

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ slug: newSlug })
        .eq('id', item.id);

      if (updateError) {
        // Handle unique constraint violation (append random)
        if (updateError.code === '23505') {
            const uniqueSlug = `${newSlug}-${Math.floor(Math.random() * 1000)}`;
            console.log(`   Duplicate! Trying: "${uniqueSlug}"`);
            await supabase.from(tableName).update({ slug: uniqueSlug }).eq('id', item.id);
        } else {
            console.error(`   Failed: ${updateError.message}`);
        }
      } else {
        console.log('   ✅ Fixed');
      }
    }
  }
}

async function run() {
  console.log('Starting Slug Fixer...');
  await fixTable('duas');
  await fixTable('blogs');
  console.log('Done.');
}

run();
