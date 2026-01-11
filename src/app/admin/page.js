import Link from 'next/link';
import { FileText, BookOpen, FolderOpen, Plus, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './dashboard.module.css';

async function getStats() {
  try {
    const [blogsRes, duasRes, categoriesRes] = await Promise.all([
      supabase.from('blogs').select('id', { count: 'exact' }),
      supabase.from('duas').select('id', { count: 'exact' }),
      supabase.from('categories').select('id', { count: 'exact' }),
    ]);

    return {
      blogs: blogsRes.count || 0,
      duas: duasRes.count || 0,
      categories: categoriesRes.count || 0,
    };
  } catch (error) {
    return { blogs: 0, duas: 0, categories: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome to your admin panel</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconBlogs}`}>
            <FileText size={24} />
          </div>
          <div className={styles.statValue}>{stats.blogs}</div>
          <div className={styles.statLabel}>Total Blogs</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconDuas}`}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statValue}>{stats.duas}</div>
          <div className={styles.statLabel}>Total Duas</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconCategories}`}>
            <FolderOpen size={24} />
          </div>
          <div className={styles.statValue}>{stats.categories}</div>
          <div className={styles.statLabel}>Categories</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconViews}`}>
            <Eye size={24} />
          </div>
          <div className={styles.statValue}>-</div>
          <div className={styles.statLabel}>Site Views</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Quick Actions</h2>
      <div className={styles.quickActions}>
        <Link href="/admin/blogs/new" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Plus size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Create Blog</h3>
            <p>Write a new blog post</p>
          </div>
        </Link>

        <Link href="/admin/duas/new" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Plus size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Add Dua</h3>
            <p>Add a new dua</p>
          </div>
        </Link>

        <Link href="/" target="_blank" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Eye size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>View Website</h3>
            <p>See your public site</p>
          </div>
        </Link>

        <Link href="/admin/settings" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <FolderOpen size={24} />
          </div>
          <div className={styles.actionContent}>
            <h3>Site Settings</h3>
            <p>Configure your site</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
