'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ChapterCard from '@/components/hadith/ChapterCard';
import { getChapters } from '@/lib/hadithApi';
import { HADITH_COLLECTIONS } from '@/data/hadithCollections';
import styles from './collection.module.css';

export default function HadithCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const collectionSlug = params.collection;
  
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const collection = HADITH_COLLECTIONS.find(c => c.slug === collectionSlug);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const data = await getChapters(collectionSlug);
        // Handle hadithapi.com response structure
        setChapters(data.chapters || []);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [collectionSlug]);

  const filteredChapters = chapters.filter(chapter => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      chapter.chapterEnglish?.toLowerCase().includes(query) ||
      chapter.chapterArabic?.includes(searchQuery.trim()) ||
      chapter.chapterNumber?.toString().includes(query)
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
            <span>Back to Collections</span>
          </button>

          <h1 className={styles.arabicTitle}>{collection.arabicName}</h1>
          <h2 className={styles.englishTitle}>{collection.name}</h2>
          <p className={styles.description}>{collection.description}</p>

          <div className={styles.collectionMeta}>
            <span>{collection.author}</span>
            <span className={styles.separator}>•</span>
            <span>{collection.totalHadith} Hadiths</span>
            <span className={styles.separator}>•</span>
            <span>{collection.totalChapters} Chapters</span>
            <span className={styles.separator}>•</span>
            <span>Compiled {collection.compiled}</span>
          </div>

          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.chaptersList}>
          {filteredChapters.length > 0 ? (
            filteredChapters.map(chapter => (
              <ChapterCard
                key={chapter.id || chapter.chapterNumber}
                chapter={chapter}
                collectionSlug={collectionSlug}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>
              {searchQuery ? 'No chapters found matching your search.' : 'No chapters available.'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
