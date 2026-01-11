import styles from './AyahCard.module.css';

// Helper function to parse Tajweed markup into styled HTML
function parseTajweedText(text) {
  if (!text) return '';
  
  // Replace ALL Tajweed markup tags with HTML spans
  let parsed = text
    // [h:X[ for highlighting/heavy letters
    .replace(/\[h:(\d+)\[/g, '<span class="tajweed-heavy">')
    // [l[ for light letters  
    .replace(/\[l\[/g, '<span class="tajweed-light">')
    // [p[ for purple elongation (madd)
    .replace(/\[p\[/g, '<span class="tajweed-madd">')
    // [m[ for meem
    .replace(/\[m\[/g, '<span class="tajweed-meem">')
    // [n[ or [n:] for ghunnah (nasalization)
    .replace(/\[n:?\[?/g, '<span class="tajweed-ghunnah">')
    // [s[ for silent letter
    .replace(/\[s\[/g, '<span class="tajweed-silent">')
    // [g[ for qalqalah
    .replace(/\[g\[/g, '<span class="tajweed-qalqalah">')
    // [q:X[ for qalqalah with number
    .replace(/\[q:(\d+)\[/g, '<span class="tajweed-qalqalah">')
    // [a:X[ for special alif rules
    .replace(/\[a:(\d+)\[/g, '<span class="tajweed-alif">')
    // [c:X[ for special rules
    .replace(/\[c:(\d+)\[/g, '<span class="tajweed-special">')
    // [i:X[ for idgham rules
    .replace(/\[i:(\d+)\[/g, '<span class="tajweed-idgham">')
    // [o[ for various ornamental marks
    .replace(/\[o\[/g, '')
    // [f:X[ for special rules
    .replace(/\[f:(\d+)\[/g, '<span class="tajweed-special">')
    // [u:X[ for other rules
    .replace(/\[u:(\d+)\[/g, '<span class="tajweed-other">')
    // [r:X[ for raa rules
    .replace(/\[r:(\d+)\[/g, '<span class="tajweed-raa">')
    // [w:X[ for waqf rules
    .replace(/\[w:(\d+)\[/g, '<span class="tajweed-waqf">')
    // Close all brackets
    .replace(/\]/g, '</span>');
  
  return parsed;
}

export default function AyahCard({ ayah, showTranslation = true, showSurahName = false }) {
  return (
    <div className={styles.ayahCard}>
      {showSurahName && ayah.surah && (
        <div className={styles.surahHeader}>
          <h3 className={styles.surahName}>
            {ayah.surah.englishName} - {ayah.surah.englishNameTranslation}
          </h3>
        </div>
      )}
      
      <div className={styles.ayahNumber}>
        <span>{ayah.surah?.number || 1}:{ayah.numberInSurah}</span>
      </div>
      
      <div className={styles.ayahContent}>
        <div 
          className={styles.arabicText}
          dangerouslySetInnerHTML={{ __html: parseTajweedText(ayah.text) }}
        />
        
        {showTranslation && ayah.translation && (
          <p className={styles.translation}>{ayah.translation}</p>
        )}
      </div>
    </div>
  );
}
