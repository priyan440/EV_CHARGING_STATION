import React, { useState } from 'react';
import { useSystemState } from '../contexts/SystemStateContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMapPin, FiCpu, FiCalendar, FiCheckSquare, FiAlertOctagon, 
  FiZap, FiActivity, FiUser, FiInfo, FiCheck, FiX 
} from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import CyberButton from '../components/CyberButton';

const ManagerDashboard = ({ activeTab }) => {
  const { user } = useAuth();
  const { 
    stations, 
    bookings, 
    tickets, 
    updateBookingStatus, 
    updateChargerStatus,
    createTicket,
    updateTicketStatus 
  } = useSystemState();

  // FORM STATES FOR REPORTING MAINTENANCE
  const [maintCharger, setMaintCharger] = useState('');
  const [maintIssue, setMaintIssue] = useState('');
  const [maintSeverity, setMaintSeverity] = useState('Medium');
  const [ticketLogged, setTicketLogged] = useState(false);

  // Identify managed station (Manager user has user.stationId)
  const stationId = user.stationId || 'ST001';
  const station = stations.find(s => s.id === stationId);

  // Filter bookings and tickets for this station
  const stationBookings = bookings.filter(b => b.stationId === stationId);
  const pendingBookings = stationBookings.filter(b => b.status === 'Pending');
  const stationTickets = tickets.filter(t => t.stationId === stationId);

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    if (!maintIssue.trim() || !maintCharger) return;

    createTicket({
      stationId,
      stationName: station?.name || 'Local Station',
      chargerId: maintCharger,
      issue: maintIssue,
      severity: maintSeverity,
      assignedTechId: 'TECH001',
      assignedTechName: 'Dave Miller'
    });

    setTicketLogged(true);
    setMaintIssue('');
    setTimeout(() => setTicketLogged(false), 4000);
  };

  if (!station) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        System Error: Managed station details not loaded.
      </div>
    );
  }

  // RENDER BASED ON ACTIVE TAB
  switch (activeTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          {/* Welcome and Station info */}
          <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1324] to-[#0A0F1C] border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-secondary bg-secondary/10 rounded-full border border-secondary/20 uppercase">
                  MANAGEMENT PORTAL // SYSTEM ASSIGNED: {station.id}
                </span>
                <h2 className="text-3xl font-extrabold mt-3 tracking-tight">
                  Sarah's Station Dashboard
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl flex items-center gap-1.5 font-medium">
                  <FiMapPin className="text-primary" /> {station.name} — {station.location}
                </p>
              </div>

              <div className="flex gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Awaiting Action</span>
                  <span className="text-2xl font-black text-amber-400 tracking-tight font-mono">{pendingBookings.length} Bookings</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Station Load</span>
                  <span className="text-2xl font-black text-primary tracking-tight font-mono">
                    {Math.round((station.currentPowerUsage / station.totalPowerLimit) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FiZap size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Power Stream</span>
                <span className="text-lg font-bold font-mono text-slate-200">{station.currentPowerUsage} / {station.totalPowerLimit} kW</span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                <FiCpu size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Bays Active</span>
                <span className="text-lg font-bold font-mono text-slate-200">
                  {station.chargers.filter(c => c.status === 'Charging').length} / {station.chargers.length} charging
                </span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <FiCalendar size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Bookings</span>
                <span className="text-lg font-bold font-mono text-slate-200">{stationBookings.length} units</span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <FiAlertOctagon size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Active Faults</span>
                <span className="text-lg font-bold font-mono text-slate-200">
                  {stationTickets.filter(t => t.status !== 'Completed').length} tickets
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Charger Status list & Power limit */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <GlassCard hover={false} className="space-y-4">
                <h3 className="font-bold text-base border-b border-white/10 pb-3 flex items-center gap-2">
                  <FiCpu className="text-secondary" /> Active Charger Bays & Live States
                </h3>
                <div className="space-y-3">
                  {station.chargers.map(ch => (
                    <div key={ch.id} className="p-4 rounded-xl bg-white/3 border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 font-mono">
                      <div>
                        <span className="text-sm font-bold text-slate-100">{ch.id.split('-')[1]}</span>
                        <span className="text-xs text-slate-500 ml-3">({ch.connector} // {ch.speed})</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs">
                        {ch.status === 'Charging' && (
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                            <span>Vehicle: {ch.currentVehicle} ({ch.currentSoC || 45}%)</span>
                          </div>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          {
                            Available: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
                            Charging: 'bg-primary/20 text-primary border border-primary/25',
                            Occupied: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
                            Offline: 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          }[ch.status] || 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {ch.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-4">
              <GlassCard hover={false} className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                    <FiActivity className="text-primary" /> Grid Stream Cap
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Station transformer capacity is currently capped at <b>{station.totalPowerLimit} kW</b>. Adjusting charger queue and offline/maintenance locks helps stabilize load fluctuations.
                  </p>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Real-time Grid Utilization</span>
                      <span className="font-mono font-bold text-slate-200">{station.currentPowerUsage} kW</span>
                    </div>
                    <div className="h-4 w-full bg-slate-950/80 rounded-lg border border-white/10 overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-md transition-all duration-500 ${
                          station.currentPowerUsage > station.totalPowerLimit * 0.85 
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                            : 'bg-gradient-to-r from-primary to-secondary'
                        }`} 
                        style={{ width: `${Math.min(100, (station.currentPowerUsage / station.totalPowerLimit) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl text-[10px] text-slate-400 flex gap-2.5 items-start">
                  <FiInfo className="text-secondary shrink-0 mt-0.5 w-4 h-4" />
                  <span>
                    To increase overall station capability thresholds, contact the Super Administrator (ADMIN001) to alter transformer ratings.
                  </span>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      );

    case 'bookings':
      return (
        <GlassCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FiCalendar /> Booking Approvals & Queue Manager
            </h3>
            <span className="text-xs text-slate-400 font-medium">Pending Approvals: {pendingBookings.length} requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-2">Booking ID</th>
                  <th className="py-3 px-2">Customer / Driver</th>
                  <th className="py-3 px-2">Vehicle Plate</th>
                  <th className="py-3 px-2">Charger Unit</th>
                  <th className="py-3 px-2">Connector</th>
                  <th className="py-3 px-2">Time Slot</th>
                  <th className="py-3 px-2">Current Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stationBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-white/3 transition-colors">
                    <td className="py-4 px-2 font-mono font-bold text-slate-200">{b.bookingId}</td>
                    <td className="py-4 px-2 font-medium">{b.customerName}</td>
                    <td className="py-4 px-2 font-mono">{b.vehicleNo}</td>
                    <td className="py-4 px-2 font-mono">{b.chargerId.split('-')[1]}</td>
                    <td className="py-4 px-2 font-mono text-xs">{b.connectorType}</td>
                    <td className="py-4 px-2 text-xs">{b.timeSlot}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
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
                    <td className="py-4 px-2 text-right">
                      {b.status === 'Pending' && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => updateBookingStatus(b.bookingId, 'Approved')}
                            className="p-1.5 rounded-lg border border-sky-500/20 hover:border-sky-500 bg-sky-500/5 hover:bg-sky-500/20 text-sky-400 transition cursor-pointer"
                            title="Approve Slot"
                          >
                            <FiCheck size={14} />
                          </button>
                          <button
                            onClick={() => updateBookingStatus(b.bookingId, 'Rejected')}
                            className="p-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                            title="Reject Request"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}
                      {b.status === 'Approved' && (
                        <button
                          onClick={() => updateBookingStatus(b.bookingId, 'Active')}
                          className="px-2.5 py-1 rounded-lg border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/20 text-primary text-xs font-bold transition cursor-pointer"
                        >
                          Activate Plug
                        </button>
                      )}
                      {b.status === 'Active' && (
                        <button
                          onClick={() => updateBookingStatus(b.bookingId, 'Completed')}
                          className="px-2.5 py-1 rounded-lg border border-slate-500/30 hover:border-slate-300 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition cursor-pointer"
                        >
                          Complete Cycle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {stationBookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      No customer reservation records for this station.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      );

    case 'slots':
      return (
        <GlassCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FiCpu /> Charger Hardware Override console
            </h3>
            <span className="text-xs text-slate-400 font-medium">Bays status: {station.chargers.length} bays online</span>
          </div>

          <div className="space-y-4">
            {station.chargers.map(ch => (
              <div key={ch.id} className="p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 font-mono">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-200">{ch.id.split('-')[1]} // {ch.connector}</h4>
                  <p className="text-xs text-slate-400 mt-1">Charging Capability Speed: <b>{ch.speed}</b></p>
                </div>

                <div className="flex gap-2">
                  <CyberButton
                    onClick={() => updateChargerStatus(stationId, ch.id, 'Available')}
                    variant={ch.status === 'Available' ? 'primary' : 'glass'}
                    className="py-1 px-3 text-xs"
                  >
                    Available
                  </CyberButton>
                  <CyberButton
                    onClick={() => updateChargerStatus(stationId, ch.id, 'Charging')}
                    variant={ch.status === 'Charging' ? 'secondary' : 'glass'}
                    className="py-1 px-3 text-xs"
                  >
                    Charging
                  </CyberButton>
                  <CyberButton
                    onClick={() => updateChargerStatus(stationId, ch.id, 'Offline')}
                    variant={ch.status === 'Offline' ? 'danger' : 'glass'}
                    className="py-1 px-3 text-xs"
                  >
                    Offline
                  </CyberButton>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      );

    case 'maintenance':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Repair Request ticket */}
          <div className="lg:col-span-5">
            <GlassCard hover={false} className="space-y-4">
              <h3 className="font-bold text-base border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                <FiAlertOctagon className="text-amber-400" /> Log Maintenance Request
              </h3>
              
              {ticketLogged && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-lg text-xs font-semibold text-primary">
                  Maintenance ticket submitted and assigned to field technician.
                </div>
              )}

              <form onSubmit={handleMaintenanceSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Charger Unit Bay</label>
                  <select
                    value={maintCharger}
                    onChange={(e) => setMaintCharger(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-slate-300 outline-none cursor-pointer"
                    required
                  >
                    <option value="">Select bay...</option>
                    {station.chargers.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.id.split('-')[1]} ({ch.connector})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Severity Level</label>
                  <select
                    value={maintSeverity}
                    onChange={(e) => setMaintSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="Low">Low (Glitch or recalibration)</option>
                    <option value="Medium">Medium (Hardware wear-down)</option>
                    <option value="High">High (Overheating, unsafe lock, offline)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Issue description</label>
                  <textarea
                    rows="3"
                    value={maintIssue}
                    onChange={(e) => setMaintIssue(e.target.value)}
                    placeholder="e.g. RFID scanner glass cracked or temperature reading is abnormal..."
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-slate-300 focus:border-primary outline-none"
                    required
                  />
                </div>

                <CyberButton type="submit" variant="danger" className="w-full py-2.5 font-bold">
                  Dispatch Field Engineer
                </CyberButton>
              </form>
            </GlassCard>
          </div>

          {/* Active Maintenance Tickets list */}
          <div className="lg:col-span-7">
            <GlassCard hover={false} className="space-y-4">
              <h3 className="font-bold text-base border-b border-white/10 pb-3 flex items-center gap-2">
                <FiCheckSquare /> Active Work Orders & Repairs
              </h3>

              <div className="space-y-3">
                {stationTickets.map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-white/3 border border-white/10 relative overflow-hidden group">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-300">{t.id} // Bay: {t.chargerId.split('-')[1]}</span>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Assigned to: {t.assignedTechName}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          t.severity === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : (t.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10')
                        }`}>
                          {t.severity}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-sky-400'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-3 rounded-lg border border-white/5 leading-relaxed">
                      {t.issue}
                    </p>
                  </div>
                ))}
                {stationTickets.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No active maintenance tickets on this hub.
                  </p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      );

    default:
      return <div>Section under construction.</div>;
  }
};

export default ManagerDashboard;
