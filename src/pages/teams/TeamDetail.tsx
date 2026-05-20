import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Lock, Unlock, Crown } from 'lucide-react';
import { mockTeams } from '../../data/mockData';
import { SkillBadge } from '../../components/ui/SkillBadge';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { Team } from '../../types';

export default function TeamDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = React.useState<Team | undefined>(() => mockTeams.find(t => t.id === Number(id)));

  const fetchTeam = React.useCallback(() => {
    if (!id) return;
    api.get<Team>(`/teams/${id}`)
      .then(response => setTeam(response.data))
      .catch(() => setTeam(mockTeams.find(t => t.id === Number(id))));
  }, [id]);

  React.useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleJoin = () => {
    if (!user) return alert("Please log in to join.");
    api.post(`/teams/${id}/join?userId=${user.id}`)
      .then(() => {
        alert(team?.isOpen ? "Joined team successfully!" : "Request sent successfully!");
        fetchTeam();
      })
      .catch(err => alert(err.response?.data?.message || "Failed to join team."));
  };

  const handleLeave = () => {
    if (!user) return;
    api.post(`/teams/${id}/leave?userId=${user.id}`)
      .then(() => {
        alert("Left team successfully.");
        fetchTeam();
      })
      .catch(err => alert(err.response?.data?.message || "Failed to leave team."));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    api.delete(`/teams/${id}`)
      .then(() => {
        alert("Team deleted.");
        window.location.href = '/teams';
      })
      .catch(() => alert("Failed to delete."));
  };

  const handleApprove = (userId: number) => {
    api.post(`/teams/${id}/approve?userId=${userId}&leaderId=${user?.id}`)
      .then(() => fetchTeam())
      .catch(() => alert("Failed to approve."));
  };

  const handleReject = (userId: number) => {
    api.post(`/teams/${id}/reject?userId=${userId}&leaderId=${user?.id}`)
      .then(() => fetchTeam())
      .catch(() => alert("Failed to reject."));
  };

  if (!team) return (
    <div className="page-container" style={{ paddingTop: 40 }}>
      <div className="gh-card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Team not found. <Link to="/teams">← Back</Link>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <Link to="/teams" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Teams
      </Link>

      <div className="gh-card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>{team.name}</h1>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--color-text-muted)' }}>📍 {team.hackathonTitle}</p>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{team.description}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: team.isOpen ? 'var(--color-success)' : 'var(--color-warning)' }}>
              {team.isOpen ? <Unlock size={14} /> : <Lock size={14} />}
              {team.isOpen ? 'Open to join' : 'Private (Request to join)'}
            </span>
            {user?.id === team.leaderId && (
              <button onClick={handleDelete} className="gh-btn gh-btn-danger" style={{ fontSize: 12, padding: '4px 8px' }}>
                Delete Team
              </button>
            )}
          </div>
        </div>

        {team.requiredSkills.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Skills Needed
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {team.requiredSkills.map(s => <SkillBadge key={s} skill={s} />)}
            </div>
          </div>
        )}
      </div>

      <div className="gh-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Users size={16} color="var(--color-text-muted)" />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            Members ({team.members.length}/{team.maxSize})
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {team.members.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
                {m.fullName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
                  {m.fullName}
                  {(m.isLeader || m.userId === team.leaderId) && (
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 4, 
                      fontSize: '11px', 
                      fontWeight: 500, 
                      backgroundColor: 'rgba(212, 160, 23, 0.15)', 
                      color: '#d4a017', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      marginLeft: '6px'
                    }}>
                      <Crown size={12} color="#d4a017" />
                      Leader
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{m.role}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {m.skills.slice(0, 3).map(s => <SkillBadge key={s} skill={s} size="sm" />)}
              </div>
            </div>
          ))}
        </div>

        {team.pendingRequests && team.pendingRequests.length > 0 && user?.id === team.leaderId && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Pending Requests</h3>
            {team.pendingRequests.map(req => (
              <div key={req.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', border: '1px solid var(--color-border)', borderRadius: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{req.fullName} ({req.username})</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleApprove(req.userId)} className="gh-btn gh-btn-primary" style={{ fontSize: 12, padding: '4px 8px' }}>Accept</button>
                  <button onClick={() => handleReject(req.userId)} className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '4px 8px' }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {user && team.members.some(m => m.userId === user.id) ? (
          user.id !== team.leaderId && (
            <button onClick={handleLeave} className="gh-btn gh-btn-secondary" style={{ marginTop: 16, width: '100%', justifyContent: 'center', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
              Leave Team
            </button>
          )
        ) : (
          team.members.length < team.maxSize && (
            <button 
              onClick={handleJoin} 
              className="gh-btn gh-btn-primary" 
              style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
              disabled={team.pendingRequests?.some(req => req.userId === user?.id)}
            >
              {team.pendingRequests?.some(req => req.userId === user?.id) 
                ? 'Request Pending...' 
                : (team.isOpen ? 'Join Team' : 'Request to Join Team')}
            </button>
          )
        )}
      </div>
    </div>
  );
}
