import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';

/**
 * ProtectedRoute — redirects to /login if the user is not authenticated.
 * Wrap any route that requires auth with this component.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />

    {/* Protected */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/vehicles"
      element={
        <ProtectedRoute>
          <Vehicles />
        </ProtectedRoute>
      }
    />
    <Route
      path="/drivers"
      element={
        <ProtectedRoute>
          <Drivers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/trips"
      element={
        <ProtectedRoute>
          <Trips />
        </ProtectedRoute>
      }
    />
    <Route
      path="/maintenance"
      element={
        <ProtectedRoute>
          <Maintenance />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
