import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun, Moon, Bell, ChevronDown, LogOut, User,
  Trophy, Menu, X, Code2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/hackathons', label: 'Hackathons' },
    { to: '/teams', label: 'Teams' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/mentors', label: 'Mentors' },
    { to: '/resources', label: 'Resources' },
  ];

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '16px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>
            <Code2 size={22} color="var(--color-brand)" />
            <span>BITS <span style={{ color: 'var(--color-brand)' }}>Hub</span></span>
          </Link>

          {/* Main nav (hidden only on small phones; wider tablets keep links visible) */}
          <nav
            className="hide-mobile nav-main-scroll"
            style={{ display: 'flex', gap: '4px', marginLeft: '8px', flex: '1 1 auto', minWidth: 0, overflowX: 'auto' }}
          >
            {navLinks.map(link => {
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '16px 10px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    borderBottom: isActive ? '2px solid var(--color-brand)' : '2px solid transparent',
                    transition: 'color 0.1s, border-color 0.15s',
                    textDecoration: 'none',
                    lineHeight: '24px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.borderBottomColor = 'var(--color-border)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.borderBottomColor = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '6px', border: 'none',
                backgroundColor: 'transparent', cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                transition: 'background-color 0.1s',
              }}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* User dropdown */}
                <div className="dropdown" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      padding: '2px 4px', borderRadius: '6px',
                    }}
                  >
                    <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                      {initials}
                    </div>
                    <ChevronDown size={14} color="var(--color-text-secondary)" />
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <div style={{ padding: '8px 16px 4px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '13px' }}>{user?.fullName}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{user?.email}</div>
                      </div>
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <User size={14} /> Dashboard
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <Trophy size={14} /> Admin panel
                        </Link>
                      )}
                      {user?.role === 'JUDGE' && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <Trophy size={14} /> Review workspace
                        </Link>
                      )}
                      <hr className="gh-divider" style={{ margin: '4px 0' }} />
                      <button className="dropdown-item" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--color-danger)' }}>
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" className="gh-btn gh-btn-secondary">Sign in</Link>
                <Link to="/register" className="gh-btn" style={{ backgroundColor: 'var(--color-brand)', borderColor: 'transparent', color: '#fff' }}>Sign up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'none', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '6px',
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
              className="show-mobile"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid var(--color-border)',
            padding: '8px 0 12px',
            display: 'flex', flexDirection: 'column', gap: '2px',
          }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-item"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .nav-main-scroll { flex-wrap: nowrap; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
        .nav-main-scroll::-webkit-scrollbar { height: 4px; }
        .nav-main-scroll::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 4px; }
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
