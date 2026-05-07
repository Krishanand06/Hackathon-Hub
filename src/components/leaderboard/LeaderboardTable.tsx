import React from 'react';
import { Crown, Medal, Award, ExternalLink } from 'lucide-react';
import { LeaderboardEntry } from '../../types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={16} color="#d4a017" />;
  if (rank === 2) return <Medal size={16} color="#9e9e9e" />;
  if (rank === 3) return <Award size={16} color="#cd7f32" />;
  return null;
}

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: '#ffd700',
    2: '#c0c0c0',
    3: '#cd7f32',
  };
  return (
    <span className="rank-badge" style={{
      backgroundColor: rank <= 3 ? colors[rank] + '22' : 'var(--color-bg-secondary)',
      color: rank <= 3 ? colors[rank] : 'var(--color-text-muted)',
      border: `1px solid ${rank <= 3 ? colors[rank] + '44' : 'transparent'}`,
      fontWeight: rank <= 3 ? 700 : 500,
    }}>
      {rank}
    </span>
  );
}

export default function LeaderboardTable({ entries, isLoading }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="gh-card">
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: '6px', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
            </div>
            <div className="skeleton" style={{ height: 14, width: 48, borderRadius: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="gh-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        No submissions yet. Be the first to submit!
      </div>
    );
  }

  return (
    <div className="gh-card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '52px 1fr 120px 100px',
        padding: '8px 16px', borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        <span>Rank</span>
        <span>Team / Project</span>
        <span style={{ textAlign: 'center' }}>Members</span>
        <span style={{ textAlign: 'right' }}>Score</span>
      </div>

      {entries.map((entry) => (
        <div
          key={entry.teamId}
          style={{
            display: 'grid', gridTemplateColumns: '52px 1fr 120px 100px',
            padding: '12px 16px', borderBottom: '1px solid var(--color-border)',
            alignItems: 'center',
            backgroundColor: entry.rank === 1 ? 'rgba(212, 160, 23, 0.05)' : 'transparent',
            transition: 'background-color 0.1s',
          }}
          onMouseEnter={e => { if (entry.rank !== 1) e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = entry.rank === 1 ? 'rgba(212, 160, 23, 0.05)' : 'transparent'; }}
        >
          {/* Rank */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RankBadge rank={entry.rank} />
            <RankIcon rank={entry.rank} />
          </div>

          {/* Team & Project */}
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {entry.teamName}
              <a href="#" style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}>
                <ExternalLink size={12} />
              </a>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {entry.projectTitle}
            </div>
          </div>

          {/* Members */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex' }}>
              {entry.members.slice(0, 4).map((m, i) => (
                <div key={i} className="avatar" style={{
                  width: '22px', height: '22px', fontSize: '9px',
                  marginLeft: i > 0 ? '-5px' : 0,
                  border: '2px solid var(--color-bg-primary)',
                  zIndex: 4 - i,
                }}>
                  {m[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '16px', fontWeight: 700,
              color: entry.rank === 1 ? '#d4a017' : entry.rank === 2 ? '#9e9e9e' : entry.rank === 3 ? '#cd7f32' : 'var(--color-text-primary)',
            }}>
              {entry.totalScore.toFixed(1)}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '2px' }}>/100</span>
          </div>
        </div>
      ))}
    </div>
  );
}
