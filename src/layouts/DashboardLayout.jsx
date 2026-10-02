import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSystemState } from '../contexts/SystemStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiCpu, FiUsers, FiMapPin, FiCalendar, FiCheckSquare, 
  FiFileText, FiSettings, FiUser, FiLogOut, FiMenu, FiX, 
  FiCloudDrizzle, FiAlertOctagon, FiBell, FiAward, FiMessageSquare
} from 'react-icons/fi';
import AnimatedBG from '../components/AnimatedBG';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { smartStats } = useSystemState();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // MOCK NOTIFICATIONS
  const mockNotifications = [
    { id: 1, title: 'Booking Confirmed', desc: 'Slot BK000001 confirmed at downtown HQ.', type: 'info', time: '5m ago' },
    { id: 2, title: 'Maintenance Alert', desc: 'Charger ST002-C03 has overheated.', type: 'warning', time: '30m ago' },
    { id: 3, title: 'Payment Success', desc: 'Invoice INV000002 was paid successfully.', type: 'success', time: '1h ago' }
  ];

  if (!user) return null;

  // Define sidebar navigation items with distinct page paths based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'superadmin':
        return [
          { id: 'overview', path: '/dashboard', name: 'System Analytics', icon: FiHome },
          { id: 'stations', path: '/stations', name: 'Manage Stations', icon: FiMapPin },
          { id: 'personnel', path: '/personnel', name: 'Staff Management', icon: FiUsers },
          { id: 'complaints', path: '/complaints', name: 'Customer Feedbacks', icon: FiMessageSquare },
          { id: 'settings', path: '/settings', name: 'System Settings', icon: FiSettings },
          { id: 'profile', path: '/profile', name: 'My Profile', icon: FiUser },
        ];
      case 'manager':
        return [
          { id: 'overview', path: '/dashboard', name: 'Station Overview', icon: FiHome },
          { id: 'bookings', path: '/approvals', name: 'Booking Approvals', icon: FiCalendar },
          { id: 'slots', path: '/slots', name: 'Charger Queue', icon: FiCpu },
          { id: 'maintenance', path: '/maintenance', name: 'Maintenance Log', icon: FiCheckSquare },
          { id: 'profile', path: '/profile', name: 'My Profile', icon: FiUser },
        ];
      case 'customer':
        return [
          { id: 'overview', path: '/dashboard', name: 'My Dashboard', icon: FiHome },
          { id: 'book', path: '/book', name: 'Book Charging Slot', icon: FiMapPin },
          { id: 'history', path: '/history', name: 'Booking History', icon: FiCalendar },
          { id: 'charge', path: '/simulator', name: 'Charging Simulator', icon: FiCpu },
          { id: 'billing', path: '/invoices', name: 'Invoices & Payments', icon: FiFileText },
          { id: 'support', path: '/support', name: 'Emergency Support', icon: FiAlertOctagon },
          { id: 'profile', path: '/profile', name: 'My Profile', icon: FiUser },
        ];
      case 'technician':
        return [
          { id: 'overview', path: '/dashboard', name: 'Assigned Repairs', icon: FiCpu },
          { id: 'calendar', path: '/schedule', name: 'Schedule Calendar', icon: FiCalendar },
          { id: 'profile', path: '/profile', name: 'My Profile', icon: FiUser },
        ];
      case 'security':
        return [
          { id: 'overview', path: '/dashboard', name: 'QR Gate Control', icon: FiCheckSquare },
          { id: 'logs', path: '/entry-logs', name: 'Entry/Exit Logs', icon: FiFileText },
          { id: 'profile', path: '/profile', name: 'My Profile', icon: FiUser },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen relative text-white">
      {/* Moving Cyber Background */}
      <AnimatedBG />

      {/* Sidebar for Desktop */}
      <div className={`fixed top-0 left-0 h-full glass-panel z-30 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Brand Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className="text-primary text-2xl font-bold tracking-widest animate-pulse">⚡</span>
            {sidebarOpen && (
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VOLTCHARGE
              </span>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition cursor-pointer hidden md:block">
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* User Card */}
        {sidebarOpen && (
          <div className="p-5 border-b border-white/5 bg-white/3 m-3 rounded-xl cursor-pointer hover:bg-white/5 transition" onClick={() => navigate('/profile')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-primary/40 bg-slate-800 flex items-center justify-center text-primary font-semibold shrink-0">
                <FiUser size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold truncate max-w-[140px]">{user.name}</h4>
                <span className="text-xs text-secondary capitalize font-medium">{user.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (activeTab === item.id) || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (item.path) navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border-l-4 border-primary text-primary font-semibold shadow-neon/10' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary' : 'text-slate-400'} />
                {sidebarOpen && <span className="text-sm">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
          >
            <FiLogOut size={18} />
            {sidebarOpen && <span className="text-sm font-semibold">Terminate Session</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`min-h-screen transition-all duration-300 flex flex-col ${sidebarOpen ? 'pl-0 md:pl-64' : 'pl-0 md:pl-20'}`}>
        
        {/* Header bar */}
        <header className="h-20 glass-panel border-t-0 border-x-0 flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-md">
          {/* Mobile menu trigger */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-400 hover:text-white mr-4">
            <FiMenu size={22} />
          </button>

          {/* Smart weather stats & info */}
          <div className="hidden lg:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <FiCloudDrizzle className="text-sky-400" />
              <span>Weather: <b>{smartStats.liveWeather.temp}</b>, {smartStats.liveWeather.condition}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <FiAlertOctagon className="text-emerald-400" />
              <span>AQI: <b className="text-emerald-400">{smartStats.liveWeather.aqi}</b> ({smartStats.liveWeather.aqiDesc})</span>
            </div>
            {user.role === 'customer' && (
              <>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <FiAward className="text-amber-400" />
                  <span>Eco Savings: <b>{smartStats.carbonSavedTotal} kg CO₂</b></span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notification trigger */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <FiBell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
              </button>

              {/* Notification dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl z-40 border border-white/15"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                      <h4 className="font-semibold text-sm text-primary">System Signals</h4>
                      <span className="text-xs text-slate-400 cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="space-y-3">
                      {mockNotifications.map(n => (
                        <div key={n.id} className="text-xs bg-white/3 p-3 rounded-lg border border-white/5">
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className={n.type === 'warning' ? 'text-amber-400' : 'text-slate-200'}>{n.title}</span>
                            <span className="text-slate-400 font-normal text-[10px]">{n.time}</span>
                          </div>
                          <p className="text-slate-400 leading-normal">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile trigger */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-white/10 bg-slate-800 flex items-center justify-center text-primary font-semibold shrink-0">
                <FiUser size={18} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold truncate max-w-[120px]">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content body container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
