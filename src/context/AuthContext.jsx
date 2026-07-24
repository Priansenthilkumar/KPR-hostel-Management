// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentSession());

  const login = (email, password, role) => {
    const result = authService.authenticate(email, password, role);

    if (result.success) {
      setUser(result.user);
      const greeting = result.user.role === 'warden' ? 'Hostel Warden Portal' : 'Mess Management Hub';
      toast.success(`Welcome to ${greeting}, ${result.user.name}!`, { icon: '🔓', duration: 4000 });
    } else {
      toast.error(result.message || 'Invalid email or password.');
    }

    return result;
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getDemoUsers: authService.getDemoUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
