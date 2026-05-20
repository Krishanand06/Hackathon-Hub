import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockHackathons, mockTeams, mockSubmissions, mockMentors, mockLeaderboard } from '../../data/mockData';
import {
  ArrowRight, BarChart3, BookOpen, Calendar, CheckCircle, Clock, Code2,
  ExternalLink, Gavel, LayoutDashboard, Plus, Star, Trophy, Upload, Users,
} from 'lucide-react';
import api from '../../api/client';
import { Mentor, Submission } from '../../types';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getDaysLabel(date: string) {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Closed';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}

const MY_HACKATHON_IDS = [1, 2];
const MY_TEAM_IDS = [1];
const MY_SUBMISSION_IDS = [1];

const statusClass: Record<string, string> = {
  OPEN: 'gh-badge-green',
  UPCOMING: 'gh-badge-yellow',
  IN_PROGRESS: 'gh-badge-blue',
  JUDGING: 'gh-badge-purple',
  COMPLETED: 'gh-badge-gray',
};

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'MENTOR') {
    return <MentorDashboard />;
  }

  if (user?.role === 'JUDGE') {
    return <JudgeDashboard />;
  }

  const myHackathons = mockHackathons.filter(h => MY_HACKATHON_IDS.includes(h.id));
  const myTeams = mockTeams.filter(t => MY_TEAM_IDS.includes(t.id));
  const mySubmissions = mockSubmissions.filter(s => MY_SUBMISSION_IDS.includes(s.id));
  const mySessions = mockMentors.flatMap(mentor =>
    mentor.availableSlots
      .filter(slot => slot.booked && MY_TEAM_IDS.includes(slot.bookedByTeamId || 0))
      .map(slot => ({
        ...slot,
        mentorName: mentor.fullName,
        mentorRole: mentor.designation,
        mentorCompany: mentor.company,
        expertise: mentor.expertise.slice(0, 3),
      }))
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const initials = user?.fullName
    ? user.fullName.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const firstName = user?.fullName?.split(' ')[0] ?? 'Student';

  return (
    <div className="page-container">
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 24,
        paddingBottom: 18,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <div className="avatar" style={{
            width: 48,
            height: 48,
            fontSize: 18,
            backgroundColor: 'var(--color-brand-subtle)',
            color: 'var(--color-brand)',
            border: '2px solid var(--color-brand)',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
              Welcome back, {firstName}. Track your hackathons and mentor sessions here.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/hackathons" className="gh-btn gh-btn-primary" style={{ fontSize: 13 }}>
            <Trophy size={14} /> Browse Hackathons
          </Link>
          <Link to="/mentors" className="gh-btn gh-btn-secondary" style={{ fontSize: 13 }}>
            <BookOpen size={14} /> Book Mentor
          </Link>
        </div>
      </section>

      <div className="dashboard-focus-grid">
        <section className="gh-card" style={{ padding: 20, borderTop: '3px solid var(--color-brand)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: 0 }}>
                Enrolled Hackathons
              </p>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{myHackathons.length} active registrations</h2>
            </div>
            <Link to="/hackathons" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {myHackathons.length === 0 ? (
            <EmptyState
              icon={<Trophy size={28} />}
              title="No hackathons yet"
              body="Register for a hackathon to start your workspace."
              action={<Link to="/hackathons" className="gh-btn gh-btn-primary"><Plus size={14} /> Find Hackathons</Link>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {myHackathons.map(hackathon => {
                const team = myTeams.find(t => t.hackathonId === hackathon.id);
                const submission = mySubmissions.find(s => s.hackathonId === hackathon.id);
                return (
                  <article key={hackathon.id} style={{
                    paddingBottom: 14,
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <Link to={`/hackathons/${hackathon.id}`} style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-accent)' }}>
                          {hackathon.title}
                        </Link>
                        <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                          {hackathon.theme}
                        </p>
                      </div>
                      <span className={`gh-badge ${statusClass[hackathon.status]}`} style={{ flexShrink: 0 }}>
                        {hackathon.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: 10,
                      marginBottom: 12,
                    }}>
                      <MiniMetric icon={<Calendar size={13} />} label="Dates" value={`${formatDate(hackathon.startDate)} - ${formatDate(hackathon.endDate)}`} />
                      <MiniMetric icon={<Users size={13} />} label="Team" value={team ? `${team.name} (${team.members.length}/${team.maxSize})` : 'Not assigned'} />
                      <MiniMetric icon={<Clock size={13} />} label="Deadline" value={getDaysLabel(hackathon.endDate)} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Link to={`/hackathons/${hackathon.id}`} className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                        Details <ExternalLink size={12} />
                      </Link>
                      <Link to={submission ? '/dashboard' : '/submit'} className="gh-btn gh-btn-primary" style={{ fontSize: 12, padding: '4px 10px' }}>
                        {submission ? <CheckCircle size={12} /> : <Upload size={12} />}
                        {submission ? 'Submitted' : 'Submit Project'}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="gh-card" style={{ padding: 20, borderTop: '3px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: 0 }}>
                Mentor Sessions
              </p>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{mySessions.length} booked session{mySessions.length === 1 ? '' : 's'}</h2>
            </div>
            <Link to="/mentors" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              Book more <ArrowRight size={12} />
            </Link>
          </div>

          {mySessions.length === 0 ? (
            <EmptyState
              icon={<Star size={28} />}
              title="No sessions booked"
              body="Book a focused session with a mentor before your next milestone."
              action={<Link to="/mentors" className="gh-btn gh-btn-primary"><Plus size={14} /> Book Mentor</Link>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mySessions.map(session => (
                <article key={session.id} style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  padding: 14,
                  backgroundColor: 'var(--color-bg-secondary)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{session.mentorName}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 3 }}>
                        {session.mentorRole} at {session.mentorCompany}
                      </div>
                    </div>
                    <span className="gh-badge gh-badge-green" style={{ height: 22 }}>Confirmed</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 10 }}>
                    <Clock size={13} />
                    {formatDate(session.startTime)} at {formatTime(session.startTime)}
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {session.expertise.map(skill => (
                      <span key={skill} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>{skill}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="dashboard-support-grid">
        <section className="gh-card" style={{ padding: 16 }}>
          <PanelHeader icon={<Users size={15} />} title="Team Snapshot" action={<Link to="/teams">Manage</Link>} />
          {myTeams.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>You are not on a team yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myTeams.map(team => (
                <div key={team.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/teams/${team.id}`} style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-accent)' }}>{team.name}</Link>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 2 }}>{team.hackathonTitle}</div>
                  </div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{team.members.length}/{team.maxSize}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="gh-card" style={{ padding: 16 }}>
          <PanelHeader icon={<Code2 size={15} />} title="Submissions" action={<Link to="/submit">New</Link>} />
          {mySubmissions.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>No project submitted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mySubmissions.map(submission => (
                <div key={submission.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{submission.projectTitle}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 2 }}>{submission.teamName}</div>
                  </div>
                  <span style={{ color: 'var(--color-accent)', fontSize: 13, fontWeight: 700 }}>
                    {submission.score ? `${submission.score}/100` : submission.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="gh-card" style={{ padding: 16 }}>
          <PanelHeader icon={<Clock size={15} />} title="Quick Actions" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Link to="/hackathons" className="gh-btn gh-btn-secondary" style={{ justifyContent: 'center', fontSize: 12 }}>
              <Trophy size={13} /> Hackathons
            </Link>
            <Link to="/mentors" className="gh-btn gh-btn-secondary" style={{ justifyContent: 'center', fontSize: 12 }}>
              <BookOpen size={13} /> Mentors
            </Link>
            <Link to="/teams" className="gh-btn gh-btn-secondary" style={{ justifyContent: 'center', fontSize: 12 }}>
              <Users size={13} /> Teams
            </Link>
            <Link to="/submit" className="gh-btn gh-btn-secondary" style={{ justifyContent: 'center', fontSize: 12 }}>
              <Upload size={13} /> Submit
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-focus-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.85fr);
          gap: 20px;
          align-items: start;
          margin-bottom: 20px;
        }

        .dashboard-support-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 980px) {
          .dashboard-focus-grid,
          .dashboard-support-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .dashboard-focus-grid section,
          .dashboard-support-grid section {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

function JudgeDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);

  React.useEffect(() => {
    api.get<Submission[]>('/submissions')
      .then(res => setSubmissions(res.data))
      .catch(() => setSubmissions(mockSubmissions));
  }, []);

  const pending = submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW');
  const initials = user?.fullName
    ? user.fullName.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2)
    : 'J';
  const firstName = user?.fullName?.split(' ')[0] ?? 'Judge';

  const navTiles = [
    { to: '/leaderboard', label: 'Leaderboard', desc: 'Rankings and scores across hackathons', icon: <BarChart3 size={18} /> },
    { to: '/teams', label: 'Teams', desc: 'Browse teams and rosters', icon: <Users size={18} /> },
    { to: '/mentors', label: 'Mentors', desc: 'Mentor directory and sessions', icon: <BookOpen size={18} /> },
    { to: '/hackathons', label: 'Hackathons', desc: 'Events, deadlines, and briefs', icon: <Trophy size={18} /> },
  ] as const;

  return (
    <div className="page-container">
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 24,
        paddingBottom: 18,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <div className="avatar" style={{
            width: 48,
            height: 48,
            fontSize: 18,
            backgroundColor: 'var(--color-warning-subtle, rgba(234, 179, 8, 0.15))',
            color: 'var(--color-warning, #ca8a04)',
            border: '2px solid var(--color-warning, #ca8a04)',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Gavel size={22} style={{ flexShrink: 0 }} /> Judge dashboard
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
              Welcome, {firstName}. Review submissions and scores from here — use the workspace for rubrics and full lists.
            </p>
          </div>
        </div>
        <Link to="/admin" className="gh-btn gh-btn-primary" style={{ fontSize: 13 }}>
          <LayoutDashboard size={14} /> Open review workspace
        </Link>
      </section>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
        marginBottom: 24,
      }}>
        {navTiles.map(tile => (
          <Link
            key={tile.to}
            to={tile.to}
            className="gh-card"
            style={{
              padding: 16,
              textDecoration: 'none',
              color: 'inherit',
              borderTop: '3px solid var(--color-brand)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {tile.icon}
              <span style={{ fontWeight: 700, fontSize: 15 }}>{tile.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
              {tile.desc}
            </p>
          </Link>
        ))}
      </div>

      <div className="dashboard-focus-grid">
        <section className="gh-card" style={{ padding: 20, borderTop: '3px solid var(--color-brand)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: 0 }}>
                Review queue
              </p>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {pending.length} submission{pending.length === 1 ? '' : 's'} need scoring
              </h2>
            </div>
            <Link to="/admin" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              Score in workspace <ArrowRight size={12} />
            </Link>
          </div>
          {pending.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>
              No pending submissions. Check the leaderboard or workspace for evaluated projects.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map(sub => (
                <article key={sub.id} style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  padding: 14,
                  backgroundColor: 'var(--color-bg-secondary)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{sub.projectTitle}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 4 }}>
                        {sub.teamName} · Hackathon #{sub.hackathonId}
                      </div>
                    </div>
                    <span className="gh-badge gh-badge-yellow">{sub.status.replace('_', ' ')}</span>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link to="/admin" className="gh-btn gh-btn-primary" style={{ fontSize: 12, padding: '4px 10px' }}>
                      Open workspace
                    </Link>
                    {sub.repoUrl && (
                      <a href={sub.repoUrl} target="_blank" rel="noreferrer" className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                        Repo <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="gh-card" style={{ padding: 20, borderTop: '3px solid var(--color-success)' }}>
          <PanelHeader icon={<BarChart3 size={15} />} title="Leaderboard snapshot" action={<Link to="/leaderboard">Full board</Link>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockLeaderboard.slice(0, 5).map(row => (
              <div key={row.rank} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13 }}>
                <span style={{ color: 'var(--color-text-muted)', width: 28 }}>#{row.rank}</span>
                <span style={{ flex: 1, fontWeight: 600, minWidth: 0 }}>{row.teamName}</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{row.totalScore}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-focus-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.85fr);
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .dashboard-focus-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function MentorDashboard() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const mentor = mentors.find(m => m.userId === user?.id) ?? mockMentors[0];
  type MentorDashboardSlot = {
    id: number;
    startTime: string;
    endTime: string;
    booked: boolean;
    bookedByTeamId?: number;
  };
  const baseSlots: MentorDashboardSlot[] = mentor.availableSlots;
  const [slotStatus, setSlotStatus] = useState<Record<number, boolean>>(
    Object.fromEntries(baseSlots.map(slot => [slot.id, !slot.booked]))
  );
  const [customSlots, setCustomSlots] = useState<MentorDashboardSlot[]>([]);
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });

  const fetchMentors = React.useCallback(() => {
    if (!user?.id) return;
    setLoadingMentors(true);
    api.get<Mentor[]>('/mentors')
      .then(response => setMentors(Array.isArray(response.data) ? response.data : []))
      .catch(() => setMentors(mockMentors))
      .finally(() => setLoadingMentors(false));
  }, [user?.id]);

  React.useEffect(() => {
    fetchMentors();
    const interval = window.setInterval(fetchMentors, 15000);
    return () => window.clearInterval(interval);
  }, [fetchMentors]);

  const allSlots = [...baseSlots, ...customSlots].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const bookings = allSlots
    .filter(slot => slot.booked)
    .map(slot => {
      const team = mockTeams.find(t => t.id === slot.bookedByTeamId);
      return { ...slot, teamName: team?.name ?? 'Assigned team', hackathonTitle: team?.hackathonTitle ?? 'Hackathon' };
    });

  const availableSlots = allSlots.filter(slot => !slot.booked);

  const addSlot = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;

    const id = Date.now();
    const slot = {
      id,
      startTime: `${newSlot.date}T${newSlot.startTime}`,
      endTime: `${newSlot.date}T${newSlot.endTime}`,
      booked: false,
    };

    api.post('/mentor-slots', {
      mentorId: mentor.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }).then(response => {
      const savedSlot = { ...slot, id: response.data.id };
      setCustomSlots(prev => [...prev, savedSlot]);
      setSlotStatus(prev => ({ ...prev, [savedSlot.id]: true }));
    }).catch(() => {
      setCustomSlots(prev => [...prev, slot]);
      setSlotStatus(prev => ({ ...prev, [id]: true }));
    });
    setNewSlot({ date: '', startTime: '', endTime: '' });
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2)
    : 'M';

  return (
    <div className="page-container">
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 24,
        paddingBottom: 18,
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <div className="avatar" style={{
            width: 48,
            height: 48,
            fontSize: 18,
            backgroundColor: 'var(--color-success-subtle)',
            color: 'var(--color-success)',
            border: '2px solid var(--color-success)',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Mentor Dashboard</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
              Manage booked sessions and choose which slots are available to teams.
            </p>
          </div>
        </div>
        <Link to="/mentors" className="gh-btn gh-btn-secondary" style={{ fontSize: 13 }}>
          <BookOpen size={14} /> Public Mentor Page
        </Link>
      </section>

      <div className="dashboard-focus-grid">
        <section className="gh-card" style={{ padding: 20, borderTop: '3px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: 0 }}>
                Current Bookings
              </p>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{bookings.length} booked session{bookings.length === 1 ? '' : 's'}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={fetchMentors} className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '6px 10px' }}>
                Refresh
              </button>
              <span className="gh-badge gh-badge-green">{mentor.rating.toFixed(1)} rating</span>
            </div>
          </div>

          {bookings.length === 0 ? (
            <EmptyState
              icon={<Calendar size={28} />}
              title="No bookings yet"
              body="Teams will appear here when they book one of your available slots."
              action={<Link to="/mentors" className="gh-btn gh-btn-primary"><BookOpen size={14} /> View Profile</Link>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.map(slot => (
                <article key={slot.id} style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  padding: 14,
                  backgroundColor: 'var(--color-bg-secondary)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{slot.teamName}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 3 }}>{slot.hackathonTitle}</div>
                    </div>
                    <span className="gh-badge gh-badge-green" style={{ height: 22 }}>Confirmed</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13 }}>
                    <Clock size={13} />
                    {formatDate(slot.startTime)} at {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="gh-card" style={{ padding: 20, borderTop: '3px solid var(--color-brand)' }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-brand)', textTransform: 'uppercase', letterSpacing: 0 }}>
              Availability
            </p>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Choose Available Slots</h2>
          </div>

          <form onSubmit={addSlot} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: 8, marginBottom: 16 }}>
            <input className="gh-input" type="date" value={newSlot.date} onChange={event => setNewSlot(prev => ({ ...prev, date: event.target.value }))} />
            <input className="gh-input" type="time" value={newSlot.startTime} onChange={event => setNewSlot(prev => ({ ...prev, startTime: event.target.value }))} />
            <input className="gh-input" type="time" value={newSlot.endTime} onChange={event => setNewSlot(prev => ({ ...prev, endTime: event.target.value }))} />
            <button className="gh-btn gh-btn-primary" type="submit" style={{ justifyContent: 'center' }}>
              <Plus size={14} />
            </button>
          </form>

          {availableSlots.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>No open slots. Add a slot above when you are available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableSlots.map(slot => (
                <label key={slot.id} className="gh-card" style={{
                  padding: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                  backgroundColor: slotStatus[slot.id] ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
                }}>
                  <span>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>
                      {formatDate(slot.startTime)}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    {slotStatus[slot.id] ? 'Available' : 'Hidden'}
                    <input
                      type="checkbox"
                      checked={slotStatus[slot.id] ?? true}
                      onChange={event => {
                        const isAvailable = event.target.checked;
                        api.patch(`/mentor-slots/${slot.id}`, { isAvailable }).catch(() => undefined);
                        setSlotStatus(prev => ({ ...prev, [slot.id]: isAvailable }));
                      }}
                    />
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="dashboard-support-grid">
        <section className="gh-card" style={{ padding: 16 }}>
          <PanelHeader icon={<Star size={15} />} title="Mentor Profile" action={<Link to="/mentors">Preview</Link>} />
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>{mentor.designation}</strong>
            <br />
            {mentor.company}
          </div>
        </section>

        <section className="gh-card" style={{ padding: 16 }}>
          <PanelHeader icon={<Code2 size={15} />} title="Expertise" />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {mentor.expertise.map(skill => (
              <span key={skill} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="gh-card" style={{ padding: 16 }}>
          <PanelHeader icon={<Clock size={15} />} title="Session Stats" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <MiniMetric icon={<CheckCircle size={13} />} label="Total" value={String(mentor.totalSessions)} />
            <MiniMetric icon={<Calendar size={13} />} label="Open" value={String(availableSlots.filter(slot => slotStatus[slot.id]).length)} />
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-focus-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.9fr);
          gap: 20px;
          align-items: start;
          margin-bottom: 20px;
        }

        .dashboard-support-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 980px) {
          .dashboard-focus-grid,
          .dashboard-support-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 6,
      padding: '9px 10px',
      minWidth: 0,
      backgroundColor: 'var(--color-bg-secondary)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ color: 'var(--color-text-primary)', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action: React.ReactNode }) {
  return (
    <div style={{
      minHeight: 220,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'var(--color-text-muted)',
      border: '1px dashed var(--color-border)',
      borderRadius: 6,
      padding: 24,
    }}>
      <div style={{ color: 'var(--color-brand)', marginBottom: 10 }}>{icon}</div>
      <div style={{ color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: 4 }}>{title}</div>
      <p style={{ margin: '0 0 14px', fontSize: 13, maxWidth: 280, lineHeight: 1.5 }}>{body}</p>
      {action}
    </div>
  );
}

function PanelHeader({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--color-text-muted)', display: 'flex' }}>{icon}</span>
        {title}
      </h2>
      {action && <div style={{ fontSize: 12 }}>{action}</div>}
    </div>
  );
}
