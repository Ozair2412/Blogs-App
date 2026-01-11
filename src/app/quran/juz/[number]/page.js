'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import AyahCard from '@/components/quran/AyahCard';
import TranslationToggle from '@/components/quran/TranslationToggle';
import ReadingModeView from '@/components/quran/ReadingModeView';
import ReadingViewSwitcher from '@/components/quran/ReadingViewSwitcher';
import styles from './juz.module.css';

export default function JuzPage() {
  const params = useParams();
  const juzNumber = parseInt(params.number);
  
  const [juzData, setJuzData] = useState(null);
  const [viewMode, setViewMode] = useState('translation');
  const [loading, setLoading] = useState(true);
  
  // Translation visibility depends on view mode
  const showTranslation = viewMode === 'translation';

  useEffect(() => {
    async function fetchJuz() {
      setLoading(true);
      try {
        // Fetch Tajweed Arabic and English separately (editions format doesn't work for Juz)
        const [arabicResponse, englishResponse] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-tajweed`),
          fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/en.asad`)
        ]);
        
        const arabicData = await arabicResponse.json();
        const englishData = await englishResponse.json();
        
        if (arabicData.code === 200 && englishData.code === 200) {
          // Merge Arabic and English ayahs
          const arabicJuz = arabicData.data;
          const englishJuz = englishData.data;
          
          const mergedAyahs = arabicJuz.ayahs.map((ayah, index) => ({
            ...ayah,
            translation: englishJuz.ayahs[index].text
          }));
          
          setJuzData({
            ...arabicJuz,
            ayahs: mergedAyahs
          });
        }
      } catch (error) {
        console.error('Error fetching juz:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (juzNumber >= 1 && juzNumber <= 30) {
      fetchJuz();
    }
  }, [juzNumber]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!juzData) {
    return (
      <div className={styles.errorContainer}>
        <h1>Juz not found</h1>
        <Link href="/quran" className={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Quran
        </Link>
      </div>
    );
  }

  // Group ayahs by surah to show surah names
  let currentSurahNumber = null;
  const ayahsWithSurahHeaders = juzData.ayahs.map(ayah => {
    const showSurahName = ayah.surah.number !== currentSurahNumber;
    if (showSurahName) {
      currentSurahNumber = ayah.surah.number;
    }
    return {
      ...ayah,
      showSurahName
    };
  });

  return (
    <article className={styles.juzArticle}>
      <Link href="/quran" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Quran
      </Link>

      <header className={styles.juzHeader}>
        <div className={styles.juzNumber}>Juz {juzNumber}</div>
        <h1 className={styles.juzTitle}>Juz {juzNumber}</h1>
        <p className={styles.ayahCount}>{juzData.ayahs.length} Ayahs</p>
      </header>

      <div className={styles.controls}>
        <ReadingViewSwitcher 
          activeView={viewMode} 
          onViewChange={setViewMode} 
        />
      </div>

      <div className={styles.ayahsContainer}>
        {viewMode === 'translation' ? (
          ayahsWithSurahHeaders.map(ayah => (
            <AyahCard 
              key={ayah.number} 
              ayah={ayah} 
              showTranslation={showTranslation}
              showSurahName={ayah.showSurahName}
            />
          ))
        ) : (
          <ReadingModeView 
            ayahs={juzData.ayahs} 
            showTranslation={showTranslation}
          />
        )}
      </div>

      <nav className={styles.juzNav}>
        {juzNumber > 1 && (
          <Link href={`/quran/juz/${juzNumber - 1}`} className={styles.navButton}>
            <ChevronLeft size={20} />
            Previous Juz
          </Link>
        )}
        {juzNumber < 30 && (
          <Link href={`/quran/juz/${juzNumber + 1}`} className={styles.navButton}>
            Next Juz
            <ChevronRight size={20} />
          </Link>
        )}
      </nav>
    </article>
  );
}
