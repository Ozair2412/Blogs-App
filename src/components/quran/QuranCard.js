import Link from 'next/link';
import { BookOpen, FileText } from 'lucide-react';
import styles from './QuranCard.module.css';

export default function QuranCard({ type = 'surah', data }) {
  const isSurah = type === 'surah';
  const url = isSurah ? `/quran/surah/${data.number}` : `/quran/juz/${data.number}`;
  
  return (
    <Link href={url} className={styles.card}>
      <div className={styles.numberBadge}>
        {isSurah ? <BookOpen size={18} /> : <FileText size={18} />}
        <span>{data.number}</span>
      </div>
      
      <div className={styles.content}>
        {isSurah ? (
          <>
            <h3 className={styles.arabicName}>{data.name}</h3>
            <p className={styles.englishName}>{data.englishName}</p>
            <p className={styles.translation}>{data.englishNameTranslation}</p>
            <div className={styles.meta}>
              <span className={styles.revelation}>{data.revelationType}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.ayahs}>{data.numberOfAyahs} Ayahs</span>
            </div>
          </>
        ) : (
          <>
            <h3 className={styles.juzTitle}>Juz {data.number}</h3>
            <p className={styles.juzRange}>
              {data.startInfo && `${data.startInfo} - ${data.endInfo}`}
            </p>
          </>
        )}
      </div>
    </Link>
  );
}
