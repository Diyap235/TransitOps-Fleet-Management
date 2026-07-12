import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth.api';

const AuthContext = createContext(null);

// ─── RBAC Permission Matrix ───────────────────────────────────────────────────
const PERMISSIONS = {
  FleetManager: {
    vehicles: { read: true, write: true, delete: true },
    drivers: { read: true, write: true, delete: true },
    trips: { read: true, write: true, delete: true },
    maintenance: { read: true, write: true, delete: true },
    reports: { read: true, write: true, export: true },
    fuelExpenses: { read: true, write: true, delete: true },
  },
  Driver: {
    vehicles: { read: true, write: false, delete: false },
    drivers: { read: true, write: false, delete: false },
    trips: { read: true, write: true, delete: false }, // can create/manage own trips
    maintenance: { read: false, write: false, delete: false },
    reports: { read: false, write: false, export: false },
    fuelExpenses: { read: false, write: false, delete: false },
  },
  SafetyOfficer: {
    vehicles: { read: true, write: false, delete: false },
    drivers: { read: true, write: true, delete: false }, // can edit license/status
    trips: { read: true, write: false, delete: false },
    maintenance: { read: false, write: false, delete: false },
    reports: { read: true, write: false, export: false }, // view-only
    fuelExpenses: { read: false, write: false, delete: false },
  },
  FinancialAnalyst: {
    vehicles: { read: true, write: false, delete: false },
    drivers: { read: true, write: false, delete: false },
    trips: { read: true, write: false, delete: false },
    maintenance: { read: false, write: false, delete: false },
    reports: { read: true, write: true, export: true }, // full reports access
    fuelExpenses: { read: true, write: true, delete: true }, // full fuel/expenses access
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('transitops_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const storedToken = localStorage.getItem('transitops_token');
      if (storedToken) {
        try {
          const res = await getMe();
          setUser(res.data.user);
          setToken(storedToken);
        } catch (err) {
          // Token invalid, clear storage
          localStorage.removeItem('transitops_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateSession();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('transitops_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('transitops_token');
  };

  // RBAC utility: check if current user can perform action on resource
  const hasPermission = (resource, action = 'read') => {
    if (!user || !user.role) return false;
    const rolePerms = PERMISSIONS[user.role];
    if (!rolePerms) return false;
    const resourcePerms = rolePerms[resource];
    if (!resourcePerms) return false;
    return resourcePerms[action] === true;
  };

  // Check if user can access a route (read permission on the module)
  const canAccessRoute = (route) => {
    if (!user) return false;
    const routeToResource = {
      '/': 'vehicles', // Dashboard accessible to all authenticated users
      '/vehicles': 'vehicles',
      '/drivers': 'drivers',
      '/trips': 'trips',
      '/maintenance': 'maintenance',
      '/reports': 'reports',
      '/fuel-expenses': 'fuelExpenses',
    };
    const resource = routeToResource[route];
    if (!resource) return true; // Unknown routes default to accessible
    return hasPermission(resource, 'read');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    hasPermission,
    canAccessRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
