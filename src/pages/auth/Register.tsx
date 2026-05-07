import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, AlertCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const ROLES = [
  { value: 'STUDENT', label: 'Student — Participate in hackathons' },
  { value: 'MENTOR', label: 'Mentor — Guide student teams' },
  { value: 'JUDGE', label: 'Judge — Evaluate submissions' },
];

export default function Register() {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '', role: 'STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate('/dashboard');
    } catch {
      // For demo: create mock user
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({
        id: Date.now(), username: form.username, email: form.email,
        fullName: form.fullName, role: form.role, skills: [], bio: '',
      }));
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label, field, type = 'text', placeholder, required = true,
  }: { label: string; field: string; type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="gh-label">
        {label}{required && <span style={{ color: 'var(--color-danger)', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        className="gh-input"
        type={type}
        placeholder={placeholder}
        value={(form as Record<string, string>)[field]}
        onChange={set(field)}
      />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <button onClick={toggleTheme} style={{
        position: 'fixed', top: '16px', right: '16px',
        background: 'none', border: '1px solid var(--color-border)',
        borderRadius: '6px', cursor: 'pointer', padding: '6px',
        color: 'var(--color-text-secondary)', display: 'flex',
      }}>
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Code2 size={28} color="var(--color-brand)" />
        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          BITS <span style={{ color: 'var(--color-brand)' }}>Hackathon Hub</span>
        </span>
      </div>

      <div className="gh-card" style={{ width: '100%', maxWidth: '400px', padding: '24px', borderTop: '3px solid var(--color-brand)' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center' }}>
          Create your account
        </h1>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger)',
            borderRadius: '6px', padding: '10px 12px', marginBottom: '16px',
          }}>
            <AlertCircle size={14} color="var(--color-danger)" />
            <span style={{ fontSize: '13px', color: 'var(--color-danger)' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Full Name" field="fullName" placeholder="Arjun Kumar" />
          <Field label="Username" field="username" placeholder="arjun_k" />
          <Field label="Email address" field="email" type="email" placeholder="you@bits-pilani.ac.in" />

          <div>
            <label className="gh-label">Role <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <select
              className="gh-input"
              value={form.role}
              onChange={set('role')}
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <Field label="Password" field="password" type="password" placeholder="Min. 8 characters" />
          <Field label="Confirm Password" field="confirmPassword" type="password" placeholder="Repeat password" />

          <button
            type="submit"
            className="gh-btn"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '8px 16px', marginTop: '4px', backgroundColor: 'var(--color-brand)', borderColor: 'transparent', color: '#fff' }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          By creating an account, you agree to the{' '}
          <a href="#">Terms of Service</a>.
        </p>
      </div>

      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
