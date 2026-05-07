import React, { useState } from 'react';
import { mockTeams } from '../../data/mockData';
import TeamCard from '../../components/teams/TeamCard';
import { Search, Users, Cpu } from 'lucide-react';
import { SkillSelector } from '../../components/ui/SkillBadge';

export default function TeamList() {
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = mockTeams.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.hackathonTitle.toLowerCase().includes(search.toLowerCase());
    const matchSkills = skills.length === 0 || skills.some(s => t.requiredSkills.includes(s));
    const matchOpen = !openOnly || t.isOpen;
    return matchSearch && matchSkills && matchOpen;
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 600 }}>Teams</h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Find a team or discover teammates with skill-based matchmaking
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="gh-input" placeholder="Search teams…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <div style={{ flex: 2, minWidth: '240px' }}>
          <SkillSelector selected={skills} onChange={setSkills} placeholder="Filter by skills needed…" />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={openOnly} onChange={e => setOpenOnly(e.target.checked)} />
          Open teams only
        </label>
      </div>

      {/* Matchmaking banner */}
      {skills.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent)',
          borderRadius: '6px', padding: '10px 14px', marginBottom: '20px',
        }}>
          <Cpu size={16} color="var(--color-accent)" />
          <span style={{ fontSize: '13px', color: 'var(--color-accent)', fontWeight: 500 }}>
            Showing teams that need: {skills.join(', ')}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          <Users size={13} style={{ display: 'inline', marginRight: 4 }} />
          {filtered.length} team{filtered.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="gh-card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No teams match your criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map(t => <TeamCard key={t.id} team={t} />)}
        </div>
      )}
    </div>
  );
}
