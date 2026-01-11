import Link from 'next/link';
import styles from './ChapterCard.module.css';

export default function ChapterCard({ chapter, collectionSlug }) {
  return (
    <Link 
      href={`/hadith/${collectionSlug}/chapter/${chapter.chapterNumber}`} 
      className={styles.card}
    >
      <div className={styles.chapterNumber}>
        {chapter.chapterNumber}
      </div>
      
      <div className={styles.content}>
        {chapter.chapterArabic && (
          <h3 className={styles.arabicTitle}>{chapter.chapterArabic}</h3>
        )}
        <p className={styles.englishTitle}>{chapter.chapterEnglish}</p>
        
        {chapter.hadithRange && (
          <div className={styles.hadithRange}>
            <span>{chapter.hadithRange}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
