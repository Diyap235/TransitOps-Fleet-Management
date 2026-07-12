import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  return isAuthenticated
    ? <Layout>{children}</Layout>
    : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login"       element={<Login />} />
    <Route path="/"            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/vehicles"    element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
    <Route path="/drivers"     element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
    <Route path="/trips"       element={<ProtectedRoute><Trips /></ProtectedRoute>} />
    <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
    <Route path="/reports"     element={<ProtectedRoute><Reports /></ProtectedRoute>} />
    <Route path="*"            element={<Navigate to="/" replace />} />
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
);

export default App;
