import React, { useState } from 'react';
import { useSystemState } from '../contexts/SystemStateContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  FiMapPin, FiCpu, FiUsers, FiDollarSign, FiMessageSquare, 
  FiSettings, FiActivity, FiPlus, FiCheck, FiAlertTriangle, FiCheckSquare,
  FiZap, FiCompass, FiInfo
} from 'react-icons/fi';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import GlassCard from '../components/GlassCard';
import CyberButton from '../components/CyberButton';

const AdminDashboard = ({ activeTab }) => {
  const { 
    stations, 
    bookings, 
    complaints, 
    settings, 
    updateFeedbackStatus, 
    updateSettings, 
    addStation,
    updateStationStatus,
    updateChargerStatus
  } = useSystemState();

  // STAFF MANAGEMENT LOCAL STATE
  const [staffList, setStaffList] = useState([
    { id: 'ADMIN001', name: 'Alex Mercer', role: 'superadmin', email: 'alex@voltcharge.com', status: 'Active' },
    { id: 'MGR001', name: 'Sarah Jenkins', role: 'manager', email: 'sarah.mgr@voltcharge.com', status: 'Active' },
    { id: 'TECH001', name: 'Dave Miller', role: 'technician', email: 'dave.tech@voltcharge.com', status: 'Active' },
    { id: 'SEC001', name: 'Guard Cooper', role: 'security', email: 'cooper.sec@voltcharge.com', status: 'Active' },
  ]);

  // FORM STATES
  const [newStationName, setNewStationName] = useState('');
  const [newStationLoc, setNewStationLoc] = useState('');
  const [newStationPrice, setNewStationPrice] = useState(0.32);
  const [newStationPower, setNewStationPower] = useState(300);
  
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('manager');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  // CALCULATE REVENUE AND LOAD STATS
  const totalRevenue = bookings
    .filter(b => b.status === 'Completed' || b.status === 'Active')
    .reduce((acc, curr) => acc + curr.price, 0);

  const activeChargersCount = stations.reduce((acc, st) => {
    return acc + st.chargers.filter(c => c.status === 'Charging').length;
  }, 0);

  const totalChargersCount = stations.reduce((acc, st) => acc + st.chargers.length, 0);

  // MOCK SYSTEM DATA FOR RECHARTS
  const hourlyLoadData = [
    { hour: '00:00', load: 85, revenue: 120 },
    { hour: '04:00', load: 45, revenue: 65 },
    { hour: '08:00', load: 180, revenue: 240 },
    { hour: '12:00', load: 380, revenue: 520 },
    { hour: '16:00', load: 440, revenue: 680 },
    { hour: '20:00', load: 310, revenue: 410 },
  ];

  const stationRevenueData = stations.map(st => {
    const rev = bookings
      .filter(b => b.stationId === st.id && (b.status === 'Completed' || b.status === 'Active'))
      .reduce((sum, curr) => sum + curr.price, 0);
    return { name: st.name.split(' ')[0], revenue: rev };
  });

  const handleCreateStation = (e) => {
    e.preventDefault();
    if (!newStationName || !newStationLoc) return;
    addStation({
      name: newStationName,
      location: newStationLoc,
      distance: '0.1 miles',
      pricePerKwh: parseFloat(newStationPrice),
      totalPowerLimit: parseInt(newStationPower),
    });
    setNewStationName('');
    setNewStationLoc('');
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    const prefix = { superadmin: 'ADMIN', manager: 'MGR', technician: 'TECH', security: 'SEC' }[newStaffRole];
    const newId = `${prefix}00${staffList.length + 1}`;
    setStaffList([...staffList, {
      id: newId,
      name: newStaffName,
      role: newStaffRole,
      email: newStaffEmail,
      status: 'Active'
    }]);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  switch (activeTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard hover={false} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-primary shrink-0">
                <FiDollarSign size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Total Revenue</span>
                <h4 className="text-2xl font-black font-mono mt-0.5">${totalRevenue.toFixed(2)}</h4>
                <span className="text-[10px] text-primary font-bold mt-1 block">Live transaction log active</span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-secondary shrink-0">
                <FiZap size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Active Grid Load</span>
                <h4 className="text-2xl font-black font-mono mt-0.5">
                  {stations.reduce((sum, st) => sum + st.currentPowerUsage, 0)} kW
                </h4>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                  Capacity: {stations.reduce((sum, st) => sum + st.totalPowerLimit, 0)} kW Limit
                </span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <FiCpu size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Bay Utilization</span>
                <h4 className="text-2xl font-black font-mono mt-0.5">
                  {activeChargersCount} / {totalChargersCount} Plugs
                </h4>
                <span className="text-[10px] text-purple-400 font-bold mt-1 block">
                  {Math.round((activeChargersCount / totalChargersCount) * 100) || 0}% active charger rate
                </span>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <FiActivity size={22} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">System Health</span>
                <h4 className="text-2xl font-black font-mono mt-0.5">98.4%</h4>
                <span className="text-[10px] text-emerald-400 font-bold mt-1 block">All main grid transformers active</span>
              </div>
            </GlassCard>
          </div>

          {/* Recharts Grid Load and Station Performance charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard hover={false} className="p-6">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <FiActivity className="text-primary" /> Daily Grid Power Load Curve (kW)
              </h3>
              <div className="h-72 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyLoadData}>
                    <defs>
                      <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E676" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0D1426', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                    <Area type="monotone" dataKey="load" stroke="#00E676" fillOpacity={1} fill="url(#colorLoad)" name="Grid Load (kW)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-6">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <FiDollarSign className="text-secondary" /> Station Revenue Generation ($)
              </h3>
              <div className="h-72 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stationRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0D1426', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                    <Bar dataKey="revenue" fill="#00B0FF" radius={[6, 6, 0, 0]} name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      );

    case 'stations':
      return (
        <div className="space-y-6">
          {/* Add Station Card */}
          <GlassCard hover={false} className="p-6">
            <h3 className="font-bold text-base border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <FiPlus /> Deploy New Charging Station Hub
            </h3>
            <form onSubmit={handleCreateStation} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Station Name</label>
                <input
                  type="text"
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  placeholder="e.g. Westside Voltpark"
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs focus:border-primary text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Location Address</label>
                <input
                  type="text"
                  value={newStationLoc}
                  onChange={(e) => setNewStationLoc(e.target.value)}
                  placeholder="e.g. 505 Industrial Blvd"
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs focus:border-primary text-white outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Price/kWh ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStationPrice}
                    onChange={(e) => setNewStationPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs focus:border-primary text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Power Limit (kW)</label>
                  <input
                    type="number"
                    value={newStationPower}
                    onChange={(e) => setNewStationPower(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs focus:border-primary text-white outline-none"
                    required
                  />
                </div>
              </div>
              <CyberButton type="submit" variant="primary" className="py-2.5 text-xs font-bold w-full">
                Initialize Hub
              </CyberButton>
            </form>
          </GlassCard>

          {/* List existing stations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stations.map(st => (
              <GlassCard key={st.id} hover={false} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      ID: {st.id}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-100 mt-1">{st.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <FiMapPin size={12} className="text-primary" /> {st.location}
                    </p>
                  </div>
                  <select
                    value={st.status}
                    onChange={(e) => updateStationStatus(st.id, e.target.value)}
                    className="bg-slate-950/80 border border-white/10 px-2 py-1 text-xs rounded-lg text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Tariff Rate</span>
                    <span className="font-bold text-primary font-mono">${st.pricePerKwh}/kWh</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Power Stream</span>
                    <span className="font-bold text-slate-200 font-mono">{st.currentPowerUsage} / {st.totalPowerLimit} kW</span>
                  </div>
                </div>

                {/* Chargers display inside station */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Connected Chargers ({st.chargers.length})</span>
                  <div className="space-y-1">
                    {st.chargers.map(ch => (
                      <div key={ch.id} className="flex justify-between items-center text-xs bg-white/3 p-2 rounded-lg border border-white/5 font-mono">
                        <div>
                          <span className="text-slate-300 font-bold">{ch.id.split('-')[1]}</span>
                          <span className="text-[10px] text-slate-500 ml-2">({ch.connector} // {ch.speed})</span>
                        </div>
                        <select
                          value={ch.status}
                          onChange={(e) => updateChargerStatus(st.id, ch.id, e.target.value)}
                          className={`bg-slate-950/90 border border-white/5 px-1.5 py-0.5 rounded text-[10px] outline-none cursor-pointer ${
                            ch.status === 'Charging' ? 'text-primary font-bold' : (ch.status === 'Available' ? 'text-secondary' : 'text-rose-400')
                          }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Charging">Charging</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </div>
                    ))}
                    {st.chargers.length === 0 && (
                      <p className="text-[10px] text-slate-500 italic">No chargers registered on this hub yet.</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      );

    case 'personnel':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Staff Registry Form */}
          <div className="lg:col-span-4">
            <GlassCard hover={false} className="space-y-4">
              <h3 className="font-bold text-base border-b border-white/10 pb-3 mb-2 flex items-center gap-2">
                <FiUsers /> Hire Operator/Staff
              </h3>
              <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Staff Member Name</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg focus:border-primary text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="e.g. john.doe@voltcharge.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg focus:border-primary text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Target Terminal Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg focus:border-primary text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="manager">Station Manager (MGR)</option>
                    <option value="technician">Field Technician (TECH)</option>
                    <option value="security">Security Guard (SEC)</option>
                    <option value="superadmin">Administrator (ADMIN)</option>
                  </select>
                </div>
                <CyberButton type="submit" variant="primary" className="w-full py-2.5 font-bold">
                  Hire & Assign Login ID
                </CyberButton>
              </form>
            </GlassCard>
          </div>

          {/* Staff List */}
          <div className="lg:col-span-8">
            <GlassCard hover={false} className="space-y-4">
              <h3 className="font-bold text-base border-b border-white/10 pb-3 flex items-center gap-2">
                <FiCheckSquare /> Active Personnel Roster
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-2.5 px-2">ID</th>
                      <th className="py-2.5 px-2">Name</th>
                      <th className="py-2.5 px-2">Assigned Role</th>
                      <th className="py-2.5 px-2">Email</th>
                      <th className="py-2.5 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {staffList.map(st => (
                      <tr key={st.id} className="hover:bg-white/3 transition-colors">
                        <td className="py-3.5 px-2 font-mono font-bold text-slate-200">{st.id}</td>
                        <td className="py-3.5 px-2 font-medium">{st.name}</td>
                        <td className="py-3.5 px-2 capitalize font-mono text-xs">{st.role}</td>
                        <td className="py-3.5 px-2 text-slate-400 text-xs">{st.email}</td>
                        <td className="py-3.5 px-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>
      );

    case 'complaints':
      return (
        <GlassCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FiMessageSquare /> Customer Feedback & Complaints Center
            </h3>
            <span className="text-xs text-slate-400 font-medium">Pending: {complaints.filter(c => c.status === 'Unresolved').length} feedback signals</span>
          </div>

          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c.id} className="p-5 rounded-2xl bg-white/3 border border-white/10 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md font-mono text-[9px] font-bold bg-white/5 border border-white/10 text-slate-400">
                      TICKET: {c.id}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-200 mt-2">{c.name} ({c.email})</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{new Date(c.date).toLocaleString()}</p>
                  </div>
                  
                  {c.status === 'Unresolved' ? (
                    <button
                      onClick={() => updateFeedbackStatus(c.id, 'Resolved')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/30 text-rose-400 hover:text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                    >
                      <FiAlertTriangle className="group-hover:hidden" />
                      <FiCheck className="hidden group-hover:block" />
                      <span>Resolve Complaint</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold">
                      <FiCheck /> Resolved
                    </span>
                  )}
                </div>
                <div className="mt-4 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-white/5 leading-relaxed">
                  {c.message}
                </div>
              </div>
            ))}
            {complaints.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active complaints or signals recorded in the feed buffer.
              </div>
            )}
          </div>
        </GlassCard>
      );

    case 'settings':
      return (
        <div className="max-w-2xl mx-auto">
          <GlassCard hover={false} className="space-y-6">
            <h3 className="font-bold text-lg border-b border-white/10 pb-4 flex items-center gap-2">
              <FiSettings /> Global Grid & Tariff Settings
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">Standard Grid Price ($/kWh)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.standardTariff}
                  onChange={(e) => updateSettings({ standardTariff: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl focus:border-primary text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">Tesla NACS Premium Add-on ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.nacsPremium}
                  onChange={(e) => updateSettings({ nacsPremium: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl focus:border-primary text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">Peak Hour Tariff Multiplier (x)</label>
                <input
                  type="number"
                  step="0.05"
                  value={settings.peakHourMultiplier}
                  onChange={(e) => updateSettings({ peakHourMultiplier: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl focus:border-primary text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">Max Station Power Alert Threshold (%)</label>
                <input
                  type="number"
                  value={settings.maxPowerThreshold}
                  onChange={(e) => updateSettings({ maxPowerThreshold: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl focus:border-primary text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="bg-white/3 border border-white/5 p-4 rounded-2xl flex items-start gap-3 mt-4">
              <FiInfo className="text-secondary shrink-0 mt-0.5 w-5 h-5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                Updating these configurations applies grid tariff adjustments in real-time. Estimations for new bookings and active load balance alarms are derived directly from these values.
              </div>
            </div>
          </GlassCard>
        </div>
      );

    default:
      return <div>Section under construction.</div>;
  }
};

export default AdminDashboard;
