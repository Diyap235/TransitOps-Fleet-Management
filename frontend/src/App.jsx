import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  return isAuthenticated
    ? <Layout>{children}</Layout>
    : <Navigate to="/login" replace />;
};

/* Public-only route: redirect authenticated users straight to dashboard */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    {/* Landing page — public, redirect to /dashboard if already logged in */}
    <Route path="/"        element={<PublicRoute><Landing /></PublicRoute>} />
    <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />

    {/* Protected app routes */}
    <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/vehicles"    element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
    <Route path="/drivers"     element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
    <Route path="/trips"       element={<ProtectedRoute><Trips /></ProtectedRoute>} />
    <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
    <Route path="/reports"     element={<ProtectedRoute><Reports /></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
  <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
