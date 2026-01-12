'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import styles from '../list.module.css';

export default function DuasListPage() {
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(true);


  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchDuas();
  }, []);

  async function fetchDuas() {
    try {
      // Use ?admin=true to fetch all duas including drafts
      const response = await fetch('/api/duas?admin=true');
      const data = await response.json();
      setDuas(data);
    } catch (error) {
      console.error('Failed to fetch duas:', error);
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(id) {
    setDeleteModal({ isOpen: true, id });
  }

  async function handleDelete() {
    if (!deleteModal.id) return;
    const id = deleteModal.id;

    try {
      const response = await fetch(`/api/duas/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setDuas(duas.filter((d) => d.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete dua:', error);
    } finally {
      // Keep modal closed logic (handled by confirm button usually, but ensuring cleanup)
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
                  onClick={() => confirmDelete(dua.id)}
                  className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Dua"
        message="Are you sure you want to delete this dua? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
