'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import ImageUploader from '@/components/Admin/ImageUploader';

export default function GraphicDesignAdmin() {
  const [posts, setPosts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Branding & Typography',
    description: '',
    image: '/reference/sample.jpg',
    url: '',
    date: '2024',
    tags: 'Branding, Graphic Design',
    status: true
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/graphic-design');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      setError('Failed to load graphic design posts');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const item = posts[index];
    setForm({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setForm({
      title: '',
      category: 'Branding & Typography',
      description: '',
      image: '/reference/sample.jpg',
      url: '',
      date: '2024',
      tags: 'Branding, Graphic Design',
      status: true
    });
  };

  const handleDelete = async (index) => {
    if (!confirm('Are you sure you want to delete this graphic design post?')) return;
    const updated = posts.filter((_, i) => i !== index);
    await savePosts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updated;
    if (editingIndex !== null) {
      updated = [...posts];
      updated[editingIndex] = form;
    } else {
      updated = [...posts, { ...form, id: Date.now().toString() }];
    }
    await savePosts(updated);
    handleCancel();
  };

  const savePosts = async (newPosts) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/graphic-design', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPosts),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(newPosts);
        if (data.warning) {
          setError(data.warning);
        } else {
          setMessage('Graphic design posts updated successfully!');
        }
      } else {
        setError(data.error || 'Failed to save graphic design posts');
      }
    } catch (err) {
      setError('Error saving graphic design posts');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.dashHeader}>
        <h1>Manage Graphic Design Posts</h1>
        <p>Add, edit, or delete graphic design artworks, posters, logos, and visual assets.</p>
      </div>

      {message && <div className={styles.successBanner}>{message}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.cardSection}>
        <h2>{editingIndex !== null ? 'Edit Graphic Design Post' : 'Add New Graphic Design Post'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label>Post Title</label>
              <input
                type="text"
                placeholder="e.g. Brand Identity & Visual System"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Category / Type</label>
              <input
                type="text"
                placeholder="e.g. Branding & Typography, Poster, Digital Media"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>External Link / Project URL (Optional)</label>
              <input
                type="text"
                placeholder="e.g. https://behance.net/gallery/..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Year / Date</label>
              <input
                type="text"
                placeholder="e.g. 2024"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tags (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Branding, Photoshop, Typography"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Display Status</label>
              <select
                value={form.status ? 'true' : 'false'}
                onChange={(e) => setForm({ ...form, status: e.target.value === 'true' })}
              >
                <option value="true">Active (Visible on portfolio)</option>
                <option value="false">Hidden (Draft mode)</option>
              </select>
            </div>
            <ImageUploader
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              label="Design Preview Image"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Short description of the design, tools used, concept..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className={styles.btnPrimary} style={{ maxWidth: '220px' }} disabled={saving}>
              {editingIndex !== null ? 'Update Post' : 'Add Post'}
            </button>
            {editingIndex !== null && (
              <button type="button" onClick={handleCancel} className={styles.btnSecondary}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.cardSection}>
        <h2>All Graphic Design Posts ({posts.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.date}</td>
                  <td>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '4px',
                      fontSize: '1.2rem',
                      background: item.status !== false ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: item.status !== false ? '#4ade80' : '#f87171'
                    }}>
                      {item.status !== false ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button onClick={() => handleEdit(idx)} className={styles.btnSecondary}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(idx)} className={styles.btnDanger}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
