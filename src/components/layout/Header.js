'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.css';

export default function Header({ siteTitle = 'Deen Elevate' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className={styles.logoText}>{siteTitle}</span>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/blogs" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Blogs
          </Link>
          <Link href="/duas" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Duas
          </Link>
          <Link href="/quran" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Quran
          </Link>
          <Link href="/hadith" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Hadith
          </Link>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <Search size={18} />
            </button>
          </form>

          <ThemeToggle />
        </nav>

        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
