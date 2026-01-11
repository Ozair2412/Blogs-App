'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { generateSlug } from '@/lib/utils';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'blog' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    setAdding(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name,
          slug: generateSlug(newCategory.name),
          type: newCategory.type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data]);
        setNewCategory({ name: '', type: 'blog' });
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }

  const blogCategories = categories.filter((c) => c.type === 'blog');
  const duaCategories = categories.filter((c) => c.type === 'dua');

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Categories</h1>
        <p>Manage categories for blogs and duas</p>
      </div>

      <form onSubmit={handleAdd} className={styles.addForm}>
        <input
          type="text"
          className="form-input"
          placeholder="Category name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <select
          className="form-input"
          value={newCategory.type}
          onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
        >
          <option value="blog">Blog</option>
          <option value="dua">Dua</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={adding}>
          <Plus size={18} />
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Blog Categories</h2>
          {blogCategories.length === 0 ? (
            <div className={styles.emptyState}>No blog categories yet</div>
          ) : (
            <div className={styles.list}>
              {blogCategories.map((cat) => (
                <div key={cat.id} className={styles.item}>
                  <div className={styles.itemIcon}>
                    <FolderOpen size={16} />
                  </div>
                  <span className={styles.itemName}>{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className={styles.deleteBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Dua Categories</h2>
          {duaCategories.length === 0 ? (
            <div className={styles.emptyState}>No dua categories yet</div>
          ) : (
            <div className={styles.list}>
              {duaCategories.map((cat) => (
                <div key={cat.id} className={styles.item}>
                  <div className={styles.itemIcon}>
                    <FolderOpen size={16} />
                  </div>
                  <span className={styles.itemName}>{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className={styles.deleteBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
