import React, { useState } from 'react';
import { mockResources, mockVenues } from '../../data/mockData';
import { FileText, Video, Link as LinkIcon, Database, FileCode, MapPin, Users } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  DOCUMENT: <FileText size={16} />, VIDEO: <Video size={16} />,
  LINK: <LinkIcon size={16} />, DATASET: <Database size={16} />, TEMPLATE: <FileCode size={16} />,
};

const typeColors: Record<string, string> = {
  DOCUMENT: 'gh-badge-blue', VIDEO: 'gh-badge-red',
  LINK: 'gh-badge-purple', DATASET: 'gh-badge-green', TEMPLATE: 'gh-badge-yellow',
};

export default function Resources() {
  const [activeTab, setActiveTab] = useState<'resources' | 'venues'>('resources');
  const [typeFilter, setTypeFilter] = useState('');
  const filteredResources = mockResources.filter(r => !typeFilter || r.type === typeFilter);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600 }}>Resources & Venues</h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>Templates, datasets, tutorials, and venue information</p>
      </div>
      <div className="tab-nav" style={{ marginBottom: 24 }}>
        {(['resources', 'venues'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
            {tab === 'resources' ? `Resources (${mockResources.length})` : `Venues (${mockVenues.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'resources' && (
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {['', 'DOCUMENT', 'VIDEO', 'LINK', 'TEMPLATE', 'DATASET'].map(type => (
              <button key={type} onClick={() => setTypeFilter(type)} className="gh-btn"
                style={{ padding: '3px 12px', fontSize: 12,
                  backgroundColor: typeFilter === type ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  borderColor: typeFilter === type ? 'var(--color-accent)' : 'var(--color-border)',
                  color: typeFilter === type ? '#fff' : 'var(--color-text-secondary)' }}>
                {type || 'All'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredResources.map(r => (
              <div key={r.id} className="gh-card" style={{ padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--color-accent)', marginTop: 2 }}>{typeIcons[r.type]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</a>
                    <span className={`gh-badge ${typeColors[r.type]}`} style={{ fontSize: 11 }}>{r.type}</span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{r.description}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {r.tags.map(tag => <span key={tag} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>{tag}</span>)}
                  </div>
                </div>
                <a href={r.url} className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '3px 10px', flexShrink: 0 }}>Open ↗</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'venues' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {mockVenues.map(v => (
            <div key={v.id} className="gh-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{v.name}</h3>
                <span className={`gh-badge ${v.isAvailable ? 'gh-badge-green' : 'gh-badge-red'}`} style={{ fontSize: 11, flexShrink: 0 }}>
                  {v.isAvailable ? 'Available' : 'In Use'}
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{v.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <MapPin size={12} /> {v.address}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <Users size={12} /> Capacity: {v.capacity} people
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {v.amenities.map(a => <span key={a} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>{a}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
