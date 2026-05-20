import React, { useState } from 'react';
import { mockTeams } from '../../data/mockData';
import TeamCard from '../../components/teams/TeamCard';
import { Search, Users, Cpu } from 'lucide-react';
import { SkillSelector } from '../../components/ui/SkillBadge';
import api from '../../api/client';
import { Team, Hackathon } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/ui/Modal';

export default function TeamList() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [openOnly, setOpenOnly] = useState(false);
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    hackathonId: '',
    maxSize: 4,
    isOpen: true,
  });

  React.useEffect(() => {
    api.get<Hackathon[]>('/hackathons').then(res => setHackathons(Array.isArray(res.data) ? res.data : []));
  }, []);

  const fetchTeams = () => {
    api.get<Team[]>('/teams')
      .then(response => setTeams(Array.isArray(response.data) ? response.data : []))
      .catch(() => setTeams(mockTeams));
  };

  React.useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.hackathonId) return;

    api.post(`/teams/create?leaderId=${user?.id || 1}`, {
      name: newTeam.name,
      description: newTeam.description,
      hackathon: { id: Number(newTeam.hackathonId) },
      maxSize: newTeam.maxSize,
      isOpen: newTeam.isOpen,
    }).then(() => {
      setIsCreateModalOpen(false);
      setNewTeam({ name: '', description: '', hackathonId: '', maxSize: 4, isOpen: true });
      fetchTeams();
      window.alert("Team created successfully!");
    }).catch((err) => {
      window.alert(err.response?.data?.message || "Failed to create team. You can only create one team.");
    });
  };

  const filtered = teams.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.hackathonTitle.toLowerCase().includes(search.toLowerCase());
    const matchSkills = skills.length === 0 || skills.some(s => t.requiredSkills.includes(s));
    const matchOpen = !openOnly || t.isOpen;
    return matchSearch && matchSkills && matchOpen;
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 600 }}>Teams</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Find a team or discover teammates with skill-based matchmaking
          </p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="gh-btn gh-btn-primary">
          Create Team
        </button>
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

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a New Team"
        footer={
          <>
            <button onClick={() => setIsCreateModalOpen(false)} className="gh-btn gh-btn-secondary">Cancel</button>
            <button onClick={handleCreateTeam} className="gh-btn gh-btn-primary" disabled={!newTeam.name || !newTeam.hackathonId}>
              Create Team
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="gh-label">Team Name</label>
            <input className="gh-input" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} placeholder="HackSquad" required />
          </div>
          <div>
            <label className="gh-label">Hackathon</label>
            <select className="gh-input" value={newTeam.hackathonId} onChange={e => setNewTeam({...newTeam, hackathonId: e.target.value})} required>
              <option value="">Select a Hackathon</option>
              {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
            </select>
          </div>
          <div>
            <label className="gh-label">Description</label>
            <textarea className="gh-input" value={newTeam.description} onChange={e => setNewTeam({...newTeam, description: e.target.value})} placeholder="What are you building?" rows={3} />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label className="gh-label">Max Members</label>
              <input type="number" className="gh-input" value={newTeam.maxSize} onChange={e => setNewTeam({...newTeam, maxSize: Number(e.target.value)})} min={1} max={10} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="gh-label">Visibility</label>
              <select className="gh-input" value={newTeam.isOpen ? 'true' : 'false'} onChange={e => setNewTeam({...newTeam, isOpen: e.target.value === 'true'})}>
                <option value="true">Public (Anyone can join)</option>
                <option value="false">Private (Request to join)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
