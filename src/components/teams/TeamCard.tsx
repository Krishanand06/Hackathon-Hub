import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Lock, Unlock } from 'lucide-react';
import { Team } from '../../types';
import { SkillBadge } from '../ui/SkillBadge';

interface TeamCardProps {
  team: Team;
  onJoin?: (teamId: number) => void;
  currentUserId?: number;
}

export default function TeamCard({ team, onJoin, currentUserId }: TeamCardProps) {
  const isMember = team.members.some(m => m.userId === currentUserId);
  const isFull = team.members.length >= team.maxSize;

  return (
    <div className="gh-card gh-card-interactive" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <Link to={`/teams/${team.id}`} style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-accent)' }}>
          {team.name}
        </Link>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          {team.isOpen ? <Unlock size={12} color="var(--color-success)" /> : <Lock size={12} color="var(--color-danger)" />}
          {team.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Hackathon */}
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
        📍 {team.hackathonTitle}
      </p>

      {/* Description */}
      {team.description && (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {team.description}
        </p>
      )}

      {/* Required Skills */}
      {team.requiredSkills.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Looking for
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {team.requiredSkills.slice(0, 5).map(s => (
              <SkillBadge key={s} skill={s} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Members */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex' }}>
          {team.members.slice(0, 4).map((m, i) => (
            <div key={m.id} className="avatar" style={{
              width: '24px', height: '24px', fontSize: '10px',
              marginLeft: i > 0 ? '-6px' : 0,
              border: '2px solid var(--color-bg-primary)',
              zIndex: 4 - i,
            }}>
              {m.fullName[0]}
            </div>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={12} />
          {team.members.length}/{team.maxSize} members
        </span>
        {isMember && <span className="gh-badge gh-badge-green" style={{ fontSize: '10px' }}>Joined</span>}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/teams/${team.id}`} className="gh-btn gh-btn-secondary" style={{ fontSize: '12px', padding: '3px 12px', flex: 1, justifyContent: 'center' }}>
          View Team
        </Link>
        {!isMember && team.isOpen && !isFull && onJoin && (
          <button onClick={() => onJoin(team.id)} className="gh-btn gh-btn-primary" style={{ fontSize: '12px', padding: '3px 12px' }}>
            Request to Join
          </button>
        )}
        {isFull && !isMember && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>Full</span>
        )}
      </div>
    </div>
  );
}
