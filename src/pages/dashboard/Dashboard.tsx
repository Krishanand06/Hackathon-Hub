import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockHackathons, mockTeams, mockSubmissions, mockMentors } from '../../data/mockData';
import {
  Trophy, Users, Code2, Calendar, Clock, ArrowRight,
  Plus, Upload, BookOpen, Star, CheckCircle, AlertCircle
} from 'lucide-react';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Mock: pretend current user is registered for hackathons 1 & 2, on team 1
const MY_HACKATHON_IDS = [1, 2];
const MY_TEAM_IDS = [1];
const MY_SUBMISSION_IDS = [1];

export default function Dashboard() {
  const { user } = useAuth();

  const myHackathons = mockHackathons.filter(h => MY_HACKATHON_IDS.includes(h.id));
  const myTeams = mockTeams.filter(t => MY_TEAM_IDS.includes(t.id));
  const mySubmissions = mockSubmissions.filter(s => MY_SUBMISSION_IDS.includes(s.id));
  const mySessions = mockMentors.flatMap(m => 
    m.availableSlots.filter(slot => slot.isBooked && MY_TEAM_IDS.includes(slot.bookedByTeamId || 0))
    .map(slot => ({ ...slot, mentorName: m.fullName }))
  );

  const upcomingDeadlines = myHackathons
    .filter(h => h.status !== 'COMPLETED')
    .map(h => ({ title: h.title, date: h.endDate, type: 'Submission deadline' }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const roleColors: Record<string, string> = {
    STUDENT: 'gh-badge-blue', MENTOR: 'gh-badge-green',
    JUDGE: 'gh-badge-purple', ADMIN: 'gh-badge-red',
  };

  const quickActions = [
    { label: 'Browse Hackathons', icon: <Trophy size={15} />, to: '/hackathons', style: 'primary' },
    { label: 'Find a Team', icon: <Users size={15} />, to: '/teams', style: 'secondary' },
    { label: 'Submit Project', icon: <Upload size={15} />, to: '/submit', style: 'secondary' },
    { label: 'Book Mentor', icon: <BookOpen size={15} />, to: '/mentors', style: 'secondary' },
  ];

  return (
    <div className="page-container">
      {/* Welcome header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderLeft: '3px solid var(--color-brand)', paddingLeft: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="avatar" style={{ width: 48, height: 48, fontSize: 18, backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', border: '2px solid var(--color-brand)' }}>{initials}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                Hey, {user?.fullName?.split(' ')[0] ?? 'Student'} 👋
              </h1>
              <span className={`gh-badge ${roleColors[user?.role ?? 'STUDENT']}`} style={{ fontSize: 11 }}>
                {user?.role ?? 'STUDENT'}
              </span>
            </div>
            <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
              {user?.email}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {quickActions.map(a => (
            <Link key={a.label} to={a.to}
              className={`gh-btn gh-btn-${a.style}`}
              style={{ fontSize: 13, padding: '5px 12px', gap: 6, display: 'none' }}
            />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 1, backgroundColor: 'var(--color-border)',
        border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden',
        marginBottom: 28,
      }}>
        {[
          { label: 'Hackathons', value: myHackathons.length, icon: <Trophy size={16} />, color: 'var(--color-brand)' },
          { label: 'Teams', value: myTeams.length, icon: <Users size={16} />, color: 'var(--color-accent)' },
          { label: 'Submissions', value: mySubmissions.length, icon: <Code2 size={16} />, color: 'var(--color-done)' },
          { label: 'Mentor Sessions', value: mySessions.length, icon: <Star size={16} />, color: 'var(--color-success)' },
        ].map(s => (
          <div key={s.label} style={{
            backgroundColor: 'var(--color-bg-primary)',
            padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6,
            borderTop: `3px solid ${s.color}`,
          }}>
            <span style={{ color: s.color }}>{s.icon}</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
              {s.value}
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Quick actions */}
          <div className="gh-card" style={{ padding: 16 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Actions
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {quickActions.map(a => (
                <Link key={a.label} to={a.to}
                  className={`gh-btn gh-btn-${a.style}`}
                  style={{ justifyContent: 'center', fontSize: 13, padding: '7px 12px' }}
                >
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* My Hackathons */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Trophy size={16} color="var(--color-text-muted)" /> My Hackathons
              </h2>
              <Link to="/hackathons" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                Browse more <ArrowRight size={12} />
              </Link>
            </div>
            {myHackathons.length === 0 ? (
              <div className="gh-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <Trophy size={28} color="var(--color-text-muted)" style={{ marginBottom: 8 }} />
                <p style={{ margin: '0 0 12px', color: 'var(--color-text-muted)', fontSize: 13 }}>
                  You haven't registered for any hackathons yet.
                </p>
                <Link to="/hackathons" className="gh-btn gh-btn-primary" style={{ fontSize: 13 }}>
                  <Plus size={13} /> Register Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myHackathons.map(h => {
                  const days = daysUntil(h.endDate);
                  const statusColor: Record<string, string> = {
                    OPEN: 'gh-badge-green', UPCOMING: 'gh-badge-yellow',
                    IN_PROGRESS: 'gh-badge-blue', JUDGING: 'gh-badge-purple', COMPLETED: 'gh-badge-gray',
                  };
                  return (
                    <div key={h.id} className="gh-card gh-card-interactive" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/hackathons/${h.id}`} style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 3, color: 'var(--color-accent)' }}>
                          {h.title}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                          <Calendar size={11} />
                          {formatDate(h.startDate)} – {formatDate(h.endDate)}
                          {h.prizePool && <span style={{ color: 'var(--color-success)' }}>· {h.prizePool}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <span className={`gh-badge ${statusColor[h.status]}`} style={{ fontSize: 11 }}>
                          {h.status.replace('_', ' ')}
                        </span>
                        {days > 0 && h.status !== 'COMPLETED' && (
                          <span style={{ fontSize: 11, color: days <= 3 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                            {days}d remaining
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Teams */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={16} color="var(--color-text-muted)" /> My Teams
              </h2>
              <Link to="/teams" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                Find team <ArrowRight size={12} />
              </Link>
            </div>
            {myTeams.length === 0 ? (
              <div className="gh-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <Users size={28} color="var(--color-text-muted)" style={{ marginBottom: 8 }} />
                <p style={{ margin: '0 0 12px', color: 'var(--color-text-muted)', fontSize: 13 }}>
                  Not on a team yet. Join one or create your own.
                </p>
                <Link to="/teams" className="gh-btn gh-btn-secondary" style={{ fontSize: 13 }}>
                  <Plus size={13} /> Find a Team
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myTeams.map(t => (
                  <div key={t.id} className="gh-card gh-card-interactive" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/teams/${t.id}`} style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-accent)' }}>{t.name}</Link>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>
                        {t.hackathonTitle} · {t.members.length}/{t.maxSize} members
                      </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      {t.members.slice(0, 4).map((m, i) => (
                        <div key={m.id} className="avatar" title={m.fullName} style={{
                          width: 26, height: 26, fontSize: 10,
                          marginLeft: i > 0 ? -6 : 0,
                          border: '2px solid var(--color-bg-primary)', zIndex: 4 - i,
                        }}>
                          {m.fullName[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Submissions */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Code2 size={16} color="var(--color-text-muted)" /> My Submissions
              </h2>
              <Link to="/submit" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                New submission <ArrowRight size={12} />
              </Link>
            </div>
            {mySubmissions.length === 0 ? (
              <div className="gh-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <Code2 size={28} color="var(--color-text-muted)" style={{ marginBottom: 8 }} />
                <p style={{ margin: '0 0 12px', color: 'var(--color-text-muted)', fontSize: 13 }}>No submissions yet.</p>
                <Link to="/submit" className="gh-btn gh-btn-secondary" style={{ fontSize: 13 }}>
                  <Upload size={13} /> Submit Project
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mySubmissions.map(s => {
                  const statusIcon = s.status === 'EVALUATED'
                    ? <CheckCircle size={13} color="var(--color-success)" />
                    : <AlertCircle size={13} color="var(--color-warning)" />;
                  return (
                    <div key={s.id} className="gh-card gh-card-interactive" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{s.projectTitle}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          Team: {s.teamName} · Submitted {formatDate(s.submittedAt)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                          {statusIcon} {s.status.replace('_', ' ')}
                        </span>
                        {s.score !== undefined && (
                          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-accent)' }}>
                            {s.score}/100
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Sessions */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={16} color="var(--color-text-muted)" /> My Mentor Sessions
              </h2>
              <Link to="/mentors" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                Book session <ArrowRight size={12} />
              </Link>
            </div>
            {mySessions.length === 0 ? (
              <div className="gh-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <Star size={28} color="var(--color-text-muted)" style={{ marginBottom: 8 }} />
                <p style={{ margin: '0 0 12px', color: 'var(--color-text-muted)', fontSize: 13 }}>No sessions booked.</p>
                <Link to="/mentors" className="gh-btn gh-btn-secondary" style={{ fontSize: 13 }}>
                  <Plus size={13} /> Book a Mentor
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mySessions.map(session => (
                  <div key={session.id} className="gh-card gh-card-interactive" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{session.mentorName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={11} /> {formatDate(session.startTime)} at {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className="gh-badge gh-badge-green" style={{ fontSize: 11 }}>CONFIRMED</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Upcoming Deadlines */}
          <div className="gh-card" style={{ padding: 16 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} /> Upcoming Deadlines
            </p>
            {upcomingDeadlines.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>No upcoming deadlines.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcomingDeadlines.map((d, i) => {
                  const days = daysUntil(d.date);
                  const urgent = days <= 3;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, paddingBottom: 10, borderBottom: i < upcomingDeadlines.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>{d.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{d.type}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: urgent ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}>
                          {days <= 0 ? 'Today' : `${days}d`}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formatDate(d.date)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile quick view */}
          {user?.skills && user.skills.length > 0 && (
            <div className="gh-card" style={{ padding: 16 }}>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                My Skills
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {user.skills.map(s => (
                  <span key={s} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Explore */}
          <div className="gh-card" style={{ padding: 16 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Explore
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { to: '/leaderboard', label: '🏆 Live Leaderboard' },
                { to: '/mentors', label: '📅 Book a Mentor' },
                { to: '/resources', label: '📚 Resources & Venues' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="nav-item" style={{ borderRadius: 4 }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: hide sidebar on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
