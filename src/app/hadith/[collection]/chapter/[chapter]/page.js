'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import HadithView from '@/components/hadith/HadithView';
import { getHadithsByChapter } from '@/lib/hadithApi';
import { HADITH_COLLECTIONS } from '@/data/hadithCollections';
import styles from './chapter.module.css';

export default function ChapterPage() {
  const router = useRouter();
  const params = useParams();
  const collectionSlug = params.collection;
  const chapterNumber = params.chapter;
  
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterInfo, setChapterInfo] = useState(null);

  const collection = HADITH_COLLECTIONS.find(c => c.slug === collectionSlug);

  useEffect(() => {
    async function fetchHadiths() {
      try {
        const data = await getHadithsByChapter(collectionSlug, chapterNumber);
        // Handle hadithapi.com response structure
        const hadithsList = data.hadiths?.data || data.hadiths || [];
        setHadiths(hadithsList);
        
        // Get chapter info from first hadith
        if (hadithsList.length > 0) {
          setChapterInfo({
            english: hadithsList[0].chapterEnglish,
            arabic: hadithsList[0].chapterArabic
          });
        }
      } catch (error) {
        console.error('Error fetching hadiths:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHadiths();
  }, [collectionSlug, chapterNumber]);

  const filteredHadiths = hadiths.filter(hadith => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      hadith.hadithEnglish?.toLowerCase().includes(query) ||
      hadith.hadithUrdu?.includes(searchQuery.trim()) ||
      hadith.englishNarrator?.toLowerCase().includes(query) ||
      hadith.hadithNumber?.toString().includes(query)
    );
  });

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!collection) {
    return (
      <div className="container">
        <p className={styles.errorMessage}>Collection not found</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back to Chapters</span>
          </button>

          <h1 className={styles.collectionName}>{collection.name}</h1>
          
          {chapterInfo && (
            <>
              <h2 className={styles.chapterArabic}>{chapterInfo.arabic}</h2>
              <h3 className={styles.chapterEnglish}>
                Chapter {chapterNumber}: {chapterInfo.english}
              </h3>
            </>
          )}

          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search in this chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {filteredHadiths.length > 0 ? (
          filteredHadiths.map(hadith => (
            <HadithView 
              key={hadith.hadithNumber} 
              hadith={hadith} 
              collectionName={collection.slug}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>
            {searchQuery ? 'No hadiths found matching your search.' : 'No hadiths available in this chapter.'}
          </p>
        )}
      </div>
    </>
  );
}
