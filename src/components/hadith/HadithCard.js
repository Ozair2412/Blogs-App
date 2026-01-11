import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import styles from './HadithCard.module.css';

export default function HadithCard({ collection }) {
  return (
    <Link href={`/hadith/${collection.slug}`} className={styles.card}>
      <div className={styles.numberBadge}>
        <BookOpen size={18} />
        <span>{collection.totalHadith}</span>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.arabicTitle}>{collection.arabicName}</h3>
        <p className={styles.englishTitle}>{collection.name}</p>
        <p className={styles.description}>{collection.description}</p>
        
        <div className={styles.meta}>
          <span className={styles.author}>{collection.author}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.compiled}>{collection.compiled}</span>
        </div>
      </div>
    </Link>
  );
}
