'use client';

import { useState } from 'react';
import HadithCard from '@/components/hadith/HadithCard';
import { HADITH_COLLECTIONS } from '@/data/hadithCollections';
import styles from './hadith.module.css';

export default function HadithPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = HADITH_COLLECTIONS.filter(collection => {
    const query = searchQuery.toLowerCase().trim();
    return (
      collection.name.toLowerCase().includes(query) ||
      collection.arabicName.includes(searchQuery.trim()) ||
      collection.author.toLowerCase().includes(query) ||
      collection.description.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Hadith & Sunnah</h1>
          <p className={styles.pageDescription}>
            Explore authentic collections of Hadith - sayings and teachings of Prophet Muhammad ﷺ
          </p>
          
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {filteredCollections.length > 0 ? (
            filteredCollections.map(collection => (
              <HadithCard key={collection.name} collection={collection} />
            ))
          ) : (
            <p className={styles.emptyMessage}>No collections found matching your search.</p>
          )}
        </div>
      </div>
    </>
  );
}
