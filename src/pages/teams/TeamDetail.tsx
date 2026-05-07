import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Lock, Unlock, Crown } from 'lucide-react';
import { mockTeams } from '../../data/mockData';
import { SkillBadge } from '../../components/ui/SkillBadge';

export default function TeamDetail() {
  const { id } = useParams();
  const team = mockTeams.find(t => t.id === Number(id));

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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: team.isOpen ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {team.isOpen ? <Unlock size={14} /> : <Lock size={14} />}
            {team.isOpen ? 'Open to join' : 'Closed'}
          </span>
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
                  {m.isLeader && <Crown size={13} color="#d4a017" aria-label="Team Leader" />}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{m.role}</div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {m.skills.slice(0, 3).map(s => <SkillBadge key={s} skill={s} size="sm" />)}
              </div>
            </div>
          ))}
        </div>
        {team.isOpen && team.members.length < team.maxSize && (
          <button className="gh-btn gh-btn-primary" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
            Request to Join Team
          </button>
        )}
      </div>
    </div>
  );
}
