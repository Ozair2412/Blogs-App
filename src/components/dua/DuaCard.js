import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { truncateText } from '@/lib/utils';
import styles from './DuaCard.module.css';

export default function DuaCard({ dua }) {
  return (
    <Link href={`/duas/${dua.slug}`} className={styles.card}>
      <div className={styles.content}>
        {dua.category && (
          <span className="badge">{dua.category.name}</span>
        )}
        <h3 className={styles.title}>{dua.title}</h3>
        {dua.arabic_text && (
          <p className={styles.arabic}>{truncateText(dua.arabic_text, 80)}</p>
        )}
        {dua.translation && (
          <p className={styles.translation}>{truncateText(dua.translation, 100)}</p>
        )}
        <div className={styles.footer}>
          <BookOpen size={14} />
          <span>Read full dua</span>
        </div>
      </div>
    </Link>
  );
}
