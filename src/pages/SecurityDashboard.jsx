import React, { useState } from 'react';
import { useSystemState } from '../contexts/SystemStateContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiCheckSquare, FiFileText, FiShield, FiZap, 
  FiCheckCircle, FiXCircle, FiTrendingUp, FiMapPin, FiClock
} from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import CyberButton from '../components/CyberButton';

const SecurityDashboard = ({ activeTab }) => {
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useSystemState();

  const [bookingIdInput, setBookingIdInput] = useState('');
  const [validatedDetails, setValidatedDetails] = useState(null);
  const [valError, setValError] = useState('');
  const [gateStatus, setGateStatus] = useState('Closed'); // Closed, Opening, Open, Closing

  // MOCK LOGS LOCAL STATE
  const [gateLogs, setGateLogs] = useState([
    { time: '10:15', bookingId: 'BK000002', plateNo: 'CA-EV-8891', direction: 'IN', status: 'Authorized' },
    { time: '09:45', bookingId: 'BK000001', plateNo: 'NY-TES-4455', direction: 'OUT', status: 'Authorized' },
    { time: '08:30', bookingId: 'BK000002', plateNo: 'CA-EV-8891', direction: 'OUT', status: 'Authorized' },
  ]);

  const handleValidate = (e) => {
    e.preventDefault();
    setValError('');
    setValidatedDetails(null);

    const cleanId = bookingIdInput.trim().toUpperCase();
    const found = bookings.find(b => b.bookingId === cleanId);

    if (found) {
      setValidatedDetails(found);
    } else {
      setValError('Verification Error: Invalid Booking ID. No match found in registry.');
    }
  };

  const handleGateAction = (direction) => {
    if (!validatedDetails) return;

    setGateStatus('Opening');
    setTimeout(() => {
      setGateStatus('Open');

      // Log the entrance or exit
      const newLog = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bookingId: validatedDetails.bookingId,
        plateNo: validatedDetails.vehicleNo,
        direction,
        status: 'Authorized'
      };
      setGateLogs(prev => [newLog, ...prev]);

      // If they are entering (IN) and booking was Approved, let's mark it as Active so they can start charging
      if (direction === 'IN' && validatedDetails.status === 'Approved') {
        updateBookingStatus(validatedDetails.bookingId, 'Active');
      }

      // Close gate after 4 seconds automatically
      setTimeout(() => {
        setGateStatus('Closing');
        setTimeout(() => {
          setGateStatus('Closed');
          setValidatedDetails(null);
          setBookingIdInput('');
        }, 1500);
      }, 3000);

    }, 1500);
  };

  switch (activeTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          {/* Header Portal */}
          <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1D1710] to-[#0A0F1C] border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20 uppercase">
                  SECURITY TERMINAL // SHIELD GUARD ID: {user.id}
                </span>
                <h2 className="text-3xl font-extrabold mt-3 tracking-tight">
                  Gate Control Console
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium">
                  Scan driver booking barcodes or manually search IDs. Verify registration plates before opening main barriers.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Gate State</span>
                  <span className={`text-2xl font-black tracking-tight font-mono uppercase ${
                    gateStatus === 'Open' ? 'text-primary' : (gateStatus === 'Closed' ? 'text-slate-300 animate-pulse' : 'text-amber-400')
                  }`}>
                    {gateStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ticket Scanning Input */}
            <div className="lg:col-span-6">
              <GlassCard hover={false} className="space-y-4">
                <h3 className="font-bold text-base border-b border-white/10 pb-3 flex items-center gap-2">
                  <FiShield className="text-amber-400" /> Verify Entrance Credentials
                </h3>

                <form onSubmit={handleValidate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Scan QR / Enter Booking ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bookingIdInput}
                        onChange={(e) => setBookingIdInput(e.target.value)}
                        placeholder="e.g. BK000001, BK000003"
                        className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl focus:border-amber-400 text-slate-200 outline-none font-mono uppercase"
                        required
                      />
                      <CyberButton type="submit" variant="secondary" className="px-4">
                        Validate
                      </CyberButton>
                    </div>
                  </div>
                </form>

                {valError && (
                  <div className="bg-rose-500/10 border border-rose-500/25 p-4 rounded-xl text-xs font-semibold text-rose-400 flex items-start gap-2">
                    <FiXCircle className="shrink-0 mt-0.5" />
                    <span>{valError}</span>
                  </div>
                )}

                {validatedDetails && (
                  <div className="p-4 rounded-2xl bg-white/3 border border-white/10 space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono font-bold text-slate-200">{validatedDetails.bookingId}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        validatedDetails.status === 'Approved' ? 'bg-sky-500/15 text-sky-400' : 'bg-emerald-500/15 text-emerald-400'
                      }`}>
                        {validatedDetails.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Driver Name</span>
                        <span className="font-semibold text-slate-300">{validatedDetails.customerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Plate Number</span>
                        <span className="font-mono font-semibold text-primary">{validatedDetails.vehicleNo}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Station Bay</span>
                        <span className="font-mono text-slate-300">{validatedDetails.chargerId.split('-')[1]}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Time Window</span>
                        <span className="text-slate-300">{validatedDetails.timeSlot}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex gap-2">
                      <CyberButton 
                        onClick={() => handleGateAction('IN')} 
                        disabled={validatedDetails.status !== 'Approved' && validatedDetails.status !== 'Active'}
                        variant="primary" 
                        className="flex-1 py-2 text-xs"
                      >
                        Authorize Entry (IN)
                      </CyberButton>
                      <CyberButton 
                        onClick={() => handleGateAction('OUT')} 
                        variant="glass" 
                        className="flex-1 py-2 text-xs text-slate-300"
                      >
                        Authorize Exit (OUT)
                      </CyberButton>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Live Gate Status Panel */}
            <div className="lg:col-span-6">
              <GlassCard hover={false} className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                    <FiCheckSquare className="text-primary" /> Barrier Feed & Logs
                  </h3>
                  
                  {/* High Tech Visual representation of gate */}
                  <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden shadow-inner h-48 flex flex-col justify-center items-center">
                    <div className="absolute top-3 right-3 text-[9px] text-slate-500 font-mono tracking-widest uppercase">CAM 01 // MAIN ENTRANCE</div>
                    
                    {gateStatus === 'Closed' && (
                      <div className="space-y-2">
                        <div className="h-1 bg-rose-500 w-32 mx-auto rounded shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                        <span className="font-bold text-xs text-rose-400 uppercase tracking-widest">Barriers Lowered // Secure</span>
                      </div>
                    )}
                    {(gateStatus === 'Opening' || gateStatus === 'Closing') && (
                      <div className="space-y-2">
                        <div className="h-1 bg-amber-500 w-32 mx-auto rounded rotate-12 transition-transform duration-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                        <span className="font-bold text-xs text-amber-400 uppercase tracking-widest animate-pulse">Gate {gateStatus}...</span>
                      </div>
                    )}
                    {gateStatus === 'Open' && (
                      <div className="space-y-2">
                        <div className="h-1 bg-emerald-500 w-32 mx-auto rounded -rotate-45 transition-transform duration-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                        <span className="font-bold text-xs text-emerald-400 uppercase tracking-widest font-mono">Barriers Raised // Go</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl text-[10px] text-slate-400 flex gap-2.5 items-start mt-6">
                  <FiCheckCircle className="text-primary shrink-0 mt-0.5 w-4 h-4" />
                  <span>
                    Validating booking credentials marks the reservation status as <b>Active</b>, allowing the vehicle to begin power simulation transfer inside the bay.
                  </span>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      );

    case 'logs':
      return (
        <GlassCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FiFileText /> Gate Entry/Exit Ledger logs
            </h3>
            <span className="text-xs text-slate-400 font-mono">Recorded entries: {gateLogs.length} events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-2.5 px-2">Verification Time</th>
                  <th className="py-2.5 px-2">Booking Reference</th>
                  <th className="py-2.5 px-2">Vehicle Plate No</th>
                  <th className="py-2.5 px-2">Action / Gate Direction</th>
                  <th className="py-2.5 px-2">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {gateLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-white/3 transition-colors font-mono text-xs">
                    <td className="py-3 px-2 text-slate-400 flex items-center gap-1">
                      <FiClock size={12} /> {log.time}
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-200">{log.bookingId}</td>
                    <td className="py-3 px-2 text-primary font-bold">{log.plateNo}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        log.direction === 'IN' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-sky-500/10 text-sky-400'
                      }`}>
                        Barrier: {log.direction}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-emerald-400 font-semibold">{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      );

    default:
      return <div>Section under construction.</div>;
  }
};

export default SecurityDashboard;
