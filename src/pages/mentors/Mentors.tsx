import React, { useState } from 'react';
import MentorCard from '../../components/mentors/MentorCard';
import Modal from '../../components/ui/Modal';
import { Mentor, MentorSlot } from '../../types';
import { Search } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function Mentors() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<MentorSlot | null>(null);
  const [booked, setBooked] = useState<number[]>([]);
  const [myBookings, setMyBookings] = useState<MentorSlot[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  const fetchBookings = React.useCallback(() => {
    if (user?.id) {
      api.get<MentorSlot[]>(`/mentors/my-bookings?userId=${user.id}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setMyBookings(res.data);
            setBooked(res.data.map(s => s.id));
          } else {
            setMyBookings([]);
          }
        })
        .catch(() => setMyBookings([]));
    }
  }, [user]);

  React.useEffect(() => {
    api.get<Mentor[]>('/mentors')
      .then(response => setMentors(Array.isArray(response.data) ? response.data : []))
      .catch(() => setMentors([]));
    fetchBookings();
  }, [fetchBookings]);

  const filtered = mentors.filter(m =>
    !search || m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase())) ||
    m.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSelectedSlot(null);
  };

  const confirmBooking = () => {
    if (selectedSlot && selectedMentor) {
      api.post(`/mentors/book/${selectedSlot.id}?userId=${user?.id ?? 2}`)
        .then(() => {
          // Update mentors state
          setMentors(prev => prev.map(m => {
            if (m.id === selectedMentor.id) {
              return {
                ...m,
                availableSlots: m.availableSlots.map(s => 
                  s.id === selectedSlot.id ? { ...s, booked: true } : s
                )
              };
            }
            return m;
          }));
          fetchBookings();
          setBooked(b => [...b, selectedSlot.id]);
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 3000);
        })
        .catch(() => {
          window.alert("This slot is not available or already booked.");
        });
    }
    setSelectedMentor(null);
    setSelectedSlot(null);
  };

  const cancelBooking = (slotId: number, mentorId?: number) => {
    api.post(`/mentors/cancel/${slotId}?userId=${user?.id ?? 2}`)
      .then(() => {
        setMentors(prev => prev.map(m => ({
          ...m,
          availableSlots: m.availableSlots.map(s => 
            s.id === slotId ? { ...s, booked: false } : s
          )
        })));
        fetchBookings();
        window.alert("Session cancelled successfully.");
      })
      .catch(() => undefined);
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

      {/* My Bookings Section */}
      {myBookings.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>My Bookings</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {myBookings.map(slot => {
              // Find the mentor for this slot
              const mentor = mentors.find(m => m.id === slot.mentorId);
              return (
                <div key={slot.id} className="gh-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                      Session with {mentor?.fullName || 'Mentor'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      📅 {formatSlot(slot)}
                    </div>
                  </div>
                  <button 
                    onClick={() => cancelBooking(slot.id)}
                    className="gh-btn gh-btn-secondary" 
                    style={{ fontSize: '12px', padding: '4px 10px', color: 'var(--color-danger)' }}
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
          {selectedMentor?.availableSlots.filter(s => !s.booked && !booked.includes(s.id)).map(slot => (
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
          {selectedMentor?.availableSlots.filter(s => !s.booked && !booked.includes(s.id)).length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No available slots.</p>
          )}
        </div>
      </Modal>

      {toastVisible && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          backgroundColor: 'var(--color-success-subtle)', border: '1px solid var(--color-success)',
          borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--color-success)',
          fontWeight: 500,
          transition: 'opacity 0.3s ease',
          zIndex: 1000,
        }}>
          ✓ Session booked successfully!
        </div>
      )}
    </div>
  );
}
