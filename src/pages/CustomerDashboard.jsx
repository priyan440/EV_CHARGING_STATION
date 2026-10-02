import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSystemState } from '../contexts/SystemStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiAward, FiClock, FiMapPin, FiCalendar, FiActivity, 
  FiFileText, FiAlertOctagon, FiDollarSign, FiCreditCard, FiSend,
  FiTrendingUp, FiSmile, FiShield, FiCheckCircle
} from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import CyberButton from '../components/CyberButton';
import BookingPage from './Booking';

const CustomerDashboard = ({ activeTab }) => {
  const { user } = useAuth();
  const { 
    bookings, 
    stations, 
    addFeedback, 
    updateBookingStatus, 
    updateChargerSoC 
  } = useSystemState();

  const [activeCharging, setActiveCharging] = useState(null);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargingSpeed, setChargingSpeed] = useState(150); // kW
  const [chargingInterval, setChargingInterval] = useState(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('General Query');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Find active booking for current customer
  const customerBookings = bookings.filter(b => b.customerId === user.id);
  const myActiveBooking = customerBookings.find(b => b.status === 'Active');

  // Sync charging simulator state if an active session exists
  useEffect(() => {
    if (myActiveBooking) {
      setActiveCharging(myActiveBooking);
      // Find the charger SoC in state
      const station = stations.find(s => s.id === myActiveBooking.stationId);
      const charger = station?.chargers.find(c => c.id === myActiveBooking.chargerId);
      setChargeProgress(charger?.currentSoC || 45);
      const speedNum = parseInt(charger?.speed) || 150;
      setChargingSpeed(speedNum);
    } else {
      setActiveCharging(null);
      if (chargingInterval) {
        clearInterval(chargingInterval);
        setChargingInterval(null);
      }
    }
  }, [myActiveBooking, stations]);

  // Charging Simulator timer logic
  const toggleCharging = () => {
    if (chargingInterval) {
      clearInterval(chargingInterval);
      setChargingInterval(null);
    } else {
      const interval = setInterval(() => {
        setChargeProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setChargingInterval(null);
            // Auto complete booking
            updateBookingStatus(activeCharging.bookingId, 'Completed');
            return 100;
          }
          const nextSoC = prev + 1;
          // Sync with global system state
          updateChargerSoC(activeCharging.stationId, activeCharging.chargerId, nextSoC);
          return nextSoC;
        });
      }, 1000); // 1% per second for fast demonstration
      setChargingInterval(interval);
    }
  };

  useEffect(() => {
    return () => {
      if (chargingInterval) clearInterval(chargingInterval);
    };
  }, [chargingInterval]);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    addFeedback({
      name: user.name,
      email: user.email,
      message: `[Support - ${supportCategory}] ${supportMessage}`,
    });

    setSupportSubmitted(true);
    setSupportMessage('');
    setTimeout(() => setSupportSubmitted(false), 4000);
  };

  // RENDER SECTIONS BASED ON ACTIVE TAB
  switch (activeTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1528] to-[#0A0F1C] border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                  SYSTEM ONLINE // ACCREDITED DRIVER
                </span>
                <h2 className="text-3xl font-extrabold mt-3 tracking-tight">
                  Welcome back, <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{user.name}</span>!
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl leading-relaxed">
                  Your vehicle CA-EV-8891 is linked to your smart terminal. Reserve slots, simulate live charging cycles, and access high-frequency grid analytics below.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[100px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ECO POINTS</span>
                  <span className="text-2xl font-black text-primary tracking-tight font-mono">{user.rewardPoints} XP</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[100px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">LOYALTY TIER</span>
                  <span className="text-2xl font-black text-secondary tracking-tight font-mono">{user.loyaltyTier}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard hover={false} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FiAward size={22} className="animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Carbon Offset</span>
                <h4 className="text-2xl font-black font-mono mt-0.5">{user.carbonSaved || 142.5} kg CO₂</h4>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <FiTrendingUp /> Equivalent to 6.2 pine trees
                </span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                <FiZap size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Total Power Booked</span>
                <h4 className="text-2xl font-black font-mono mt-0.5">380 kWh</h4>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Across {customerBookings.length} sessions</span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <FiActivity size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Active Bookings</span>
                <h4 className="text-2xl font-black font-mono mt-0.5">
                  {customerBookings.filter(b => b.status === 'Pending' || b.status === 'Approved' || b.status === 'Active').length} Active
                </h4>
                <span className="text-[10px] text-amber-400 font-bold mt-1 block">
                  {customerBookings.filter(b => b.status === 'Pending').length} awaiting approval
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Current Charging Grid Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Charging Session Panel */}
            <div className="lg:col-span-7">
              <GlassCard hover={false} className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                      Live Session Monitor
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">ID: {activeCharging?.bookingId || 'No active session'}</span>
                  </div>

                  {activeCharging ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-white text-base">{activeCharging.stationName}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Charger Unit: {activeCharging.chargerId.split('-')[1]} // {activeCharging.connectorType}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">
                          CHARGING ({chargeProgress}%)
                        </span>
                      </div>

                      {/* Animated Grid Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Battery State of Charge</span>
                          <span className="font-mono font-bold text-slate-200">{chargeProgress}%</span>
                        </div>
                        <div className="h-6 w-full bg-slate-950/80 rounded-xl border border-white/10 p-1 overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${chargeProgress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-lg bg-gradient-to-r from-primary to-accent relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </motion.div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white/3 p-4 rounded-2xl border border-white/5">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Speed</span>
                          <span className="font-mono font-bold text-slate-200">{chargingSpeed} kW</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">SoC Delta</span>
                          <span className="font-mono font-bold text-primary">+{chargeProgress - 45}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">Voltage</span>
                          <span className="font-mono font-bold text-slate-200">420V DC</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                        <FiZap size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">No Active Charge Cycle</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                          Book a charging slot or complete your pending booking verification with the Station Manager to begin grid transfer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {activeCharging && (
                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <CyberButton onClick={toggleCharging} variant={chargingInterval ? 'glass' : 'primary'} className="flex-1 py-2">
                      {chargingInterval ? 'Pause Simulator' : 'Sync Charging Simulator'}
                    </CyberButton>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Smart Charging Tip & Info */}
            <div className="lg:col-span-5">
              <GlassCard hover={false} className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
                    <FiAward className="text-amber-400" /> Eco Grid Incentives
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    VoltCharge implements smart grid balancing algorithm. Charging during off-peak hours (10:00 PM - 06:00 AM) rewards double eco-points.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 bg-white/3 p-3 rounded-xl border border-white/5 text-xs">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-primary flex items-center justify-center shrink-0">
                        <FiSmile size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">Peak hour protection</p>
                        <p className="text-slate-400 text-[10px]">Charging rate increases by 25% during grid peak periods.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/3 p-3 rounded-xl border border-white/5 text-xs">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-secondary flex items-center justify-center shrink-0">
                        <FiShield size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">Carbon offset multiplier</p>
                        <p className="text-slate-400 text-[10px]">Utilize 100% renewable stations ST001 & ST003 to boost multiplier.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 font-mono">VOLTCHARGE DRIVER CORE v4.2.1</span>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      );

    case 'book':
      return (
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl relative border border-white/10 shadow-2xl">
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <BookingPage />
        </div>
      );

    case 'history':
      return (
        <GlassCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FiCalendar /> Booking History & Logs
            </h3>
            <span className="text-xs text-slate-400 font-medium">Recorded bookings: {customerBookings.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-2">Booking ID</th>
                  <th className="py-3 px-2">Station Hub</th>
                  <th className="py-3 px-2">Plug / Charger</th>
                  <th className="py-3 px-2">Time Slot</th>
                  <th className="py-3 px-2">Connector</th>
                  <th className="py-3 px-2">Estimated Cost</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customerBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-white/3 transition-colors">
                    <td className="py-4 px-2 font-mono font-bold text-slate-200">{b.bookingId}</td>
                    <td className="py-4 px-2 font-medium">{b.stationName}</td>
                    <td className="py-4 px-2 font-mono">{b.chargerId.split('-')[1]}</td>
                    <td className="py-4 px-2 text-xs">{b.timeSlot}</td>
                    <td className="py-4 px-2 font-mono text-xs">{b.connectorType}</td>
                    <td className="py-4 px-2 font-bold text-primary">${parseFloat(b.price).toFixed(2)}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        {
                          Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                          Approved: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
                          Active: 'bg-primary/10 text-primary border border-primary/20 animate-pulse',
                          Completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                          Rejected: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }[b.status] || 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {customerBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      No charging reservations recorded. Go to "Book Charging Slot" to make your first reservation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      );

    case 'charge':
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <GlassCard hover={false} className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FiZap className="text-primary" /> EV Charger Simulator Terminal
              </h3>
              <span className="text-xs text-slate-400 font-mono">Interactive Hardware Sync</span>
            </div>

            {activeCharging ? (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold">{activeCharging.stationName}</h4>
                  <p className="text-xs text-slate-400">Unit: {activeCharging.chargerId.split('-')[1]} // Connector: {activeCharging.connectorType}</p>
                </div>

                {/* Cybernetic battery visualizer */}
                <div className="relative inline-flex items-center justify-center p-8 bg-slate-950/80 rounded-3xl border border-white/10 w-full max-w-sm mx-auto shadow-inner">
                  <div className="absolute top-4 right-4 text-[10px] text-primary font-mono tracking-widest uppercase">Grid Stream: ON</div>
                  
                  {/* Battery Body */}
                  <div className="w-56 h-28 border-4 border-slate-700 rounded-2xl p-1.5 flex items-center relative mr-4">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-300" style={{ width: `${chargeProgress}%` }}>
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] animate-[chargePulse_1.5s_linear_infinite]" />
                      <style>{`
                        @keyframes chargePulse {
                          0% { background-position: 0 0; }
                          100% { background-position: 30px 0; }
                        }
                      `}</style>
                    </div>
                    {/* Battery Tip */}
                    <div className="absolute -right-3.5 top-8 w-2 h-10 bg-slate-700 rounded-r-md" />
                    
                    {/* Centered Charge text */}
                    <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-2xl drop-shadow-md text-white select-none">
                      {chargeProgress}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Charging Speed</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{chargingSpeed} kW / vDC</span>
                  </div>
                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Est. Time Remaining</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{Math.ceil((100 - chargeProgress) * 0.8)} minutes</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center max-w-sm mx-auto pt-2">
                  <CyberButton onClick={toggleCharging} variant={chargingInterval ? 'danger' : 'primary'} className="flex-1 py-3">
                    {chargingInterval ? 'Pause Simulation' : 'Start Grid Transfer'}
                  </CyberButton>
                  <CyberButton onClick={() => updateBookingStatus(activeCharging.bookingId, 'Completed')} variant="glass" className="flex-1 py-3">
                    Instantly Complete
                  </CyberButton>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                  <FiZap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">No active session found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                    To access the charging simulator, make sure you have booked a slot, and that the slot is approved and marked as <span className="text-primary font-bold">Active</span> by the Station Manager.
                  </p>
                </div>
                <div className="inline-block mt-4 p-4 rounded-xl border border-white/5 bg-white/3 text-xs text-left text-slate-400 max-w-sm">
                  <b>Quick Tip:</b> Log in as the Station Manager (<code>MGR001</code>) to approve and activate pending booking requests!
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      );

    case 'billing':
      return (
        <GlassCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FiFileText /> Invoices, Bills & Receipts
            </h3>
            <span className="text-xs text-slate-400 font-medium">Billed accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-2">Invoice ID</th>
                  <th className="py-3 px-2">Billing Date</th>
                  <th className="py-3 px-2">Station Hub</th>
                  <th className="py-3 px-2">Connector</th>
                  <th className="py-3 px-2">Amount Paid</th>
                  <th className="py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customerBookings.filter(b => b.status === 'Completed' || b.status === 'Active').map((b) => (
                  <tr key={b.invoiceId} className="hover:bg-white/3 transition-colors">
                    <td className="py-4 px-2 font-mono font-bold text-slate-200">{b.invoiceId}</td>
                    <td className="py-4 px-2 text-xs">{new Date(b.dateTime).toLocaleDateString()}</td>
                    <td className="py-4 px-2">{b.stationName}</td>
                    <td className="py-4 px-2 font-mono text-xs">{b.connectorType}</td>
                    <td className="py-4 px-2 font-mono font-bold text-primary">${parseFloat(b.price).toFixed(2)}</td>
                    <td className="py-4 px-2">
                      <button 
                        onClick={() => setSelectedInvoice(b)}
                        className="text-xs text-secondary hover:text-cyan-400 hover:underline font-bold transition bg-transparent border-none outline-none cursor-pointer"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
                {customerBookings.filter(b => b.status === 'Completed' || b.status === 'Active').length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No invoices found. Complete a charging cycle to view bill generation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Invoice popup modal */}
          <AnimatePresence>
            {selectedInvoice && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md glass-panel p-6 rounded-3xl relative border border-white/10 text-left"
                >
                  <div className="text-center border-b border-white/10 pb-4 mb-4">
                    <span className="text-xl font-bold tracking-widest text-primary font-mono">VOLTCHARGE RECEIPT</span>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Invoice ID: {selectedInvoice.invoiceId}</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer Name:</span>
                      <span className="font-bold">{selectedInvoice.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer ID:</span>
                      <span className="font-mono font-bold">{selectedInvoice.customerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Linked Vehicle Plate:</span>
                      <span className="font-mono font-bold text-slate-200">{selectedInvoice.vehicleNo}</span>
                    </div>
                    <hr className="border-white/10" />
                    <div className="flex justify-between">
                      <span className="text-slate-400">Station Hub:</span>
                      <span className="font-bold">{selectedInvoice.stationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Charger Bay:</span>
                      <span className="font-mono font-bold">{selectedInvoice.chargerId.split('-')[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Connector Standard:</span>
                      <span className="font-mono font-bold">{selectedInvoice.connectorType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time Interval:</span>
                      <span className="font-bold">{selectedInvoice.timeSlot}</span>
                    </div>
                    <hr className="border-white/10" />
                    <div className="flex justify-between text-sm font-bold pt-1">
                      <span className="text-slate-200">Amount Charged (Paid):</span>
                      <span className="text-primary font-mono">${parseFloat(selectedInvoice.price).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <CyberButton onClick={() => window.print()} variant="glass" className="flex-1 text-xs">
                      Print Invoice
                    </CyberButton>
                    <CyberButton onClick={() => setSelectedInvoice(null)} variant="primary" className="flex-1 text-xs">
                      Close Receipt
                    </CyberButton>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </GlassCard>
      );

    case 'support':
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <GlassCard hover={false} className="space-y-6">
            <div>
              <h3 className="font-bold text-lg border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
                <FiAlertOctagon className="text-rose-500" /> Emergency Support & Feedback
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need immediate help with a charger? Experiencing a plug lock glitch, or need to contact the on-site security guard? Submit an emergency signal. The terminal staff will receive it instantly.
              </p>
            </div>

            {supportSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl text-xs font-semibold text-primary flex items-center gap-2"
              >
                <FiCheckCircle />
                <span>Emergency message routed to station management. Assistance is on the way.</span>
              </motion.div>
            )}

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Category of Assistance</label>
                <select
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-slate-300 text-sm"
                >
                  <option value="Mechanical Glitch">Charger Connector Mechanical Glitch (Locked Cable)</option>
                  <option value="Electrical Issue">Faulty Charging / Energy Stream Drops</option>
                  <option value="RFID Validation">RFID / Login ID validation failure</option>
                  <option value="Security Call">Contact Station Guard / Security</option>
                  <option value="General Query">General Feedback / Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Detailed Message</label>
                <textarea
                  rows="4"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your issue or write your feedback here..."
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-slate-300 text-sm placeholder:text-slate-600"
                  required
                />
              </div>

              <CyberButton type="submit" variant="danger" className="w-full py-3">
                <FiSend /> Broadcast Terminal Assistance Request
              </CyberButton>
            </form>
          </GlassCard>
        </div>
      );

    default:
      return <div>Section under construction.</div>;
  }
};

export default CustomerDashboard;
