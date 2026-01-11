import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';
import styles from './BlogCard.module.css';

export default function BlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className={styles.card}>
      {blog.image_url && (
        <div className={styles.imageWrapper}>
          <Image
            src={blog.image_url}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
        {blog.category && (
          <span className="badge">{blog.category.name}</span>
        )}
        <h3 className={styles.title}>{blog.title}</h3>
        {blog.excerpt && (
          <p className={styles.excerpt}>{truncateText(blog.excerpt, 120)}</p>
        )}
        <div className={styles.meta}>
          <Calendar size={14} />
          <span>{formatDate(blog.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
