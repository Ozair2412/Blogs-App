'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload } from 'lucide-react';
import { generateSlug, compressImage } from '@/lib/utils';
import styles from '../../editor.module.css';

export default function DuaEditorPage({ params }) {
  const unwrappedParams = use(params);
  const isNew = unwrappedParams.id === 'new';
  const router = useRouter();

  const [dua, setDua] = useState({
    title: '',
    slug: '',
    arabic_text: '',
    transliteration: '',
    translation: '',
    reference: '',
    image_url: '',
    category_id: '',
    is_published: false,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (!isNew) {
      fetchDua();
    }
  }, [isNew]);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories?type=dua');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }

  async function fetchDua() {
    try {
      const response = await fetch(`/api/duas/${unwrappedParams.id}`);
      const data = await response.json();
      setDua(data);
    } catch (err) {
      setError('Failed to load dua');
    } finally {
      setLoading(false);
    }
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    setDua({
      ...dua,
      title,
      slug: isNew ? generateSlug(title) : dua.slug,
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setDua({ ...dua, image_url: data.url });
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isNew ? '/api/duas' : `/api/duas/${unwrappedParams.id}`;
      const method = isNew ? 'POST' : 'PUT';

      // Ensure slug exists
      const finalSlug = dua.slug || generateSlug(dua.title);
      const payload = { ...dua, slug: finalSlug };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save');

      router.push('/admin/duas');
    } catch (err) {
      setError('Failed to save dua');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin/duas" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Duas
        </Link>
      </div>

      <h1 style={{ marginBottom: '1.5rem' }}>{isNew ? 'Add Dua' : 'Edit Dua'}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-input"
            value={dua.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              type="text"
              className="form-input"
              value={dua.slug}
              onChange={(e) => setDua({ ...dua, slug: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={dua.category_id || ''}
              onChange={(e) => setDua({ ...dua, category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Arabic Text</label>
          <textarea
            className="form-input form-textarea"
            value={dua.arabic_text || ''}
            onChange={(e) => setDua({ ...dua, arabic_text: e.target.value })}
            rows={4}
            style={{ direction: 'rtl', textAlign: 'right', fontFamily: 'Amiri, serif', fontSize: '1.25rem' }}
            placeholder="أدخل النص العربي هنا"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Transliteration</label>
          <textarea
            className="form-input form-textarea"
            value={dua.transliteration || ''}
            onChange={(e) => setDua({ ...dua, transliteration: e.target.value })}
            rows={3}
            placeholder="Enter transliteration..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Translation *</label>
          <textarea
            className="form-input form-textarea"
            value={dua.translation}
            onChange={(e) => setDua({ ...dua, translation: e.target.value })}
            rows={4}
            required
            placeholder="Enter translation..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Reference (Hadith, Quran, etc.)</label>
          <input
            type="text"
            className="form-input"
            value={dua.reference || ''}
            onChange={(e) => setDua({ ...dua, reference: e.target.value })}
            placeholder="e.g., Sahih Bukhari, Surah Al-Fatiha"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image (optional)</label>
          {dua.image_url ? (
            <div className={styles.imagePreview}>
              <Image src={dua.image_url} alt="Preview" fill />
              <button
                type="button"
                className={styles.removeImage}
                onClick={() => setDua({ ...dua, image_url: '' })}
              >
                Remove
              </button>
            </div>
          ) : (
            <label className={styles.imageUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div className={styles.uploadPlaceholder}>
                <Upload size={32} />
                <p>{uploading ? 'Uploading...' : 'Click to upload image'}</p>
              </div>
            </label>
          )}
        </div>

        <div className={styles.toggle}>
          <div
            className={`${styles.toggleSwitch} ${dua.is_published ? styles.active : ''}`}
            onClick={() => setDua({ ...dua, is_published: !dua.is_published })}
          />
          <span>Publish this dua</span>
        </div>

        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : (isNew ? 'Add Dua' : 'Update Dua')}
          </button>
          <Link href="/admin/duas" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
