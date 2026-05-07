import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '24px', paddingBottom: '48px' }}>
        <Outlet />
      </main>
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '20px 0',
        color: 'var(--color-text-muted)',
        fontSize: '12px',
      }}>
        <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>© 2025 BITS Hackathon Hub. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'var(--color-text-muted)' }}>Terms</a>
            <a href="#" style={{ color: 'var(--color-text-muted)' }}>Privacy</a>
            <a href="#" style={{ color: 'var(--color-text-muted)' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
