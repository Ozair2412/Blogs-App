'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload } from 'lucide-react';
import { generateSlug, compressImage } from '@/lib/utils';
import RichTextEditor from '@/components/RichTextEditor';
import styles from '../../editor.module.css';

export default function BlogEditorPage({ params }) {
  const unwrappedParams = use(params);
  const isNew = unwrappedParams.id === 'new';
  const router = useRouter();

  const [blog, setBlog] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
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
      fetchBlog();
    }
  }, [isNew]);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories?type=blog');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }

  async function fetchBlog() {
    try {
      const response = await fetch(`/api/blogs/${unwrappedParams.id}`);
      const data = await response.json();
      setBlog(data);
    } catch (err) {
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    setBlog({
      ...blog,
      title,
      slug: isNew ? generateSlug(title) : blog.slug,
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Compress image
      const compressedFile = await compressImage(file);

      // Upload
      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setBlog({ ...blog, image_url: data.url });
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
      const url = isNew ? '/api/blogs' : `/api/blogs/${unwrappedParams.id}`;
      const method = isNew ? 'POST' : 'PUT';

      // Ensure slug exists
      const finalSlug = blog.slug || generateSlug(blog.title);
      const payload = { ...blog, slug: finalSlug };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save');

      router.push('/admin/blogs');
    } catch (err) {
      setError('Failed to save blog');
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
        <Link href="/admin/blogs" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Blogs
        </Link>
      </div>

      <h1 style={{ marginBottom: '1.5rem' }}>{isNew ? 'Create Blog' : 'Edit Blog'}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-input"
            value={blog.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Slug</label>
          <input
            type="text"
            className="form-input"
            value={blog.slug}
            onChange={(e) => setBlog({ ...blog, slug: e.target.value })}
          />
        </div>

        <div className={styles.row}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={blog.category_id || ''}
              onChange={(e) => setBlog({ ...blog, category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt</label>
            <input
              type="text"
              className="form-input"
              value={blog.excerpt || ''}
              onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
              placeholder="Short description"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Featured Image</label>
          {blog.image_url ? (
            <div className={styles.imagePreview}>
              <Image src={blog.image_url} alt="Preview" fill />
              <button
                type="button"
                className={styles.removeImage}
                onClick={() => setBlog({ ...blog, image_url: '' })}
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

        <div className="form-group">
          <label className="form-label">Content *</label>
          <RichTextEditor
            value={blog.content}
            onChange={(content) => setBlog({ ...blog, content })}
            placeholder="Write your blog content here..."
          />
        </div>

        <div className={styles.toggle}>
          <div
            className={`${styles.toggleSwitch} ${blog.is_published ? styles.active : ''}`}
            onClick={() => setBlog({ ...blog, is_published: !blog.is_published })}
          />
          <span>Publish this blog</span>
        </div>

        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : (isNew ? 'Create Blog' : 'Update Blog')}
          </button>
          <Link href="/admin/blogs" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
