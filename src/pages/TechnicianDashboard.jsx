import React, { useState } from 'react';
import { useSystemState } from '../contexts/SystemStateContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiCpu, FiCalendar, FiCheckSquare, FiAlertTriangle, 
  FiCheck, FiInfo, FiActivity, FiMapPin, FiClock
} from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import CyberButton from '../components/CyberButton';

const TechnicianDashboard = ({ activeTab }) => {
  const { user } = useAuth();
  const { tickets, updateTicketStatus } = useSystemState();
  const [selectedTask, setSelectedTask] = useState(null);

  // Identify technician's assigned tasks (assignedTechId)
  const myTasks = tickets.filter(t => t.assignedTechId === user.id);
  const activeTasks = myTasks.filter(t => t.status !== 'Completed');

  // MOCK SCHEDULE DATA
  const mockSchedule = [
    { day: 'Today', time: '14:30', task: 'ST001 Bay C04 cool cycle test', type: 'Repairs' },
    { day: 'Tomorrow', time: '09:00', task: 'ST002 RFID sensor calibration', type: 'Inspection' },
    { day: 'Aug 10', time: '11:00', task: 'ST003 cable mechanical clamp lube', type: 'Maintenance' },
  ];

  switch (activeTab) {
    case 'overview':
      return (
        <div className="space-y-6">
          {/* Header Panel */}
          <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0E1021] to-[#0A0F1C] border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-cyan-400 bg-cyan-500/10 rounded-full border border-cyan-500/20 uppercase">
                  FIELD ENGINEERING TERMINAL // TECH ID: {user.id}
                </span>
                <h2 className="text-3xl font-extrabold mt-3 tracking-tight">
                  Dave's Work Orders
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium">
                  Welcome to the hardware diagnostic suite. Calibrate chargers and complete repairs to restore grid bays.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Assigned Tasks</span>
                  <span className="text-2xl font-black text-cyan-400 tracking-tight font-mono">{myTasks.length} Tickets</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Unresolved</span>
                  <span className="text-2xl font-black text-rose-400 tracking-tight font-mono">{activeTasks.length} Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tickets list */}
            <div className="lg:col-span-8">
              <GlassCard hover={false} className="space-y-4">
                <h3 className="font-bold text-base border-b border-white/10 pb-3 flex items-center gap-2">
                  <FiCpu className="text-cyan-400" /> Assigned Repair Tickets & Work Orders
                </h3>

                <div className="space-y-4">
                  {myTasks.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => setSelectedTask(t)}
                      className={`p-4 rounded-2xl bg-white/3 border transition duration-200 cursor-pointer ${
                        selectedTask?.id === t.id ? 'border-cyan-400 bg-cyan-950/10 shadow-[0_0_15px_rgba(0,176,255,0.1)]' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-200">{t.id}</span>
                          <span className="text-slate-500 font-mono">|</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <FiMapPin size={12} /> {t.stationName} — Bay: {t.chargerId.split('-')[1]}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            t.severity === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {t.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            t.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-cyan-500/15 text-cyan-400'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 mt-3 leading-relaxed truncate">{t.issue}</p>
                    </div>
                  ))}
                  {myTasks.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-8">
                      No repair tickets are currently assigned to your field terminal.
                    </p>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Task Detail Overlook */}
            <div className="lg:col-span-4">
              <GlassCard hover={false} className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                    <FiCheckSquare className="text-primary" /> Active Ticket Console
                  </h3>
                  
                  {selectedTask ? (
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">Work Order ID</span>
                        <span className="font-mono text-base font-bold text-slate-200">{selectedTask.id}</span>
                      </div>

                      <div>
                        <span className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">Charger Location</span>
                        <span className="font-bold text-slate-300 flex items-center gap-1 mt-0.5">
                          <FiMapPin /> {selectedTask.stationName} (Bay {selectedTask.chargerId.split('-')[1]})
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block uppercase font-bold tracking-wider text-[10px]">Issue Details</span>
                        <p className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-slate-400 leading-relaxed mt-1">
                          {selectedTask.issue}
                        </p>
                      </div>

                      <div className="pt-2 flex gap-2">
                        {selectedTask.status === 'Assigned' && (
                          <CyberButton 
                            onClick={() => {
                              updateTicketStatus(selectedTask.id, 'In Progress');
                              setSelectedTask(prev => ({ ...prev, status: 'In Progress' }));
                            }} 
                            variant="secondary" 
                            className="w-full py-2"
                          >
                            Mark: In Progress
                          </CyberButton>
                        )}
                        {selectedTask.status === 'In Progress' && (
                          <CyberButton 
                            onClick={() => {
                              updateTicketStatus(selectedTask.id, 'Completed');
                              setSelectedTask(prev => ({ ...prev, status: 'Completed' }));
                            }} 
                            variant="primary" 
                            className="w-full py-2"
                          >
                            Mark: Completed
                          </CyberButton>
                        )}
                        {selectedTask.status === 'Completed' && (
                          <div className="bg-emerald-500/10 border border-emerald-500/25 p-2 rounded-xl text-emerald-400 font-bold text-center w-full flex items-center justify-center gap-1">
                            <FiCheck /> Repair Order Completed
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      Select a work order from the ledger to calibrate settings, update diagnostic statuses, or sign-off.
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/60 p-4 border border-white/5 rounded-2xl text-[10px] text-slate-500 flex gap-2.5 items-start mt-6">
                  <FiInfo className="text-cyan-400 shrink-0 mt-0.5 w-4 h-4" />
                  <span>
                    Completing a work order immediately restores the charger hardware state to <b>Available</b> in the client grid maps.
                  </span>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      );

    case 'calendar':
      return (
        <GlassCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FiCalendar /> Technical Schedule & Inspections
            </h3>
            <span className="text-xs text-slate-400 font-mono">Dave's Personal Calendar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSchedule.map((sch, idx) => (
              <div key={idx} className="bg-white/3 border border-white/10 p-5 rounded-2xl relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded text-[9px] font-bold uppercase tracking-wider font-mono">
                      {sch.type}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-200 mt-3">{sch.task}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                      <FiClock size={12} className="text-cyan-400" /> {sch.day} at {sch.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      );

    default:
      return <div>Section under construction.</div>;
  }
};

export default TechnicianDashboard;
