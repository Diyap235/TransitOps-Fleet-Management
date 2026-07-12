import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import FuelExpenses from './pages/FuelExpenses';
import NotAuthorized from './pages/NotAuthorized';

const ProtectedRoute = ({ children, requiredRoute }) => {
  const { isAuthenticated, loading, canAccessRoute } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-page)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check route-level permission
  if (requiredRoute && !canAccessRoute(requiredRoute)) {
    return <Layout><NotAuthorized /></Layout>;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute requiredRoute="/"><Dashboard /></ProtectedRoute>} />
    <Route path="/vehicles" element={<ProtectedRoute requiredRoute="/vehicles"><Vehicles /></ProtectedRoute>} />
    <Route path="/drivers" element={<ProtectedRoute requiredRoute="/drivers"><Drivers /></ProtectedRoute>} />
    <Route path="/trips" element={<ProtectedRoute requiredRoute="/trips"><Trips /></ProtectedRoute>} />
    <Route path="/maintenance" element={<ProtectedRoute requiredRoute="/maintenance"><Maintenance /></ProtectedRoute>} />
    <Route path="/reports" element={<ProtectedRoute requiredRoute="/reports"><Reports /></ProtectedRoute>} />
    <Route path="/fuel-expenses" element={<ProtectedRoute requiredRoute="/fuel-expenses"><FuelExpenses /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
