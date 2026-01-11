'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import AyahCard from '@/components/quran/AyahCard';
import TranslationToggle from '@/components/quran/TranslationToggle';
import ReadingModeView from '@/components/quran/ReadingModeView';
import ReadingViewSwitcher from '@/components/quran/ReadingViewSwitcher';
import styles from './surah.module.css';

export default function SurahPage() {
  const params = useParams();
  const surahNumber = parseInt(params.number);
  
  const [surahData, setsurahData] = useState(null);
  const [viewMode, setViewMode] = useState('translation');
  const [loading, setLoading] = useState(true);
  
  // Translation visibility depends on view mode
  const showTranslation = viewMode === 'translation';

  useEffect(() => {
    async function fetchSurah() {
      setLoading(true);
      try {
        // Fetch Tajweed Arabic and English together
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-tajweed,en.asad`
        );
        const data = await response.json();
        
        if (data.code === 200) {
          // Merge Arabic and English ayahs
          const arabicSurah = data.data[0];
          const englishSurah = data.data[1];
          
          const mergedAyahs = arabicSurah.ayahs.map((ayah, index) => ({
            ...ayah,
            translation: englishSurah.ayahs[index].text
          }));
          
          setsurahData({
            ...arabicSurah,
            ayahs: mergedAyahs
          });
        }
      } catch (error) {
        console.error('Error fetching surah:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (surahNumber >= 1 && surahNumber <= 114) {
      fetchSurah();
    }
  }, [surahNumber]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!surahData) {
    return (
      <div className={styles.errorContainer}>
        <h1>Surah not found</h1>
        <Link href="/quran" className={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Quran
        </Link>
      </div>
    );
  }

  return (
    <article className={styles.surahArticle}>
      <Link href="/quran" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Quran
      </Link>

      <header className={styles.surahHeader}>
        <div className={styles.surahNumber}>Surah {surahData.number}</div>
        <h1 className={styles.arabicName}>{surahData.name}</h1>
        <h2 className={styles.englishName}>{surahData.englishName}</h2>
        <p className={styles.translation}>{surahData.englishNameTranslation}</p>
        <div className={styles.meta}>
          <span className={styles.revelation}>{surahData.revelationType}</span>
          <span className={styles.separator}>•</span>
          <span>{surahData.numberOfAyahs} Ayahs</span>
        </div>
      </header>

      <div className={styles.controls}>
        <ReadingViewSwitcher 
          activeView={viewMode} 
          onViewChange={setViewMode} 
        />
      </div>

      <div className={styles.ayahsContainer}>
        {viewMode === 'translation' ? (
          surahData.ayahs.map(ayah => (
            <AyahCard 
              key={ayah.number} 
              ayah={ayah} 
              showTranslation={showTranslation}
            />
          ))
        ) : (
          <ReadingModeView 
            ayahs={surahData.ayahs} 
            showTranslation={showTranslation}
          />
        )}
      </div>

      <nav className={styles.surahNav}>
        {surahNumber > 1 && (
          <Link href={`/quran/surah/${surahNumber - 1}`} className={styles.navButton}>
            <ChevronLeft size={20} />
            Previous Surah
          </Link>
        )}
        {surahNumber < 114 && (
          <Link href={`/quran/surah/${surahNumber + 1}`} className={styles.navButton}>
            Next Surah
            <ChevronRight size={20} />
          </Link>
        )}
      </nav>
    </article>
  );
}
