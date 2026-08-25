'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skillsCount: 0,
    experienceCount: 0,
    projectsCount: 0,
    ownerName: '',
    role: '',
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [metaRes, skillsRes, expRes, worksRes] = await Promise.all([
          fetch('/api/metadata'),
          fetch('/api/skills'),
          fetch('/api/companies'),
          fetch('/api/works'),
        ]);

        const meta = await metaRes.json();
        const skills = await skillsRes.json();
        const exp = await expRes.json();
        const works = await worksRes.json();

        setStats({
          skillsCount: Array.isArray(skills) ? skills.length : 0,
          experienceCount: Array.isArray(exp) ? exp.length : 0,
          projectsCount: Array.isArray(works) ? works.length : 0,
          ownerName: meta?.personal?.surname ? `${meta.personal.name} ${meta.personal.surname}` : (meta?.personal?.name || 'Neha Zehra'),
          role: meta?.personal?.role || 'Creative Developer',
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      <div className={styles.dashHeader}>
        <h1>Welcome, {stats.ownerName}!</h1>
        <p>Manage your portfolio website content, skills, background, and projects in one place.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Current Role</h3>
          <div className={styles.number} style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>
            {stats.role}
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>Total Skills</h3>
          <div className={styles.number}>{stats.skillsCount}</div>
          <Link href="/admin/skills" style={{ fontSize: '1.2rem', color: '#ffd600', display: 'inline-block', marginTop: '0.5rem' }}>
            Manage Skills →
          </Link>
        </div>

        <div className={styles.statCard}>
          <h3>Experience Records</h3>
          <div className={styles.number}>{stats.experienceCount}</div>
          <Link href="/admin/experience" style={{ fontSize: '1.2rem', color: '#ffd600', display: 'inline-block', marginTop: '0.5rem' }}>
            Manage Experience →
          </Link>
        </div>

        <div className={styles.statCard}>
          <h3>Portfolio Projects</h3>
          <div className={styles.number}>{stats.projectsCount}</div>
          <Link href="/admin/works" style={{ fontSize: '1.2rem', color: '#ffd600', display: 'inline-block', marginTop: '0.5rem' }}>
            Manage Projects →
          </Link>
        </div>
      </div>

      <div className={styles.cardSection}>
        <h2>Quick Management Shortcuts</h2>
        <div className={styles.grid2Col}>
          <div style={{ background: '#11141c', padding: '2rem', borderRadius: '8px', border: '1px solid #262c3a' }}>
            <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem' }}>Personal & Contact Details</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
              Update your name, role, bio, location, contact email, phone number, resume link, and social profiles.
            </p>
            <Link href="/admin/metadata" className={styles.btnSecondary} style={{ display: 'inline-block' }}>
              Edit Personal Info →
            </Link>
          </div>

          <div style={{ background: '#11141c', padding: '2rem', borderRadius: '8px', border: '1px solid #262c3a' }}>
            <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem' }}>Work Experience & Companies</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
              Add new work experience roles, internship history, company logos, dates, and bullet points.
            </p>
            <Link href="/admin/experience" className={styles.btnSecondary} style={{ display: 'inline-block' }}>
              Manage Experience →
            </Link>
          </div>

          <div style={{ background: '#11141c', padding: '2rem', borderRadius: '8px', border: '1px solid #262c3a' }}>
            <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem' }}>Skills & Frameworks</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
              Add, edit, or remove technical skills, frontend/backend tools, frameworks, and icons.
            </p>
            <Link href="/admin/skills" className={styles.btnSecondary} style={{ display: 'inline-block' }}>
              Manage Skills →
            </Link>
          </div>

          <div style={{ background: '#11141c', padding: '2rem', borderRadius: '8px', border: '1px solid #262c3a' }}>
            <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem' }}>Projects & Portfolio Works</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
              Add new projects, update project titles, descriptions, status badges, dates, and preview images.
            </p>
            <Link href="/admin/works" className={styles.btnSecondary} style={{ display: 'inline-block' }}>
              Manage Projects →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
