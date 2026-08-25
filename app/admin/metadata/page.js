'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

export default function MetadataAdmin() {
  const [formData, setFormData] = useState({
    metadata: {
      name: '',
      title: '',
      description: '',
      timeZone: '',
      locale: ''
    },
    personal: {
      name: '',
      surname: '',
      role: '',
      experience: 0,
      email: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      username: '',
      resumeURL: ''
    },
    social: {
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      codepen: ''
    },
    content: {
      verse: ''
    }
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/metadata');
        const data = await res.json();
        if (data) {
          setFormData((prev) => ({
            metadata: { ...prev.metadata, ...(data.metadata || {}) },
            personal: { ...prev.personal, ...(data.personal || {}) },
            social: { ...prev.social, ...(data.social || {}) },
            content: { ...prev.content, ...(data.content || {}) },
          }));
        }
      } catch (err) {
        setError('Failed to load current metadata');
      }
    }
    loadData();
  }, []);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/metadata', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage('Personal and site details updated successfully!');
      } else {
        setError(data.error || 'Failed to save updates');
      }
    } catch (err) {
      setError('Error saving metadata');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.dashHeader}>
        <h1>Personal & Site Details</h1>
        <p>Edit your name, title, contact details, social links, and website info.</p>
      </div>

      {message && <div className={styles.successBanner}>{message}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.cardSection}>
          <h2>Personal Information</h2>
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                value={formData.personal.name}
                onChange={(e) => handleChange('personal', 'name', e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name / Surname</label>
              <input
                type="text"
                value={formData.personal.surname}
                onChange={(e) => handleChange('personal', 'surname', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Job Role / Title</label>
              <input
                type="text"
                value={formData.personal.role}
                onChange={(e) => handleChange('personal', 'role', e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Years of Experience</label>
              <input
                type="number"
                value={formData.personal.experience}
                onChange={(e) => handleChange('personal', 'experience', Number(e.target.value))}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                value={formData.personal.email}
                onChange={(e) => handleChange('personal', 'email', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                value={formData.personal.phone}
                onChange={(e) => handleChange('personal', 'phone', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>City</label>
              <input
                type="text"
                value={formData.personal.city}
                onChange={(e) => handleChange('personal', 'city', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Country</label>
              <input
                type="text"
                value={formData.personal.country}
                onChange={(e) => handleChange('personal', 'country', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
            <label>Resume / CV Google Doc / PDF URL</label>
            <input
              type="text"
              value={formData.personal.resumeURL}
              onChange={(e) => handleChange('personal', 'resumeURL', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.cardSection}>
          <h2>Social Profiles</h2>
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label>GitHub URL</label>
              <input
                type="text"
                value={formData.social.github}
                onChange={(e) => handleChange('social', 'github', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>LinkedIn URL</label>
              <input
                type="text"
                value={formData.social.linkedin}
                onChange={(e) => handleChange('social', 'linkedin', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Twitter / X URL</label>
              <input
                type="text"
                value={formData.social.twitter}
                onChange={(e) => handleChange('social', 'twitter', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Instagram URL</label>
              <input
                type="text"
                value={formData.social.instagram}
                onChange={(e) => handleChange('social', 'instagram', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.cardSection}>
          <h2>Website SEO & Text</h2>
          <div className={styles.formGroup}>
            <label>Browser Tab Title</label>
            <input
              type="text"
              value={formData.metadata.title}
              onChange={(e) => handleChange('metadata', 'title', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hero Description</label>
            <textarea
              value={formData.metadata.description}
              onChange={(e) => handleChange('metadata', 'description', e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Footer / Verse Quote</label>
            <textarea
              value={formData.content.verse}
              onChange={(e) => handleChange('content', 'verse', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.cardSection}>
          <h2>GitHub Auto-Sync (Vercel Persistence)</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1rem' }}>
            Enter a GitHub Personal Access Token (or set GITHUB_TOKEN in Vercel env) so Admin Panel updates automatically commit to your GitHub repository and redeploy Vercel permanently.
          </p>
          <div className={styles.formGroup}>
            <label>GitHub Personal Access Token (Optional)</label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={formData.githubToken || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, githubToken: e.target.value }))}
            />
          </div>
        </div>

        <button type="submit" className={styles.btnPrimary} style={{ maxWidth: '300px' }} disabled={saving}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
}
