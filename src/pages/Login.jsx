import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, FiEyeOff, FiLock, FiMail, FiZap, FiArrowRight, FiShield, 
  FiCpu, FiCheckCircle, FiUser, FiSliders, FiSun, FiActivity, FiKey
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBG from '../components/AnimatedBG';

const DEMO_ROLES = [
  { id: 'user', name: 'Customer', role: 'customer', icon: FiZap, badge: 'EV Driver', pass: '1234' },
  { id: 'MGR0001', name: 'Station Mgr', role: 'manager', icon: FiShield, badge: 'VoltHub HQ', pass: '1234' },
  { id: 'TECH001', name: 'Technician', role: 'technician', icon: FiCpu, badge: 'Field Ops', pass: '1234' },
  { id: 'SEC0001', name: 'Security', role: 'security', icon: FiCheckCircle, badge: 'Gate Control', pass: '1234' },
  { id: 'ADMIN001', name: 'Super Admin', role: 'superadmin', icon: FiKey, badge: 'System HQ', pass: '1234' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('user');
  const [password, setPassword] = useState('1234');
  const [selectedRole, setSelectedRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Animated Charging Simulation Counter for Left Panel
  const [batteryLevel, setBatteryLevel] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryLevel(prev => (prev >= 98 ? 20 : prev + 2));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const handleSelectRole = (roleItem) => {
    setSelectedRole(roleItem.id);
    setIdentifier(roleItem.id);
    setPassword(roleItem.pass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 450));
    const result = login(identifier, password);
    setLoading(false);

    if (result.success) {
      navigate(location.state?.from || '/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950 text-white">
      {/* Live Particle Canvas */}
      <AnimatedBG />

      {/* Cyber Glow Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/15 bg-slate-900/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        
        {/* LEFT COLUMN: Animated EV Supercharger & Telemetry Showcase */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between relative bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          
          {/* Top Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-primary/30 text-lg">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-primary via-emerald-300 to-cyan-400 bg-clip-text text-transparent block leading-none">
                VOLTCHARGE
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1">
                SMART EV INFRASTRUCTURE
              </span>
            </div>
          </div>

          {/* Animated EV Charging Graphic Hub */}
          <div className="my-8 space-y-6">
            
            {/* Header Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-extrabold text-[10px] uppercase tracking-widest mb-3">
                <FiActivity className="animate-pulse" /> LIVE TERMINAL TELEMETRY
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Charge Smarter.<br />
                <span className="bg-gradient-to-r from-primary via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                  Power the Grid.
                </span>
              </h1>
            </div>

            {/* Interactive Animated Charging Display Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner relative overflow-hidden space-y-4">
              
              {/* Animated Power Stream SVG Graphic */}
              <div className="relative h-20 bg-slate-900/90 rounded-xl border border-white/10 p-3 flex items-center justify-between overflow-hidden">
                {/* Station Pillar Icon */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                    <FiZap size={20} className="animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Supercharger</span>
                    <span className="text-xs font-mono font-bold text-white">250 kW DC</span>
                  </div>
                </div>

                {/* Pulsing Electric Current Cable (SVG) */}
                <div className="flex-1 mx-4 relative h-4 flex items-center">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 rounded-full animate-pulse transition-all duration-300"
                      style={{ width: `${batteryLevel}%` }}
                    />
                  </div>
                </div>

                {/* EV Battery Receiver */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Battery SoC</span>
                  <span className="text-sm font-mono font-extrabold text-primary">{batteryLevel}% ⚡</span>
                </div>
              </div>

              {/* Dynamic Battery Telemetry Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Ultra-Fast Power Session Active
                  </span>
                  <span className="text-cyan-400 font-mono">+48.5 kWh Transferred</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-primary to-cyan-400 transition-all duration-500"
                    style={{ width: `${batteryLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Grid Feature Chips */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                <strong className="text-base font-black text-primary block">99.8%</strong>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Station Uptime</span>
              </div>
              <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                <strong className="text-base font-black text-cyan-400 block">100%</strong>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Clean Energy</span>
              </div>
              <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                <strong className="text-base font-black text-emerald-400 block">24/7</strong>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Smart Grid</span>
              </div>
            </div>

          </div>

          {/* Footer Copyright */}
          <div className="text-[11px] text-slate-500 font-medium">
            © {new Date().getFullYear()} VoltCharge Networks. All rights reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: Futuristic Login Form & Role Selector */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-slate-950/70">
          
          <div>
            {/* Heading */}
            <div className="mb-6">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
                SECURE AUTHENTICATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome Back 👋
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sign in or select a quick demo role to enter the command center.
              </p>
            </div>

            {/* Role Quick Selector Cards (1-Click Demo) */}
            <div className="mb-6 space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Quick Demo Role Switcher
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {DEMO_ROLES.map(role => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelectRole(role)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary/40 shadow-lg shadow-primary/20'
                          : 'bg-white/3 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={16} className="mb-1" />
                      <span className="text-[10px] font-bold block leading-tight truncate w-full">{role.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2"
                >
                  <FiShield size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Login ID or Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Enter ID or email (e.g. CUS0001)"
                    required
                    className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full bg-slate-900 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    AUTHENTICATING TERMINAL…
                  </span>
                ) : (
                  <>IGNITE COMMAND ⚡ <FiArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Register Link */}
          <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            Need a new charging account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
              Create an account <FiArrowRight size={12} />
            </Link>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
