'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

export default function ExperienceAdmin() {
  const [companies, setCompanies] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    position: '',
    company: '',
    duration: '',
    location: '',
    image: '',
    url: '',
    responsibilities: '',
    color: { h: '221', s: '79%', l: '51%' }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/companies');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCompanies(data);
      }
    } catch (err) {
      setError('Failed to load experience items');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const item = companies[index];
    setForm({
      ...item,
      responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities.join('\n') : item.responsibilities || '',
      color: item.color || { h: '221', s: '79%', l: '51%' }
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setForm({
      position: '',
      company: '',
      duration: '',
      location: '',
      image: '',
      url: '',
      responsibilities: '',
      color: { h: '221', s: '79%', l: '51%' }
    });
  };

  const handleDelete = async (index) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    const updated = companies.filter((_, i) => i !== index);
    await saveCompanies(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedItem = {
      ...form,
      responsibilities: form.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0)
    };

    let updated;
    if (editingIndex !== null) {
      updated = [...companies];
      updated[editingIndex] = formattedItem;
    } else {
      updated = [...companies, formattedItem];
    }
    await saveCompanies(updated);
    handleCancel();
  };

  const saveCompanies = async (newCompanies) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompanies),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCompanies(newCompanies);
        if (data.warning) {
          setError(data.warning);
        } else {
          setMessage('Experience items updated successfully and synced to GitHub!');
        }
      } else {
        setError(data.error || 'Failed to save experience records');
      }
    } catch (err) {
      setError('Error saving experience items');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.dashHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Manage Experience & Companies</h1>
          <p>Add, edit, or remove work experience roles and company history.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            handleCancel();
            document.getElementById('experienceForm')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={styles.btnPrimary}
          style={{ maxWidth: '240px' }}
        >
          + Add New Experience
        </button>
      </div>

      {message && <div className={styles.successBanner}>{message}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.cardSection} id="experienceForm">
        <h2>{editingIndex !== null ? 'Edit Role' : 'Add New Work Experience'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label>Position / Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Company Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Tech Corp"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Duration / Time Period</label>
              <input
                type="text"
                placeholder="e.g. January 2022 - Present"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Work Location Type</label>
              <input
                type="text"
                placeholder="e.g. Remote, Hybrid, On-site"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Company Website URL</label>
              <input
                type="text"
                placeholder="e.g. https://company.com"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Company Logo Image Path</label>
              <input
                type="text"
                placeholder="e.g. /company/logo.svg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Key Responsibilities (One bullet point per line)</label>
            <textarea
              placeholder="- Built animation-focused websites...&#10;- Integrated custom CMS..."
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              rows={5}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className={styles.btnPrimary} style={{ maxWidth: '200px' }} disabled={saving}>
              {editingIndex !== null ? 'Update Experience' : 'Add Experience'}
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
        <h2>Experience History ({companies.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Duration</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.company}</strong></td>
                  <td>{item.position}</td>
                  <td>{item.duration}</td>
                  <td>{item.location}</td>
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
