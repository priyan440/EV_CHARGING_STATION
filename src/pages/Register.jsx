import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiZap, FiInfo, FiArrowLeft, FiCheckCircle, FiCopy, FiBriefcase } from 'react-icons/fi';
import CyberButton from '../components/CyberButton';
import AnimatedBG from '../components/AnimatedBG';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // Default to customer
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Interaction & UI states
  const [error, setError] = useState('');
  const [successUser, setSuccessUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !role || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = register({ name, email, phone, role, password });
    if (result.success) {
      setSuccessUser(result.user);
    } else {
      setError(result.message);
    }
  };

  const copyToClipboard = () => {
    if (successUser) {
      navigator.clipboard.writeText(successUser.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 text-white overflow-hidden">
      {/* Background visuals */}
      <AnimatedBG />

      {/* Floating neon glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <AnimatePresence mode="wait">
        {!successUser ? (
          /* REGISTRATION FORM CARD */
          <motion.div
            key="register-form"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-lg glass-panel p-8 rounded-3xl relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Top/Bottom neon glow stripes */}
            <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute bottom-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent" />

            {/* Back Button */}
            <button
              onClick={() => navigate('/login')}
              className="absolute top-6 left-6 text-slate-400 hover:text-primary transition-all duration-200 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6 mt-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/30 to-secondary/30 border border-primary/45 mb-3 shadow-[0_0_20px_rgba(0,230,118,0.2)]">
                <FiZap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                CREATE ACCOUNT
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Register as an Operator or Driver to gain terminal access
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-semibold mb-5 flex items-start gap-2"
              >
                <FiInfo className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-3 text-slate-400 w-4.5 h-4.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-3 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Role */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select System Role <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-4 top-3 text-slate-400 w-4.5 h-4.5" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all cursor-pointer text-slate-200"
                    required
                  >
                    <option value="customer">Driver / Customer (CUS)</option>
                    <option value="manager">Station Manager (MGR)</option>
                    <option value="technician">Field Technician (TECH)</option>
                    <option value="security">Security Guard (SEC)</option>
                    <option value="superadmin">System Administrator (ADMIN)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-3 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-3 text-slate-400 w-4.5 h-4.5" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <CyberButton type="submit" variant="primary" className="w-full py-3.5 mt-4">
                Register & Initialize credentials
              </CyberButton>
            </form>

            <div className="text-center mt-6 text-xs text-slate-400">
              Already registered?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-bold transition cursor-pointer bg-transparent border-none outline-none"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        ) : (
          /* SUCCESS SCREEN DISPLAYING GENERATED LOGIN ID */
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md glass-panel p-8 rounded-3xl relative border border-emerald-500/25 shadow-[0_0_50px_rgba(0,230,118,0.15)] text-center"
          >
            {/* Top neon stripe */}
            <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 mb-6 text-emerald-400">
              <FiCheckCircle className="w-10 h-10 animate-pulse" />
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              Registration Successful!
            </h2>
            <p className="text-sm text-slate-400 mb-6 px-4">
              Your system account has been initialized. Please record your unique Login ID below.
            </p>

            {/* Generated Login ID Card */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 mb-6 relative overflow-hidden group">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">
                Your Assigned Login ID
              </div>
              <div className="text-3xl font-black tracking-wider text-primary font-mono my-2 select-all">
                {successUser.id}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium capitalize">
                Role: <span className="text-white font-bold">{successUser.role === 'superadmin' ? 'Administrator' : successUser.role}</span>
              </div>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-primary/5 transition text-xs font-semibold text-slate-300 hover:text-primary cursor-pointer"
              >
                <FiCopy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 text-blue-400 p-4 rounded-xl text-xs text-left mb-6 flex gap-2.5">
              <FiInfo className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                Use this generated <b>Login ID</b> along with the password you created to authenticate at the command center.
              </span>
            </div>

            <CyberButton
              variant="secondary"
              className="w-full py-3.5"
              onClick={() => navigate('/login')}
            >
              Proceed to Secure Sign In
            </CyberButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
