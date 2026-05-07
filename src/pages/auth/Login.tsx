import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Login() {
  const { login, loginDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Try demo@bits.edu / password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError('');
    try {
      loginDemo();
      navigate('/dashboard');
    } catch {
      setError('Demo login failed.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-secondary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position: 'fixed', top: '16px', right: '16px',
        background: 'none', border: '1px solid var(--color-border)',
        borderRadius: '6px', cursor: 'pointer', padding: '6px',
        color: 'var(--color-text-secondary)', display: 'flex',
      }}>
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Code2 size={28} color="var(--color-brand)" />
        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          BITS <span style={{ color: 'var(--color-brand)' }}>Hackathon Hub</span>
        </span>
      </div>

      {/* Card */}
      <div className="gh-card" style={{ width: '100%', maxWidth: '360px', padding: '24px', borderTop: '3px solid var(--color-brand)' }}>
        <h1 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center' }}>
          Sign in to your account
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
          <div>
            <label className="gh-label">Email address</label>
            <input
              className="gh-input"
              type="email"
              placeholder="you@bits-pilani.ac.in"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoFocus
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="gh-label" style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: '12px' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="gh-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-muted)', display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="gh-btn"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '8px 16px', fontSize: '14px', marginTop: '4px', backgroundColor: 'var(--color-brand)', borderColor: 'transparent', color: '#fff' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ position: 'relative', margin: '16px 0', textAlign: 'center' }}>
          <hr className="gh-divider" />
          <span style={{
            position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-bg-primary)', padding: '0 8px',
            fontSize: '12px', color: 'var(--color-text-muted)',
          }}>OR</span>
        </div>

        <button
          onClick={handleDemo}
          className="gh-btn gh-btn-secondary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '8px 16px' }}
        >
          🚀 Continue with Demo Account
        </button>
      </div>

      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        New to BITS Hub?{' '}
        <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
