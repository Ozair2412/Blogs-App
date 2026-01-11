'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import styles from '../list.module.css';

export default function DuasListPage() {
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDuas();
  }, []);

  async function fetchDuas() {
    try {
      const response = await fetch('/api/duas');
      const data = await response.json();
      setDuas(data);
    } catch (error) {
      console.error('Failed to fetch duas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this dua?')) return;

    try {
      const response = await fetch(`/api/duas/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setDuas(duas.filter((d) => d.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete dua:', error);
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Duas</h1>
          <p>Manage your duas collection</p>
        </div>
        <Link href="/admin/duas/new" className="btn btn-primary">
          <Plus size={18} />
          New Dua
        </Link>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Title</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {duas.length === 0 ? (
          <div className={styles.emptyState}>
            <BookOpen size={48} />
            <h3>No duas yet</h3>
            <p>Add your first dua</p>
          </div>
        ) : (
          duas.map((dua) => (
            <div key={dua.id} className={styles.tableRow}>
              <div className={styles.titleCell}>
                <span className={styles.titleText}>{dua.title}</span>
              </div>
              <span>{dua.category?.name || '-'}</span>
              <span>
                <span className={`${styles.statusBadge} ${dua.is_published ? styles.statusPublished : styles.statusDraft}`}>
                  {dua.is_published ? 'Published' : 'Draft'}
                </span>
              </span>
              <div className={styles.actions}>
                <Link href={`/admin/duas/${dua.id}`} className={styles.actionBtn}>
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(dua.id)}
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
