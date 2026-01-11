import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import WhatsAppButton from '@/components/WhatsAppButton';
import styles from './dua.module.css';

async function getDua(slug) {
  try {
    const { data: dua } = await supabase
      .from('duas')
      .select('*, category:categories(name)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    const { data: settings } = await supabase
      .from('site_settings')
      .select('whatsapp_number')
      .single();

    return { dua, settings };
  } catch (error) {
    console.error('Error fetching dua:', error);
    return { dua: null, settings: null };
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { dua } = await getDua(slug);
  
  if (!dua) {
    return { title: 'Dua Not Found' };
  }

  return {
    title: `${dua.title} - Dua & Blogs`,
    description: dua.translation?.substring(0, 160),
  };
}

export default async function DuaPage({ params }) {
  const { slug } = await params;
  const { dua, settings } = await getDua(slug);

  if (!dua) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <Link href="/duas" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Duas
      </Link>

      <header className={styles.header}>
        {dua.category && (
          <span className={styles.category}>{dua.category.name}</span>
        )}
        <h1 className={styles.title}>{dua.title}</h1>
      </header>

      {dua.image_url && (
        <div className={styles.imageWrapper}>
          <Image
            src={dua.image_url}
            alt={dua.title}
            fill
            priority
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.duaContent}>
        {dua.arabic_text && (
          <div className={styles.arabicSection}>
            <p className={styles.sectionLabel}>Arabic</p>
            <p className={styles.arabicText}>{dua.arabic_text}</p>
          </div>
        )}

        {dua.transliteration && (
          <div className={styles.transliterationSection}>
            <p className={styles.sectionLabel}>Transliteration</p>
            <p className={styles.transliteration}>{dua.transliteration}</p>
          </div>
        )}

        {dua.translation && (
          <div className={styles.translationSection}>
            <p className={styles.sectionLabel}>Translation</p>
            <p className={styles.translation}>{dua.translation}</p>
          </div>
        )}

        {dua.reference && (
          <div className={styles.referenceSection}>
            <BookOpen size={16} />
            <p className={styles.reference}><strong>Reference:</strong> {dua.reference}</p>
          </div>
        )}
      </div>

      <WhatsAppButton
        phoneNumber={settings?.whatsapp_number}
        pageTitle={dua.title}
        pageUrl={`/duas/${slug}`}
      />
    </article>
  );
}
