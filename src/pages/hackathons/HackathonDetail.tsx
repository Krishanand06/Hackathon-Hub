import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, Globe, ArrowLeft, Clock, Tag } from 'lucide-react';
import { mockHackathons, mockTeams } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/ui/Modal';
import TeamCard from '../../components/teams/TeamCard';
import api from '../../api/client';
import { Hackathon, Team } from '../../types';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const statusColors: Record<string, string> = {
  OPEN: 'gh-badge-green', UPCOMING: 'gh-badge-yellow',
  IN_PROGRESS: 'gh-badge-blue', JUDGING: 'gh-badge-purple', COMPLETED: 'gh-badge-gray',
};

export default function HackathonDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [hackathon, setHackathon] = useState<Hackathon | undefined>(() => mockHackathons.find(h => h.id === Number(id)));
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [registered, setRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'schedule'>('overview');

  React.useEffect(() => {
    if (!id) return;
    api.get<Hackathon>(`/hackathons/public/${id}`)
      .then(response => setHackathon(response.data))
      .catch(() => setHackathon(mockHackathons.find(h => h.id === Number(id))));

    api.get<Team[]>('/teams')
      .then(response => setTeams(response.data))
      .catch(() => setTeams(mockTeams));
  }, [id]);

  if (!hackathon) {
    return (
      <div className="page-container" style={{ paddingTop: 40 }}>
        <div className="gh-card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Hackathon not found. <Link to="/hackathons">← Back to list</Link>
        </div>
      </div>
    );
  }

  const relatedTeams = teams.filter(t => t.hackathonId === hackathon.id);
  const fillPct = Math.min(100, Math.round((hackathon.currentParticipants / hackathon.maxParticipants) * 100));

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <Link to="/hackathons" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
        <ArrowLeft size={14} /> Back to Hackathons
      </Link>

      <div className="sidebar-layout">
        {/* Main content */}
        <div style={{ gridColumn: '1 / -1' }}>
          {/* Header */}
          <div className="gh-card" style={{ padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{hackathon.title}</h1>
                  <span className={`gh-badge ${statusColors[hackathon.status]}`}>{hackathon.status.replace('_', ' ')}</span>
                </div>
                <p style={{ margin: '0 0 12px', color: 'var(--color-text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>
                  Theme: {hackathon.theme}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <Calendar size={13} /> {formatDate(hackathon.startDate)} – {formatDate(hackathon.endDate)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {hackathon.isOnline ? <Globe size={13} /> : <MapPin size={13} />}
                    {hackathon.isOnline ? 'Online' : hackathon.venue}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <Users size={13} /> Team: {hackathon.minTeamSize}–{hackathon.maxTeamSize} members
                  </span>
                  {hackathon.prizePool && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
                      <Trophy size={13} /> Prize: {hackathon.prizePool}
                    </span>
                  )}
                </div>
              </div>

              {/* Register button */}
              {hackathon.status === 'OPEN' && (
                <div>
                  {registered ? (
                    <span className="gh-badge gh-badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>✓ Registered</span>
                  ) : (
                    <button
                      onClick={() => isAuthenticated ? setShowModal(true) : window.location.href = '/login'}
                      className="gh-btn gh-btn-primary"
                      style={{ padding: '8px 20px', fontSize: '14px' }}
                    >
                      Register Now
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Progress */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {hackathon.currentParticipants} / {hackathon.maxParticipants} participants registered
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{fillPct}% full</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${fillPct}%`,
                  backgroundColor: fillPct >= 90 ? 'var(--color-danger)' : 'var(--color-accent)',
                }} />
              </div>
            </div>

            {/* Registration deadline */}
            {hackathon.status === 'OPEN' && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-warning)' }}>
                <Clock size={12} /> Registration closes: {formatDate(hackathon.registrationDeadline)}
              </div>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
              {hackathon.tags.map(tag => (
                <span key={tag} className="gh-badge gh-badge-gray" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-nav" style={{ marginBottom: '16px' }}>
            {(['overview', 'teams', 'schedule'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'teams' && <span className="tab-count">{relatedTeams.length}</span>}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="gh-card" style={{ padding: '24px' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 600 }}>About this Hackathon</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{hackathon.description}</p>
              <hr className="gh-divider" style={{ margin: '20px 0' }} />
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600 }}>Organized by</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>{hackathon.organizerName}</p>
            </div>
          )}

          {activeTab === 'teams' && (
            <div>
              {relatedTeams.length === 0 ? (
                <div className="gh-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No teams yet. <Link to="/teams">Browse all teams</Link> or create one.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {relatedTeams.map(t => <TeamCard key={t.id} team={t} />)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="gh-card" style={{ padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Schedule</h2>
              {[
                { time: hackathon.startDate, event: 'Hackathon Kick-off & Team Formation' },
                { time: hackathon.startDate, event: 'Problem Statements Released' },
                { time: hackathon.endDate, event: 'Submission Deadline' },
                { time: hackathon.endDate, event: 'Judging & Evaluation' },
                { time: hackathon.endDate, event: 'Winners Announced' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderLeft: '2px solid var(--color-border)', paddingLeft: '16px', marginLeft: '8px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{formatDate(item.time)}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Register modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register for Hackathon"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="gh-btn gh-btn-secondary">Cancel</button>
            <button onClick={() => {
              if (user) {
                api.post('/registrations', { userId: user.id, hackathonId: hackathon.id }).catch(() => undefined);
              }
              setRegistered(true);
              setShowModal(false);
            }} className="gh-btn gh-btn-primary">
              Confirm Registration
            </button>
          </>
        }
      >
        <p style={{ margin: '0 0 12px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          You're registering for <strong>{hackathon.title}</strong>.
        </p>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '13px' }}>
          You can join or create a team after registering. Team size: {hackathon.minTeamSize}–{hackathon.maxTeamSize} members.
        </p>
      </Modal>
    </div>
  );
}
