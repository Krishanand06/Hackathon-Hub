import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Code2, ArrowRight, Zap, Globe, Calendar } from 'lucide-react';
import { mockHackathons } from '../data/mockData';
import HackathonCard from '../components/hackathons/HackathonCard';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { Hackathon } from '../types';

const stats = [
  { label: 'Hackathons Hosted', value: '24+', icon: <Trophy size={18} />, color: 'var(--color-brand)' },
  { label: 'Students Registered', value: '3,200+', icon: <Users size={18} />, color: 'var(--color-accent)' },
  { label: 'Projects Submitted', value: '890+', icon: <Code2 size={18} />, color: 'var(--color-success)' },
  { label: 'Prize Money Awarded', value: 'AED 500K+', icon: <Zap size={18} />, color: 'var(--color-done)' },
];

const features = [
  {
    icon: <Users size={20} />,
    title: 'Team Matchmaking',
    desc: 'Find teammates by skill. Our algorithm suggests the best matches for your hackathon.',
    accent: 'var(--color-accent)',
  },
  {
    icon: <Calendar size={20} />,
    title: 'Mentor Booking',
    desc: 'Book 1:1 sessions with industry mentors from Google, Microsoft, Stripe and more.',
    accent: 'var(--color-brand)',
  },
  {
    icon: <Trophy size={20} />,
    title: 'Live Leaderboard',
    desc: 'Track scores in real-time as judges evaluate submissions during the hackathon.',
    accent: 'var(--color-success)',
  },
  {
    icon: <Globe size={20} />,
    title: 'Resources Library',
    desc: 'Starter templates, datasets, pitch decks, and tutorials — all in one place.',
    accent: 'var(--color-done)',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [hackathons, setHackathons] = React.useState<Hackathon[]>(mockHackathons);

  React.useEffect(() => {
    api.get<Hackathon[]>('/hackathons')
      .then(response => setHackathons(response.data))
      .catch(() => setHackathons(mockHackathons));
  }, []);

  const featured = hackathons.filter(h => h.status === 'OPEN' || h.status === 'UPCOMING').slice(0, 3);

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div
        className="bg-grid-pattern"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border)',
          padding: '72px 0 56px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial glow — light mode accent pop */}
        <div style={{
          position: 'absolute',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse at top, rgba(227,98,9,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="page-container" style={{ position: 'relative' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'var(--color-brand-subtle)',
            border: '1px solid var(--color-brand)',
            borderRadius: '20px', padding: '4px 12px',
            fontSize: '12px', color: 'var(--color-brand)',
            marginBottom: '24px', fontWeight: 600,
          }}>
            <span className="status-dot status-dot-live" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-brand)', display: 'inline-block' }} />
            6 hackathons open for registration
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700, margin: '0 0 16px',
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
          }}>
            The Hackathon Platform<br />
            for{' '}
            <span style={{
              color: 'var(--color-brand)',
              borderBottom: '3px solid var(--color-brand)',
              paddingBottom: '2px',
            }}>
              BITS Students
            </span>
          </h1>

          <p style={{
            fontSize: '16px', color: 'var(--color-text-secondary)',
            maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6,
          }}>
            Discover hackathons, form teams with skill-based matchmaking, submit projects,
            and compete on live leaderboards — all in one place.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/hackathons" className="gh-btn gh-btn-primary" style={{ padding: '10px 20px', fontSize: '15px', gap: '8px' }}>
              Browse Hackathons <ArrowRight size={16} />
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="gh-btn gh-btn-secondary" style={{ padding: '10px 20px', fontSize: '15px' }}>
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '0' }}>
        <div className="page-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', padding: '24px 16px',
                borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
                borderTop: `3px solid ${s.color}`,
              }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Hackathons ───────────────────────────────── */}
      <div className="page-container" style={{ marginTop: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            {/* Section label pill */}
            <div style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-brand-subtle)',
              color: 'var(--color-brand)',
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.8px',
              padding: '2px 8px', borderRadius: '4px',
              marginBottom: '6px',
            }}>Now Open</div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Open & Upcoming Hackathons</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '13px' }}>Register before spots fill up</p>
          </div>
          <Link to="/hackathons" className="gh-btn gh-btn-secondary" style={{ fontSize: '13px' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {featured.map(h => <HackathonCard key={h.id} hackathon={h} />)}
        </div>
      </div>

      {/* ── Feature highlights ───────────────────────────────── */}
      <div className="page-container" style={{ marginTop: '56px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px', textAlign: 'center' }}>
          Everything you need to hack
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '24px' }}>
          One platform for the full hackathon journey
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} className="gh-card" style={{
              padding: '20px',
              borderLeft: `3px solid ${f.accent}`,
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ color: f.accent, marginBottom: '10px' }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
