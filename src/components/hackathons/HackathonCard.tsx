import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Trophy, Clock, Globe } from 'lucide-react';
import { Hackathon, HackathonStatus } from '../../types';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const statusConfig: Record<HackathonStatus, { label: string; className: string }> = {
  UPCOMING: { label: 'Upcoming', className: 'gh-badge-yellow' },
  OPEN: { label: 'Open', className: 'gh-badge-green' },
  IN_PROGRESS: { label: 'In Progress', className: 'gh-badge-blue' },
  JUDGING: { label: 'Judging', className: 'gh-badge-purple' },
  COMPLETED: { label: 'Completed', className: 'gh-badge-gray' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days === 0) return 'Today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const status = statusConfig[hackathon.status];
  const regDeadline = daysUntil(hackathon.registrationDeadline);
  const fillPct = Math.min(100, Math.round((hackathon.currentParticipants / hackathon.maxParticipants) * 100));

  return (
    <div className="gh-card gh-card-interactive" style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
        <Link
          to={`/hackathons/${hackathon.id}`}
          style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-accent)', lineHeight: 1.3 }}
        >
          {hackathon.title}
        </Link>
        <span className={`gh-badge ${status.className}`} style={{ flexShrink: 0 }}>{status.label}</span>
      </div>

      {/* Description */}
      <p style={{
        color: 'var(--color-text-secondary)', fontSize: '13px',
        margin: '0 0 12px', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {hackathon.description}
      </p>

      {/* Tags */}
      {hackathon.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {hackathon.tags.slice(0, 4).map(tag => (
            <span key={tag} className="gh-badge gh-badge-gray" style={{ fontSize: '11px' }}>{tag}</span>
          ))}
          {hackathon.tags.length > 4 && (
            <span className="gh-badge gh-badge-gray" style={{ fontSize: '11px' }}>+{hackathon.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <Calendar size={12} />
          {formatDate(hackathon.startDate)} – {formatDate(hackathon.endDate)}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          {hackathon.isOnline ? <Globe size={12} /> : <MapPin size={12} />}
          {hackathon.isOnline ? 'Online' : hackathon.venue || 'TBD'}
        </span>
        {hackathon.prizePool && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-success)' }}>
            <Trophy size={12} />
            {hackathon.prizePool}
          </span>
        )}
      </div>

      {/* Participants progress */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} />
            {hackathon.currentParticipants} / {hackathon.maxParticipants} participants
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{fillPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${fillPct}%`,
            backgroundColor: fillPct >= 90 ? 'var(--color-danger)' : fillPct >= 70 ? 'var(--color-warning)' : 'var(--color-accent)',
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          {hackathon.status === 'OPEN' && regDeadline ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)' }}>
              <Clock size={12} /> Reg. closes in {regDeadline}
            </span>
          ) : (
            <span>Teams: {hackathon.minTeamSize}–{hackathon.maxTeamSize} members</span>
          )}
        </div>
        <Link to={`/hackathons/${hackathon.id}`} className="gh-btn gh-btn-primary" style={{ fontSize: '12px', padding: '3px 12px' }}>
          View Details
        </Link>
      </div>
    </div>
  );
}
