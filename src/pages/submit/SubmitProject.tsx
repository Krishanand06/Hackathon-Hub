import React, { useState, useEffect } from 'react';
import { mockHackathons } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/client';
import { Hackathon, Team } from '../../types';

export default function SubmitProject() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    hackathonId: '', teamId: '', projectTitle: '', description: '',
    repoUrl: '', demoUrl: '', techStack: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);

  useEffect(() => {
    api.get<Hackathon[]>('/hackathons/public')
      .then(res => {
        setHackathons(res.data || []);
      })
      .catch(() => setHackathons(mockHackathons));

    api.get<Team[]>('/teams')
      .then(res => {
        const allTeams = res.data || [];
        const filtered = allTeams.filter(t => 
          t.leaderId === user?.id || 
          t.members.some(m => m.userId === user?.id)
        );
        setMyTeams(filtered);
      })
      .catch(() => setMyTeams([]));
  }, [user?.id]);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hackathonId || !form.projectTitle || !form.repoUrl) return;

    api.post('/submissions', {
      projectTitle: form.projectTitle,
      description: form.description,
      hackathon: { id: Number(form.hackathonId) },
      team: form.teamId ? { id: Number(form.teamId) } : null,
      submittedBy: { id: user?.id ?? 2 },
      repoUrl: form.repoUrl,
      demoUrl: form.demoUrl || null,
      techStack: form.techStack.split(',').map(item => item.trim()).filter(Boolean),
    }).then(() => {
      setSubmitted(true);
    }).catch(err => {
      window.alert(err.response?.data?.message || "Failed to submit project. Please try again.");
    });
  };

  if (submitted) return (
    <div className="page-container" style={{ paddingTop: 40 }}>
      <div className="gh-card" style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>Project Submitted!</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          <strong>{form.projectTitle}</strong> has been submitted successfully.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/leaderboard" className="gh-btn gh-btn-primary">View Leaderboard</Link>
          <Link to="/dashboard" className="gh-btn gh-btn-secondary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );

  const availableTeams = myTeams.filter(t => !form.hackathonId || t.hackathonId === Number(form.hackathonId));

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600 }}>Submit Project</h1>
      <p style={{ margin: '0 0 24px', color: 'var(--color-text-muted)', fontSize: 14 }}>
        Fill in your project details and submit for evaluation.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="gh-card" style={{ padding: 20 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Hackathon & Team</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="gh-label">Hackathon <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <select className="gh-input" value={form.hackathonId} onChange={set('hackathonId')} required>
                <option value="">Select hackathon…</option>
                {hackathons.filter(h => ['OPEN', 'IN_PROGRESS'].includes(h.status)).map(h => (
                  <option key={h.id} value={h.id}>{h.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="gh-label">Team (optional)</label>
              <select className="gh-input" value={form.teamId} onChange={set('teamId')}>
                <option value="">Individual submission</option>
                {availableTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="gh-card" style={{ padding: 20 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Project Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="gh-label">Project Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <input className="gh-input" placeholder="e.g. CarbonSense AI" value={form.projectTitle} onChange={set('projectTitle')} required />
            </div>
            <div>
              <label className="gh-label">Description <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <textarea className="gh-input" rows={5} placeholder="Describe your project, the problem it solves, and how you built it…"
                value={form.description} onChange={set('description')}
                style={{ resize: 'vertical', fontFamily: 'inherit' }} required />
            </div>
            <div>
              <label className="gh-label">Tech Stack</label>
              <input className="gh-input" placeholder="e.g. React, Spring Boot, TensorFlow, MySQL" value={form.techStack} onChange={set('techStack')} />
            </div>
          </div>
        </div>

        <div className="gh-card" style={{ padding: 20 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Links</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="gh-label">GitHub Repository <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <Github size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input className="gh-input" placeholder="https://github.com/yourteam/project" value={form.repoUrl} onChange={set('repoUrl')} style={{ paddingLeft: 32 }} required />
              </div>
            </div>
            <div>
              <label className="gh-label">Demo URL</label>
              <div style={{ position: 'relative' }}>
                <ExternalLink size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input className="gh-input" placeholder="https://yourproject.demo.com" value={form.demoUrl} onChange={set('demoUrl')} style={{ paddingLeft: 32 }} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="gh-btn gh-btn-primary" style={{ padding: '10px 20px', fontSize: 15, justifyContent: 'center', gap: 8 }}>
          <Upload size={16} /> Submit Project
        </button>
      </form>
    </div>
  );
}
