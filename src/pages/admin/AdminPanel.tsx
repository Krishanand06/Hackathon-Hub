import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockSubmissions, mockLeaderboard, mockTeams } from '../../data/mockData';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, ExternalLink, Plus, Save, Star, Trash2, Users } from 'lucide-react';
import { Hackathon, Submission, Team } from '../../types';
import api from '../../api/client';
import { hackathonApi } from '../../api/hackathons';

const CRITERIA = ['innovation', 'implementation', 'presentation', 'impact', 'feasibility'] as const;

const emptyHackathon = {
  title: '',
  theme: '',
  description: '',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  maxParticipants: '100',
  minTeamSize: '1',
  maxTeamSize: '4',
  prizePool: '',
  status: 'UPCOMING' as Hackathon['status'],
  isOnline: true,
  venue: '',
  tags: '',
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'submissions' | 'leaderboard' | 'hackathons'>('submissions');
  const [scores, setScores] = useState<Record<number, Record<string, number>>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [evaluated, setEvaluated] = useState<number[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [newHackathon, setNewHackathon] = useState(emptyHackathon);
  const [hackathonError, setHackathonError] = useState('');
  const [savingHackathon, setSavingHackathon] = useState(false);

  React.useEffect(() => {
    hackathonApi.getAll().then(response => setHackathons(response.data)).catch(() => setHackathonError('Could not load hackathons from the database.'));
    api.get<any[]>('/submissions')
      .then(response => {
        const mapped = (response.data || []).map((s: any) => ({
          ...s,
          hackathonId: s.hackathonId || s.hackathon?.id,
          teamId: s.teamId || s.team?.id,
          teamName: s.teamName || s.team?.name || 'Individual'
        }));
        setSubmissions(mapped);
      })
      .catch(() => setSubmissions(mockSubmissions));
    api.get<Team[]>('/teams').then(response => setTeams(response.data)).catch(() => setTeams(mockTeams));
  }, []);

  const tabs: Array<typeof activeTab> = isAdmin
    ? ['submissions', 'leaderboard', 'hackathons']
    : ['submissions', 'leaderboard'];

  const setScore = (subId: number, criterion: string, value: number) => {
    setScores(prev => ({ ...prev, [subId]: { ...(prev[subId] || {}), [criterion]: value } }));
  };

  const submitEvaluation = (subId: number) => {
    const currentScores = scores[subId] || {};
    api.post('/evaluations', {
      submissionId: subId,
      judgeId: user?.id ?? 3,
      feedback: feedbacks[subId] || '',
      innovation: currentScores.innovation || 0,
      implementation: currentScores.implementation || 0,
      presentation: currentScores.presentation || 0,
      impact: currentScores.impact || 0,
      feasibility: currentScores.feasibility || 0,
    }).catch(() => undefined);
    setEvaluated(prev => prev.includes(subId) ? prev : [...prev, subId]);
  };

  const totalScore = (subId: number) => {
    const currentScores = scores[subId] || {};
    return CRITERIA.reduce((acc, c) => acc + (currentScores[c] || 0), 0) / CRITERIA.length;
  };

  const addHackathon = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newHackathon.title || !newHackathon.startDate || !newHackathon.endDate || !newHackathon.registrationDeadline) return;

    setHackathonError('');
    setSavingHackathon(true);

    const payload = {
      title: newHackathon.title,
      theme: newHackathon.theme || 'General Innovation',
      description: newHackathon.description || 'Details will be updated soon.',
      startDate: toDateTime(newHackathon.startDate),
      endDate: toDateTime(newHackathon.endDate),
      registrationDeadline: toDateTime(newHackathon.registrationDeadline),
      maxParticipants: Number(newHackathon.maxParticipants) || 100,
      currentParticipants: 0,
      minTeamSize: Number(newHackathon.minTeamSize) || 1,
      maxTeamSize: Number(newHackathon.maxTeamSize) || 4,
      prizePool: newHackathon.prizePool || 'TBA',
      status: newHackathon.status,
      tags: newHackathon.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      venue: newHackathon.isOnline ? undefined : newHackathon.venue,
      isOnline: newHackathon.isOnline,
      organizerId: user?.id ?? 1,
      organizerName: user?.fullName ?? 'BITS Admin',
    };

    try {
      const response = await hackathonApi.create(payload);
      setHackathons(prev => [response.data, ...prev]);
      setNewHackathon(emptyHackathon);
    } catch (error) {
      console.error('Create hackathon failed', error);
      setHackathonError('Hackathon was not saved. Please confirm you are logged in as ADMIN and the backend is running.');
    } finally {
      setSavingHackathon(false);
    }
  };

  const deleteHackathon = async (hackathonId: number) => {
    setHackathonError('');
    try {
      await hackathonApi.delete(hackathonId);
      setHackathons(prev => prev.filter(hackathon => hackathon.id !== hackathonId));
    } catch (error) {
      console.error('Delete hackathon failed', error);
      setHackathonError('Hackathon was not deleted. Please confirm your admin session is valid.');
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600 }}>
          {isAdmin ? 'Admin Panel' : 'Judge Panel'}
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>
          {isAdmin
            ? 'Create hackathons, review submissions, and monitor leaderboard results.'
            : 'Review submitted project details and record judging scores.'}
        </p>
      </div>

      <div className="tab-nav" style={{ marginBottom: 24 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {submissions.map(submission => {
            const hackathon = hackathons.find(h => h.id === submission.hackathonId);
            const team = teams.find(t => t.id === submission.teamId);
            const isEvaluated = evaluated.includes(submission.id) || submission.status === 'EVALUATED';

            return (
              <article key={submission.id} className="gh-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>{submission.projectTitle}</h2>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
                      {team?.name ?? submission.teamName} - {hackathon?.title ?? 'Hackathon'} - Submitted {formatDateTime(submission.submittedAt)}
                    </p>
                  </div>
                  <span className={`gh-badge ${isEvaluated ? 'gh-badge-green' : 'gh-badge-yellow'}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isEvaluated && <CheckCircle size={12} />}
                    {isEvaluated ? 'Evaluated' : 'Pending'}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 14px' }}>
                  {submission.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
                  <InfoTile label="Team Members" value={team ? `${team.members.length}/${team.maxSize}` : 'Individual'} icon={<Users size={13} />} />
                  <InfoTile label="Status" value={submission.status.replace('_', ' ')} />
                  <InfoTile label="Current Score" value={submission.score ? `${submission.score}/100` : 'Not scored'} />
                </div>

                {team && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {team.members.map(member => (
                      <span key={member.id} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>
                        {member.fullName} - {member.role}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {submission.techStack.map(tech => (
                    <span key={tech} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>{tech}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  <a href={submission.repoUrl} target="_blank" rel="noreferrer" className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                    Repository <ExternalLink size={12} />
                  </a>
                  {submission.demoUrl && (
                    <a href={submission.demoUrl} target="_blank" rel="noreferrer" className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                      Demo <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 14 }}>
                    {CRITERIA.map(criterion => (
                      <div key={criterion}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                          {criterion} <span style={{ color: 'var(--color-accent)' }}>{scores[submission.id]?.[criterion] || 0}/20</span>
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={20}
                          value={scores[submission.id]?.[criterion] || 0}
                          onChange={event => setScore(submission.id, criterion, Number(event.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label className="gh-label">Judge Feedback</label>
                    <textarea
                      className="gh-input"
                      rows={2}
                      placeholder="Add notes for the team. This will save to MySQL when backend wiring is ready."
                      value={feedbacks[submission.id] || ''}
                      onChange={event => setFeedbacks(prev => ({ ...prev, [submission.id]: event.target.value }))}
                      style={{ resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      Draft total: <span style={{ color: 'var(--color-accent)' }}>{totalScore(submission.id).toFixed(1)}/20</span>
                    </span>
                    <button onClick={() => submitEvaluation(submission.id)} className="gh-btn gh-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Star size={14} /> Submit Evaluation
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activeTab === 'leaderboard' && <LeaderboardTable entries={mockLeaderboard} />}

      {activeTab === 'hackathons' && isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(0, 1.1fr)', gap: 18, alignItems: 'start' }}>
          <form onSubmit={addHackathon} className="gh-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>Add Hackathon</h2>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>
                Saves to the MySQL `hackathons` table.
              </p>
            </div>
            {hackathonError && (
              <div className="gh-badge gh-badge-red" style={{ whiteSpace: 'normal', lineHeight: 1.4 }}>
                {hackathonError}
              </div>
            )}

            <Field label="Title" value={newHackathon.title} onChange={value => setNewHackathon(prev => ({ ...prev, title: value }))} required />
            <Field label="Theme" value={newHackathon.theme} onChange={value => setNewHackathon(prev => ({ ...prev, theme: value }))} />
            <div>
              <label className="gh-label">Description</label>
              <textarea className="gh-input" rows={3} value={newHackathon.description} onChange={event => setNewHackathon(prev => ({ ...prev, description: event.target.value }))} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Start" type="date" value={newHackathon.startDate} onChange={value => setNewHackathon(prev => ({ ...prev, startDate: value }))} required />
              <Field label="End" type="date" value={newHackathon.endDate} onChange={value => setNewHackathon(prev => ({ ...prev, endDate: value }))} required />
            </div>
            <Field label="Registration Deadline" type="date" value={newHackathon.registrationDeadline} onChange={value => setNewHackathon(prev => ({ ...prev, registrationDeadline: value }))} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <Field label="Capacity" type="number" value={newHackathon.maxParticipants} onChange={value => setNewHackathon(prev => ({ ...prev, maxParticipants: value }))} />
              <Field label="Min Team" type="number" value={newHackathon.minTeamSize} onChange={value => setNewHackathon(prev => ({ ...prev, minTeamSize: value }))} />
              <Field label="Max Team" type="number" value={newHackathon.maxTeamSize} onChange={value => setNewHackathon(prev => ({ ...prev, maxTeamSize: value }))} />
            </div>
            <Field label="Prize Pool" value={newHackathon.prizePool} onChange={value => setNewHackathon(prev => ({ ...prev, prizePool: value }))} />
            <div>
              <label className="gh-label">Status</label>
              <select
                className="gh-input"
                value={newHackathon.status}
                onChange={event => setNewHackathon(prev => ({ ...prev, status: event.target.value as Hackathon['status'] }))}
              >
                <option value="UPCOMING">Upcoming</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="JUDGING">Judging</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <Field label="Tags" value={newHackathon.tags} onChange={value => setNewHackathon(prev => ({ ...prev, tags: value }))} placeholder="AI, Web, SQL" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
              <input type="checkbox" checked={newHackathon.isOnline} onChange={event => setNewHackathon(prev => ({ ...prev, isOnline: event.target.checked }))} />
              Online event
            </label>
            {!newHackathon.isOnline && (
              <Field label="Location" value={newHackathon.venue} onChange={value => setNewHackathon(prev => ({ ...prev, venue: value }))} />
            )}
            <button type="submit" className="gh-btn gh-btn-primary" disabled={savingHackathon} style={{ justifyContent: 'center', gap: 6 }}>
              <Plus size={14} /> {savingHackathon ? 'Saving...' : 'Add Hackathon'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hackathons.map(hackathon => (
              <div key={hackathon.id} className="gh-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{hackathon.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {hackathon.currentParticipants}/{hackathon.maxParticipants} participants - {hackathon.isOnline ? 'Online' : hackathon.venue}
                  </div>
                </div>
                <span className={`gh-badge ${statusClass(hackathon.status)}`}>{hackathon.status.replace('_', ' ')}</span>
                <button className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '3px 10px' }}>
                  <Save size={12} /> Manage
                </button>
                <button
                  onClick={() => deleteHackathon(hackathon.id)}
                  className="gh-btn gh-btn-secondary"
                  style={{ fontSize: 12, padding: '3px 10px', color: 'var(--color-danger)' }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function toDateTime(date: string) {
  return `${date}T00:00:00`;
}

function Field({ label, value, onChange, type = 'text', placeholder, required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="gh-label">{label}{required && <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>}</label>
      <input className="gh-input" type={type} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} required={required} />
    </div>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 6, padding: '9px 10px', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}

function statusClass(status: Hackathon['status']) {
  if (status === 'OPEN') return 'gh-badge-green';
  if (status === 'IN_PROGRESS') return 'gh-badge-blue';
  if (status === 'JUDGING') return 'gh-badge-purple';
  if (status === 'COMPLETED') return 'gh-badge-gray';
  return 'gh-badge-yellow';
}
