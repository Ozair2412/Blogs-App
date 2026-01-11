import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Changed grid structure: fewer columns now */}
        <div className={styles.grid}>
          {/* Column 1: Brand & Description */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              Deen Elevate
            </Link>
            <p className={styles.description}>
              Discover beautiful duas and insightful Islamic content to enrich your spiritual journey.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/areeb_arfa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.socialIcon}>
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialIcon}>
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.socialIcon}>
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Discover Links (Centered in the remaining space logic) */}
          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>Discover</h3>
            <ul className={styles.linkList}>
              <li><Link href="/blogs" className={styles.link}>Blogs</Link></li>
              <li><Link href="/duas" className={styles.link}>Duas</Link></li>
              <li><Link href="/featured" className={styles.link}>Featured</Link></li>
              <li><Link href="/categories" className={styles.link}>Categories</Link></li>
            
            </ul>
          </div>

          {/* Column 3: Get in Touch (Removed Support, kept this) */}
          <div className={styles.contactCol}>
            <h3 className={styles.colTitle}>Get in Touch</h3>
            <div className={styles.contactItem}>
              <Mail size={20} className={styles.contactIcon} />
              <a href="mailto:contact@deenelevate.com" className={styles.link}>contact@deenelevate.com</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Deen Elevate. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Made with <Heart size={14} className={styles.heartIcon} /> for the Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}
