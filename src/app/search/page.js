import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BlogCard from '@/components/blog/BlogCard';
import DuaCard from '@/components/dua/DuaCard';
import styles from './search.module.css';

async function searchContent(query) {
  if (!query) return { blogs: [], duas: [] };

  try {
    // 1. Find matching categories first
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${query}%`);
    
    const categoryIds = categories?.map(c => c.id) || [];
    const categoryFilter = categoryIds.length > 0 ? `,category_id.in.(${categoryIds.join(',')})` : '';

    // 2. Search Blogs: Match Title OR Excerpt OR Category
    const { data: blogs } = await supabase
      .from('blogs')
      .select('*, category:categories(name)')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%${categoryFilter}`)
      .limit(20);

    // 3. Search Duas: Match Title OR Translations OR Category
    const { data: duas } = await supabase
      .from('duas')
      .select('*, category:categories(name)')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,translation.ilike.%${query}%,transliteration.ilike.%${query}%${categoryFilter}`)
      .limit(20);

    return { blogs: blogs || [], duas: duas || [] };
  } catch (error) {
    console.error('Search error:', error);
    return { blogs: [], duas: [] };
  }
}

export const metadata = {
  title: 'Search - Dua & Blogs',
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.q || '';
  const { blogs, duas } = await searchContent(query);
  const totalResults = blogs.length + duas.length;

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>
            Search results for <span className={styles.searchQuery}>&quot;{query}&quot;</span>
          </h1>
          <p className={styles.resultsInfo}>
            Found {totalResults} result{totalResults !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container">
        {totalResults === 0 ? (
          <div className={styles.emptyState}>
            <Search size={48} className={styles.emptyIcon} />
            <h3>No results found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <>
            {blogs.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Blogs ({blogs.length})</h2>
                <div className={styles.grid}>
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </section>
            )}

            {duas.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Duas ({duas.length})</h2>
                <div className={styles.grid}>
                  {duas.map((dua) => (
                    <DuaCard key={dua.id} dua={dua} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
