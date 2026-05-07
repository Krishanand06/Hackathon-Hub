import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HackathonList from './pages/hackathons/HackathonList';
import HackathonDetail from './pages/hackathons/HackathonDetail';
import TeamList from './pages/teams/TeamList';
import TeamDetail from './pages/teams/TeamDetail';
import SubmitProject from './pages/submit/SubmitProject';
import Leaderboard from './pages/leaderboard/Leaderboard';
import Mentors from './pages/mentors/Mentors';
import Resources from './pages/resources/Resources';
import Dashboard from './pages/dashboard/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN' && user?.role !== 'JUDGE') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="hackathons" element={<HackathonList />} />
        <Route path="hackathons/:id" element={<HackathonDetail />} />
        <Route path="teams" element={<TeamList />} />
        <Route path="teams/:id" element={<TeamDetail />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="resources" element={<Resources />} />
        <Route path="mentors" element={<Mentors />} />

        {/* Protected */}
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="submit" element={<ProtectedRoute><SubmitProject /></ProtectedRoute>} />

        {/* Admin/Judge */}
        <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Route>

      {/* Auth (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
