import React from 'react';
import { mockHackathons } from '../../data/mockData';
import HackathonCard from '../../components/hackathons/HackathonCard';
import { Search, Filter } from 'lucide-react';
import { Hackathon, HackathonStatus } from '../../types';
import api from '../../api/client';

const ALL_STATUSES: { value: HackathonStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'JUDGING', label: 'Judging' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function HackathonList() {
  const [hackathons, setHackathons] = React.useState<Hackathon[]>(mockHackathons);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<HackathonStatus | ''>('');
  const [onlineOnly, setOnlineOnly] = React.useState(false);

  React.useEffect(() => {
    api.get<Hackathon[]>('/hackathons')
      .then(response => setHackathons(response.data))
      .catch(() => setHackathons(mockHackathons));
  }, []);

  const filtered = hackathons.filter(h => {
    const matchSearch = !search || h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = !status || h.status === status;
    const matchOnline = !onlineOnly || h.isOnline;
    return matchSearch && matchStatus && matchOnline;
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 600 }}>Hackathons</h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '14px' }}>
          {filtered.length} hackathon{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '12px', flexWrap: 'wrap',
        marginBottom: '24px', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={14} style={{
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }} />
          <input
            className="gh-input"
            placeholder="Search hackathons or tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '32px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {ALL_STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value as HackathonStatus | '')}
              className="gh-btn"
              style={{
                backgroundColor: status === s.value ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                borderColor: status === s.value ? 'var(--color-accent)' : 'var(--color-border)',
                color: status === s.value ? '#fff' : 'var(--color-text-secondary)',
                padding: '4px 12px', fontSize: '13px',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={onlineOnly} onChange={e => setOnlineOnly(e.target.checked)} />
          Online only
        </label>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="gh-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No hackathons match your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(h => <HackathonCard key={h.id} hackathon={h} />)}
        </div>
      )}
    </div>
  );
}
