import React, { useState } from 'react';
import { mockHackathons, mockSubmissions, mockLeaderboard } from '../../data/mockData';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import { CheckCircle, XCircle, Star } from 'lucide-react';

const CRITERIA = ['innovation', 'implementation', 'presentation', 'impact', 'feasibility'] as const;

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'leaderboard' | 'hackathons'>('submissions');
  const [scores, setScores] = useState<Record<number, Record<string, number>>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [evaluated, setEvaluated] = useState<number[]>([]);

  const setScore = (subId: number, criterion: string, value: number) => {
    setScores(prev => ({ ...prev, [subId]: { ...(prev[subId] || {}), [criterion]: value } }));
  };

  const submit = (subId: number) => setEvaluated(e => [...e, subId]);

  const totalScore = (subId: number) => {
    const s = scores[subId] || {};
    return CRITERIA.reduce((acc, c) => acc + (s[c] || 0), 0) / CRITERIA.length;
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600 }}>Admin & Judge Panel</h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>Evaluate submissions and manage hackathons</p>
      </div>

      <div className="tab-nav" style={{ marginBottom: 24 }}>
        {(['submissions', 'leaderboard', 'hackathons'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mockSubmissions.map(sub => (
            <div key={sub.id} className="gh-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>{sub.projectTitle}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>by {sub.teamName}</p>
                </div>
                {evaluated.includes(sub.id)
                  ? <span className="gh-badge gh-badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} /> Evaluated</span>
                  : <span className="gh-badge gh-badge-yellow">Pending</span>
                }
              </div>

              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>{sub.description}</p>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {sub.techStack.map(t => <span key={t} className="gh-badge gh-badge-gray" style={{ fontSize: 11 }}>{t}</span>)}
              </div>

              {!evaluated.includes(sub.id) && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 14 }}>
                    {CRITERIA.map(c => (
                      <div key={c}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                          {c} <span style={{ color: 'var(--color-accent)' }}>{scores[sub.id]?.[c] || 0}/20</span>
                        </label>
                        <input type="range" min={0} max={20} value={scores[sub.id]?.[c] || 0}
                          onChange={e => setScore(sub.id, c, Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label className="gh-label">Feedback</label>
                    <textarea className="gh-input" rows={2} placeholder="Provide constructive feedback…"
                      value={feedbacks[sub.id] || ''}
                      onChange={e => setFeedbacks(prev => ({ ...prev, [sub.id]: e.target.value }))}
                      style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      Total: <span style={{ color: 'var(--color-accent)' }}>{totalScore(sub.id).toFixed(1)}/20</span>
                    </span>
                    <button onClick={() => submit(sub.id)} className="gh-btn gh-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Star size={14} /> Submit Evaluation
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && <LeaderboardTable entries={mockLeaderboard} />}

      {activeTab === 'hackathons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mockHackathons.map(h => (
            <div key={h.id} className="gh-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{h.title}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{h.currentParticipants}/{h.maxParticipants} participants · {h.status}</div>
              </div>
              <span className={`gh-badge ${h.status === 'OPEN' ? 'gh-badge-green' : h.status === 'COMPLETED' ? 'gh-badge-gray' : 'gh-badge-yellow'}`}>
                {h.status}
              </span>
              <button className="gh-btn gh-btn-secondary" style={{ fontSize: 12, padding: '3px 10px' }}>Manage</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
