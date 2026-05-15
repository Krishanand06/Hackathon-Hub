import React from 'react';
import { Star, Calendar, Briefcase } from 'lucide-react';
import { Mentor } from '../../types';
import { SkillBadge } from '../ui/SkillBadge';

interface MentorCardProps {
  mentor: Mentor;
  onBook?: (mentor: Mentor) => void;
}

export default function MentorCard({ mentor, onBook }: MentorCardProps) {
  const availableCount = mentor.availableSlots.filter(s => !s.booked).length;

  return (
    <div className="gh-card" style={{ padding: '16px', transition: 'border-color 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
    >
      {/* Profile header */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '18px', flexShrink: 0 }}>
          {mentor.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
            {mentor.fullName}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Briefcase size={11} />
            {mentor.designation} @ {mentor.company}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{mentor.rating.toFixed(1)}</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>({mentor.totalSessions} sessions)</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 12px', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {mentor.bio}
        </p>
      )}

      {/* Expertise */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
        {mentor.expertise.slice(0, 4).map(e => (
          <SkillBadge key={e} skill={e} size="sm" />
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} />
          {availableCount > 0
            ? <span style={{ color: 'var(--color-success)' }}>{availableCount} slots available</span>
            : <span style={{ color: 'var(--color-text-muted)' }}>Unavailable</span>
          }
        </span>
        {onBook && availableCount > 0 && (
          <button onClick={() => onBook(mentor)} className="gh-btn gh-btn-primary" style={{ fontSize: '12px', padding: '3px 12px' }}>
            Book Session
          </button>
        )}
      </div>
    </div>
  );
}
