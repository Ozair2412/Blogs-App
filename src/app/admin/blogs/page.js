'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from '../list.module.css';

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Blogs</h1>
          <p>Manage your blog posts</p>
        </div>
        <Link href="/admin/blogs/new" className="btn btn-primary">
          <Plus size={18} />
          New Blog
        </Link>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Title</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {blogs.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} />
            <h3>No blogs yet</h3>
            <p>Create your first blog post</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className={styles.tableRow}>
              <div className={styles.titleCell}>
                {blog.image_url && (
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    width={60}
                    height={40}
                    className={styles.thumbnail}
                  />
                )}
                <span className={styles.titleText}>{blog.title}</span>
              </div>
              <span>{blog.category?.name || '-'}</span>
              <span>
                <span className={`${styles.statusBadge} ${blog.is_published ? styles.statusPublished : styles.statusDraft}`}>
                  {blog.is_published ? 'Published' : 'Draft'}
                </span>
              </span>
              <div className={styles.actions}>
                <Link href={`/admin/blogs/${blog.id}`} className={styles.actionBtn}>
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
