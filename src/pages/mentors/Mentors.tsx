import React, { useState } from 'react';
import { mockMentors } from '../../data/mockData';
import MentorCard from '../../components/mentors/MentorCard';
import Modal from '../../components/ui/Modal';
import { Mentor, MentorSlot } from '../../types';
import { Search } from 'lucide-react';

export default function Mentors() {
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<MentorSlot | null>(null);
  const [booked, setBooked] = useState<number[]>([]);

  const filtered = mockMentors.filter(m =>
    !search || m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase())) ||
    m.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSelectedSlot(null);
  };

  const confirmBooking = () => {
    if (selectedSlot) setBooked(b => [...b, selectedSlot.id]);
    setSelectedMentor(null);
    setSelectedSlot(null);
  };

  const formatSlot = (slot: MentorSlot) => {
    const start = new Date(slot.startTime);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600 }}>Mentors</h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>Book 1:1 sessions with industry experts</p>
      </div>

      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input className="gh-input" placeholder="Search by name, skill, or company…" value={search}
          onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(m => (
          <MentorCard key={m.id} mentor={m} onBook={handleBook} />
        ))}
      </div>

      {/* Booking modal */}
      <Modal
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
        title={`Book a session with ${selectedMentor?.fullName}`}
        footer={
          <>
            <button onClick={() => setSelectedMentor(null)} className="gh-btn gh-btn-secondary">Cancel</button>
            <button onClick={confirmBooking} disabled={!selectedSlot} className="gh-btn gh-btn-primary">
              Confirm Booking
            </button>
          </>
        }
      >
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Select an available 30-minute slot:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedMentor?.availableSlots.filter(s => !s.isBooked && !booked.includes(s.id)).map(slot => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              style={{
                padding: '10px 14px', borderRadius: 6, border: '1px solid',
                borderColor: selectedSlot?.id === slot.id ? 'var(--color-accent)' : 'var(--color-border)',
                backgroundColor: selectedSlot?.id === slot.id ? 'var(--color-accent-subtle)' : 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: 13,
                fontWeight: selectedSlot?.id === slot.id ? 600 : 400,
              }}
            >
              📅 {formatSlot(slot)}
            </button>
          ))}
          {selectedMentor?.availableSlots.filter(s => !s.isBooked && !booked.includes(s.id)).length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No available slots.</p>
          )}
        </div>
      </Modal>

      {booked.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          backgroundColor: 'var(--color-success-subtle)', border: '1px solid var(--color-success)',
          borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--color-success)',
          fontWeight: 500,
        }}>
          ✓ Session booked successfully!
        </div>
      )}
    </div>
  );
}
