import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BlogCard from '@/components/blog/BlogCard';
import DuaCard from '@/components/dua/DuaCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import styles from './home.module.css';

export const revalidate = 0;

async function getHomeData() {
  try {
    // Fetch site settings
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    // Fetch recent blogs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('*, category:categories(name)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    // Fetch recent duas
    const { data: duas } = await supabase
      .from('duas')
      .select('*, category:categories(name)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    return {
      settings: settings || {},
      blogs: blogs || [],
      duas: duas || [],
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return { settings: {}, blogs: [], duas: [] };
  }
}

export default async function HomePage() {
  const { settings, blogs, duas } = await getHomeData();

  return (
    <>
      {settings.announcement_active && settings.announcement && (
        <div className={styles.announcementBanner}>
          {settings.announcement}
        </div>
      )}

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            {settings.site_title || 'Deen elevate'}
          </h1>
          <p className={styles.heroSubtitle}>
            Discover beautiful duas and insightful Islamic content to enrich your spiritual journey
          </p>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Blogs</h2>
            <Link href="/blogs" className={styles.seeAllLink}>
              See all <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.grid}>
            {blogs.length > 0 ? (
              blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
            ) : (
              <p className={styles.emptyState}>No blogs yet. Check back soon!</p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Duas Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Duas</h2>
            <Link href="/duas" className={styles.seeAllLink}>
              See all <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.grid}>
            {duas.length > 0 ? (
              duas.map((dua) => <DuaCard key={dua.id} dua={dua} />)
            ) : (
              <p className={styles.emptyState}>No duas yet. Check back soon!</p>
            )}
          </div>
        </div>
      </section>

      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        pageTitle="Home Page"
        pageUrl={typeof window !== 'undefined' ? window.location.href : '/'}
      />
    </>
  );
}