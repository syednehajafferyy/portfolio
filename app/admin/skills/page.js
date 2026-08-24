'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.scss';

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [skillForm, setSkillForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '/icon/icon-js.svg',
    icon: 'IconJS'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSkills(data);
      }
    } catch (err) {
      setError('Failed to load skills');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setSkillForm({ ...skills[index] });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setSkillForm({
      title: '',
      subtitle: '',
      description: '',
      image: '/icon/icon-js.svg',
      icon: 'IconJS'
    });
  };

  const handleDelete = async (index) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    const updated = skills.filter((_, i) => i !== index);
    await saveSkills(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updated;
    if (editingIndex !== null) {
      updated = [...skills];
      updated[editingIndex] = skillForm;
    } else {
      updated = [...skills, skillForm];
    }
    await saveSkills(updated);
    handleCancel();
  };

  const saveSkills = async (newSkills) => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkills),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSkills(newSkills);
        setMessage('Skills updated successfully!');
      } else {
        setError(data.error || 'Failed to save skills');
      }
    } catch (err) {
      setError('Error saving skills');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.dashHeader}>
        <h1>Manage Skills</h1>
        <p>Add, edit, or remove technical skills displayed on your site.</p>
      </div>

      {message && <div className={styles.successBanner}>{message}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.cardSection}>
        <h2>{editingIndex !== null ? 'Edit Skill' : 'Add New Skill'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label>Skill Title</label>
              <input
                type="text"
                placeholder="e.g. JavaScript, React JS, Next.js"
                value={skillForm.title}
                onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Subtitle / Frameworks</label>
              <input
                type="text"
                placeholder="e.g. Vanilla, jQuery, Node.js"
                value={skillForm.subtitle}
                onChange={(e) => setSkillForm({ ...skillForm, subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Describe your expertise in this technology..."
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              required
            />
          </div>

          <div className={styles.grid2Col}>
            <div className={styles.formGroup}>
              <label>Icon Identifier</label>
              <input
                type="text"
                placeholder="e.g. IconJS, IconReact, IconCSS"
                value={skillForm.icon}
                onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image Icon Path</label>
              <input
                type="text"
                placeholder="e.g. /icon/icon-js.svg"
                value={skillForm.image}
                onChange={(e) => setSkillForm({ ...skillForm, image: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className={styles.btnPrimary} style={{ maxWidth: '200px' }} disabled={saving}>
              {editingIndex !== null ? 'Update Skill' : 'Add Skill'}
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
        <h2>Skill List ({skills.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.subtitle}</td>
                  <td style={{ maxWidth: '350px' }}>{item.description}</td>
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
