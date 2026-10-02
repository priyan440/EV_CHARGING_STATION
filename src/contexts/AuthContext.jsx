import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const seedUsers = [
  { id: 'CUS0001', name: 'EV User', email: 'user@gmail.com', phone: '+91 98765 43210', role: 'customer', password: '1234', vehicle: 'TN 58 AB 1234' },
  { id: 'MGR0001', name: 'Sarah Jenkins', email: 'manager@voltcharge.com', phone: '+91 98765 00001', role: 'manager', password: '1234', stationId: 'ST001' },
  { id: 'TECH001', name: 'Dave Miller', email: 'tech@voltcharge.com', phone: '+91 98765 00002', role: 'technician', password: '1234' },
  { id: 'SEC0001', name: 'Guard Cooper', email: 'security@voltcharge.com', phone: '+91 98765 00003', role: 'security', password: '1234' },
  { id: 'ADMIN001', name: 'Alex Mercer', email: 'admin@voltcharge.com', phone: '+91 98765 00004', role: 'superadmin', password: '1234' },
];

const safeParse = (value, fallback) => {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => safeParse(localStorage.getItem('volt_users'), seedUsers));
  const [user, setUser] = useState(() => safeParse(localStorage.getItem('volt_session'), null));

  useEffect(() => localStorage.setItem('volt_users', JSON.stringify(users)), [users]);
  useEffect(() => {
    if (user) localStorage.setItem('volt_session', JSON.stringify(user));
    else localStorage.removeItem('volt_session');
  }, [user]);

  const login = (loginIdOrEmail, password) => {
    const value = loginIdOrEmail.trim().toLowerCase();
    const found = users.find(u => (u.id.toLowerCase() === value || u.email.toLowerCase() === value) && u.password === password);
    if (!found) return { success: false, message: 'Invalid Login ID/email or password.' };
    const session = { ...found };
    delete session.password;
    setUser(session);
    return { success: true, user: session };
  };

  const register = (data) => {
    const emailExists = users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (emailExists) return { success: false, message: 'An account with this email already exists.' };
    const prefix = { customer: 'CUS', manager: 'MGR', technician: 'TECH', security: 'SEC', superadmin: 'ADMIN' }[data.role] || 'CUS';
    const nextNumber = users.filter(u => u.role === data.role).length + 1;
    const id = `${prefix}${String(nextNumber).padStart(4, '0')}`;
    const newUser = {
      id, name: data.name.trim(), email: data.email.trim(), phone: data.phone.trim(), role: data.role,
      password: data.password, vehicle: data.vehicle?.trim() || '', stationId: data.role === 'manager' ? 'ST001' : undefined
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, user: newUser };
  };

  const updateProfile = (changes) => {
    if (!user) return;
    const updated = { ...user, ...changes };
    delete updated.password;
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...changes } : u));
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, users, login, register, logout, updateProfile }), [user, users]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
