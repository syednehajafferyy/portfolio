'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import ImageUploader from '@/components/Admin/ImageUploader';

export default function WorksAdmin() {
  const [works, setWorks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '/reference/sample.jpg',
    url: '',
    date: '2024',
    service: 'Frontend Development',
    status: false,
    color: { h: '210', s: '80%', l: '50%' }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const res = await fetch('/api/works');
      const data = await res.json();
      if (Array.isArray(data)) {
        setWorks(data);
      }
    } catch (err) {
      setError('Failed to load portfolio projects');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const item = works[index];
    setForm({
      ...item,
      color: item.color || { h: '210', s: '80%', l: '50%' }
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setForm({
      title: '',
      description: '',
      image: '/reference/sample.jpg',
      url: '',
      date: '2024',
      service: 'Frontend Development',
      status: false,
      color: { h: '210', s: '80%', l: '50%' }
    });
  };

  const handleDelete = async (index) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const updated = works.filter((_, i) => i !== index);
    await saveWorks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updated;
    if (editingIndex !== null) {
      updated = [...works];
      updated[editingIndex] = form;
    } else {
      updated = [...works, form];
    }
    await saveWorks(updated);
    handleCancel();
  };

  const saveWorks = async (newWorks) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorks),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWorks(newWorks);
        if (data.warning) {
          setError(data.warning);
        } else {
          setMessage('Portfolio projects updated successfully and synced to GitHub!');
        }
      } else {
        setError(data.error || 'Failed to save projects');
      }
    } catch (err) {
      setError('Error saving projects');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.dashHeader}>
        <h1>Manage Portfolio Projects</h1>
        <p>Add, edit, or delete projects and work showcases.</p>
      </div>

      {message && <div className={styles.successBanner}>{message}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.cardSection}>
        <h2>{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label>Project Title</label>
              <input
                type="text"
                placeholder="e.g. Next.js SaaS Platform"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Service / Category</label>
              <input
                type="text"
                placeholder="e.g. Frontend Development, Design"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Project Link / URL</label>
              <input
                type="text"
                placeholder="e.g. https://myproject.com"
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
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            label="Project Image"
          />
            <div className={styles.formGroup}>
              <label>Featured / Active Status</label>
              <select
                value={form.status ? 'true' : 'false'}
                onChange={(e) => setForm({ ...form, status: e.target.value === 'true' })}
              >
                <option value="true">Featured (Active)</option>
                <option value="false">Standard Showcase</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Project Description</label>
            <textarea
              placeholder="Summary of the project, technology stack, and achievements..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className={styles.btnPrimary} style={{ maxWidth: '200px' }} disabled={saving}>
              {editingIndex !== null ? 'Update Project' : 'Add Project'}
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
        <h2>All Projects ({works.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Year</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {works.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.service}</td>
                  <td>{item.date}</td>
                  <td>{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--color-primary))' }}>Link ↗</a> : '-'}</td>
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
