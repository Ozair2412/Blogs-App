'use client';

import { useState, useEffect } from 'react';
import DuaCard from '@/components/dua/DuaCard';
import CategoryFilter from '@/components/CategoryFilter';
import styles from './duas.module.css';

export default function DuasPage() {
  const [duas, setDuas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const duasRes = await fetch('/api/duas');
        const duasData = await duasRes.json();
        
        const catsRes = await fetch('/api/categories?type=dua');
        const catsData = await catsRes.json();
        
        setDuas(duasData);
        setCategories(catsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Duas</h1>
          <p className={styles.pageDescription}>
            Discover beautiful supplications with Arabic text, transliteration, and translations
          </p>
        </div>
      </div>

      <div className="container">
        <CategoryFilter
          categories={categories}
          items={duas}
          renderItem={(dua) => <DuaCard key={dua.id} dua={dua} />}
          emptyMessage="No duas available yet."
        />
      </div>
    </>
  );
}
