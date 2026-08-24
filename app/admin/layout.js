'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.scss';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <div className={styles.adminWrapper}>{children}</div>;
  }

  if (loading) {
    return (
      <div className={styles.adminWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ fontSize: '1.8rem', color: '#94a3b8' }}>Loading Admin Panel...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className={styles.adminWrapper}>
      <header className={styles.adminHeader}>
        <div className={styles.brand}>
          <h2>Portfolio <span>Admin</span></h2>
        </div>

        <nav className={styles.navTabs}>
          <Link href="/admin" className={pathname === '/admin' ? styles.active : ''}>
            Dashboard
          </Link>
          <Link href="/admin/metadata" className={pathname === '/admin/metadata' ? styles.active : ''}>
            Personal & Site Info
          </Link>
          <Link href="/admin/skills" className={pathname === '/admin/skills' ? styles.active : ''}>
            Skills
          </Link>
          <Link href="/admin/experience" className={pathname === '/admin/experience' ? styles.active : ''}>
            Experience
          </Link>
          <Link href="/admin/works" className={pathname === '/admin/works' ? styles.active : ''}>
            Projects
          </Link>
        </nav>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
            Live Site ↗
          </a>
          <button onClick={handleLogout} className={styles.btnDanger}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.adminMain}>{children}</main>
    </div>
  );
}
