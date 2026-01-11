'use client';

import { useState, useEffect } from 'react';
import QuranCard from '@/components/quran/QuranCard';
import ViewModeSwitcher from '@/components/quran/ViewModeSwitcher';
import styles from './quran.module.css';

// Juz data with Surah ranges
const JUZ_DATA = [
  { number: 1, startInfo: 'Al-Fatiha 1', endInfo: 'Al-Baqara 141' },
  { number: 2, startInfo: 'Al-Baqara 142', endInfo: 'Al-Baqara 252' },
  { number: 3, startInfo: 'Al-Baqara 253', endInfo: 'Al-Imran 92' },
  { number: 4, startInfo: 'Al-Imran 93', endInfo: 'An-Nisa 23' },
  { number: 5, startInfo: 'An-Nisa 24', endInfo: 'An-Nisa 147' },
  { number: 6, startInfo: 'An-Nisa 148', endInfo: 'Al-Ma\'idah 81' },
  { number: 7, startInfo: 'Al-Ma\'idah 82', endInfo: 'Al-An\'am 110' },
  { number: 8, startInfo: 'Al-An\'am 111', endInfo: 'Al-A\'raf 87' },
  { number: 9, startInfo: 'Al-A\'raf 88', endInfo: 'Al-Anfal 40' },
  { number: 10, startInfo: 'Al-Anfal 41', endInfo: 'At-Tawba 92' },
  { number: 11, startInfo: 'At-Tawba 93', endInfo: 'Hud 5' },
  { number: 12, startInfo: 'Hud 6', endInfo: 'Yusuf 52' },
  { number: 13, startInfo: 'Yusuf 53', endInfo: 'Ibrahim 52' },
  { number: 14, startInfo: 'Al-Hijr 1', endInfo: 'An-Nahl 128' },
  { number: 15, startInfo: 'Al-Isra 1', endInfo: 'Al-Kahf 74' },
  { number: 16, startInfo: 'Al-Kahf 75', endInfo: 'Ta-Ha 135' },
  { number: 17, startInfo: 'Al-Anbiya 1', endInfo: 'Al-Hajj 78' },
  { number: 18, startInfo: 'Al-Mu\'minun 1', endInfo: 'Al-Furqan 20' },
  { number: 19, startInfo: 'Al-Furqan 21', endInfo: 'An-Naml 55' },
  { number: 20, startInfo: 'An-Naml 56', endInfo: 'Al-Ankabut 45' },
  { number: 21, startInfo: 'Al-Ankabut 46', endInfo: 'Al-Ahzab 30' },
  { number: 22, startInfo: 'Al-Ahzab 31', endInfo: 'Ya-Sin 27' },
  { number: 23, startInfo: 'Ya-Sin 28', endInfo: 'Az-Zumar 31' },
  { number: 24, startInfo: 'Az-Zumar 32', endInfo: 'Fussilat 46' },
  { number: 25, startInfo: 'Fussilat 47', endInfo: 'Al-Jathiya 37' },
  { number: 26, startInfo: 'Al-Ahqaf 1', endInfo: 'Adh-Dhariyat 30' },
  { number: 27, startInfo: 'Adh-Dhariyat 31', endInfo: 'Al-Hadid 29' },
  { number: 28, startInfo: 'Al-Mujadila 1', endInfo: 'At-Tahrim 12' },
  { number: 29, startInfo: 'Al-Mulk 1', endInfo: 'Al-Mursalat 50' },
  { number: 30, startInfo: 'An-Naba 1', endInfo: 'An-Nas 6' }
];

export default function QuranPage() {
  const [viewMode, setViewMode] = useState('surah');
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
        }
      } catch (error) {
        console.error('Error fetching surahs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(surah => {
    const query = searchQuery.toLowerCase().trim();
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.name.includes(searchQuery.trim()) ||
      surah.number.toString().includes(query)
    );
  });

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>The Holy Quran</h1>
          <p className={styles.pageDescription}>
            Read and study the Quran by Surah or Juz with Arabic text and English translation
          </p>
          
          <div className={styles.controls}>
            <ViewModeSwitcher activeView={viewMode} onViewChange={setViewMode} />
            
            {viewMode === 'surah' && (
              <input
                type="text"
                placeholder="Search Surahs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {viewMode === 'surah' ? (
            filteredSurahs.length > 0 ? (
              filteredSurahs.map(surah => (
                <QuranCard key={surah.number} type="surah" data={surah} />
              ))
            ) : (
              <p className={styles.emptyMessage}>No surahs found matching your search.</p>
            )
          ) : (
            JUZ_DATA.map(juz => (
              <QuranCard key={juz.number} type="juz" data={juz} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
