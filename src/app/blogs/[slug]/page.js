import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import WhatsAppButton from '@/components/WhatsAppButton';
import styles from './blog.module.css';

async function getBlog(slug) {
  try {
    const { data: blog } = await supabase
      .from('blogs')
      .select('*, category:categories(name)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    const { data: settings } = await supabase
      .from('site_settings')
      .select('whatsapp_number')
      .single();

    return { blog, settings };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return { blog: null, settings: null };
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { blog } = await getBlog(slug);
  
  if (!blog) {
    return { title: 'Blog Not Found' };
  }

  return {
    title: `${blog.title} - Namaz Blogs`,
    description: blog.excerpt || blog.content?.substring(0, 160),
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const { blog, settings } = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <Link href="/blogs" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Blogs
      </Link>

      <header className={styles.header}>
        {blog.category && (
          <span className={styles.category}>{blog.category.name}</span>
        )}
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Calendar size={14} />
            {formatDate(blog.created_at)}
          </span>
        </div>
      </header>

      {blog.image_url && (
        <div className={styles.imageWrapper}>
          <Image
            src={blog.image_url}
            alt={blog.title}
            fill
            priority
            className={styles.image}
          />
        </div>
      )}

      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <WhatsAppButton
        phoneNumber={settings?.whatsapp_number}
        pageTitle={blog.title}
        pageUrl={`/blogs/${slug}`}
      />
    </article>
  );
}
