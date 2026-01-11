'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/CategoryFilter';
import styles from './blogs.module.css';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const blogsRes = await fetch('/api/blogs');
        const blogsData = await blogsRes.json();
        
        const catsRes = await fetch('/api/categories?type=blog');
        const catsData = await catsRes.json();
        
        setBlogs(blogsData);
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
          <h1 className={styles.pageTitle}>Blogs</h1>
          <p className={styles.pageDescription}>
            Explore our collection of insightful Islamic articles
          </p>
        </div>
      </div>

      <div className="container">
        <CategoryFilter
          categories={categories}
          items={blogs}
          renderItem={(blog) => <BlogCard key={blog.id} blog={blog} />}
          emptyMessage="No blogs available yet."
        />
      </div>
    </>
  );
}
