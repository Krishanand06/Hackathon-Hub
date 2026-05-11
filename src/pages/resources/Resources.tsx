import React from 'react';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import api from '../../api/client';
import { Resource } from '../../types';

export default function Resources() {
  const [resources, setResources] = React.useState<Resource[]>([]);

  React.useEffect(() => {
    api.get<Resource[]>('/resources')
      .then(response => setResources(Array.isArray(response.data) ? response.data : []))
      .catch(() => setResources([]));
  }, []);

  const sortedResources = [...resources].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600 }}>Resources</h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>
          Useful website links for participants
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sortedResources.map(resource => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="gh-card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              textDecoration: 'none',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <LinkIcon size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>
                {resource.title}
              </span>
            </span>
            <ExternalLink size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          </a>
        ))}
      </div>
    </div>
  );
}
