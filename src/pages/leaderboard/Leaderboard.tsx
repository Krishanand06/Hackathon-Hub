import React, { useState } from 'react';
import { mockLeaderboard, mockHackathons } from '../../data/mockData';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import { RefreshCw } from 'lucide-react';

export default function Leaderboard() {
  const [selectedHackathon, setSelectedHackathon] = useState<number | ''>('');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = selectedHackathon
    ? mockLeaderboard.filter(e => e.hackathonId === selectedHackathon)
    : mockLeaderboard;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            Live Leaderboard
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--color-success)', backgroundColor: 'var(--color-success-subtle)', border: '1px solid var(--color-success)', borderRadius: 20, padding: '2px 8px' }}>
              <span className="status-dot status-dot-green status-dot-live" />
              LIVE
            </span>
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>
            Real-time rankings updated as judges evaluate submissions
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            className="gh-input"
            value={selectedHackathon}
            onChange={e => setSelectedHackathon(e.target.value ? Number(e.target.value) : '')}
            style={{ width: 'auto' }}
          >
            <option value="">All Hackathons</option>
            {mockHackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
          </select>
          <button
            onClick={handleRefresh}
            className="gh-btn gh-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      <LeaderboardTable entries={filtered} isLoading={refreshing} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
