import styles from './HadithView.module.css';

export default function HadithView({ hadith, collectionName }) {
  return (
    <div className={styles.hadithCard}>
      <div className={styles.hadithNumber}>
        <span>{collectionName?.toUpperCase()}</span>
        <span className={styles.number}>#{hadith.hadithNumber}</span>
      </div>

      <div className={styles.hadithContent}>
        {hadith.hadithArabic && (
          <div className={styles.arabicText}>
            {hadith.hadithArabic}
          </div>
        )}

        {hadith.hadithEnglish && (
          <div className={styles.englishText}>
            {hadith.hadithEnglish}
          </div>
        )}

        {hadith.hadithUrdu && (
          <div className={styles.urduText}>
            {hadith.hadithUrdu}
          </div>
        )}

        <div className={styles.meta}>
          {hadith.englishNarrator && (
            <div className={styles.narrator}>
              <strong>Narrated by:</strong> {hadith.englishNarrator}
            </div>
          )}
          
          <div className={styles.details}>
            {hadith.chapterEnglish && <span className={styles.book}>{hadith.chapterEnglish}</span>}
            {hadith.status && (
              <>
                <span className={styles.separator}>•</span>
                <span className={`${styles.grade} ${styles[hadith.status.toLowerCase()]}`}>
                  {hadith.status}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
