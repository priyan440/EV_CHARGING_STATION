import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiZap, FiBatteryCharging, FiCalendar, FiClock, FiMapPin, FiCheckCircle, 
  FiSliders, FiCpu, FiTruck, FiShield, FiArrowRight, FiSun, FiNavigation, 
  FiTrendingUp, FiDollarSign, FiCheck, FiInfo, FiBattery, FiActivity, FiFilter
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useSystemState } from '../contexts/SystemStateContext';

const EV_MODELS = [
  { name: 'Tesla Model 3', capacity: 75, rate: 6.8 },
  { name: 'Hyundai Ioniq 5', capacity: 77.4, rate: 6.5 },
  { name: 'Tata Nexon EV', capacity: 40.5, rate: 6.2 },
  { name: 'MG ZS EV', capacity: 50.3, rate: 6.0 },
  { name: 'Custom EV', capacity: 60.0, rate: 6.4 },
];

const TIME_SLOTS = [
  { slot: '08:00 - 09:00', type: 'offpeak', label: 'Off-Peak (-20%)', discount: 0.20 },
  { slot: '09:00 - 10:00', type: 'standard', label: 'Normal', discount: 0 },
  { slot: '10:00 - 11:00', type: 'standard', label: 'Normal', discount: 0 },
  { slot: '12:00 - 13:00', type: 'peak', label: 'High Demand', discount: -0.10 },
  { slot: '14:30 - 15:30', type: 'standard', label: 'Normal', discount: 0 },
  { slot: '18:00 - 19:00', type: 'peak', label: 'High Demand', discount: -0.10 },
  { slot: '21:00 - 22:00', type: 'offpeak', label: 'Off-Peak (-20%)', discount: 0.20 }
];

export default function Booking() {
  const { user } = useAuth();
  const { stations, createBooking } = useSystemState();
  const navigate = useNavigate();

  // Active stations only
  const activeStations = useMemo(() => stations.filter(s => s.status === 'Active'), [stations]);

  // Form State
  const [stationId, setStationId] = useState(activeStations[0]?.id || '');
  const [chargerId, setChargerId] = useState('');
  const [vehicleNo, setVehicleNo] = useState(user?.vehicle || 'TN 58 AB 1234');
  const [selectedModel, setSelectedModel] = useState(EV_MODELS[0]);
  const [batteryStart, setBatteryStart] = useState(20);
  const [batteryTarget, setBatteryTarget] = useState(85);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1].slot);
  const [duration, setDuration] = useState('1');
  const [speedFilter, setSpeedFilter] = useState('All');
  const [result, setResult] = useState(null);

  // Selected station reference
  const station = useMemo(() => stations.find(s => s.id === stationId), [stations, stationId]);

  // Available & Occupied chargers
  const chargers = useMemo(() => station?.chargers || [], [station]);

  // Selected charger reference
  const selectedCharger = useMemo(() => chargers.find(c => c.id === chargerId), [chargers, chargerId]);

  // Calculated metrics
  const energyNeeded = useMemo(() => {
    const delta = Math.max(0, batteryTarget - batteryStart);
    return Number((selectedModel.capacity * (delta / 100)).toFixed(1));
  }, [batteryStart, batteryTarget, selectedModel]);

  const chargeSpeedKw = useMemo(() => {
    if (!selectedCharger) return 150;
    const match = selectedCharger.speed.match(/\d+/);
    return match ? Number(match[0]) : 150;
  }, [selectedCharger]);

  const estChargeMins = useMemo(() => {
    if (energyNeeded <= 0) return 0;
    // Charge curve formula: energy / speed in hours * 60 * 1.12 efficiency loss
    const mins = (energyNeeded / chargeSpeedKw) * 60 * 1.12;
    return Math.max(10, Math.round(mins));
  }, [energyNeeded, chargeSpeedKw]);

  const estRangeAdded = useMemo(() => Math.round(energyNeeded * selectedModel.rate), [energyNeeded, selectedModel]);

  // Slot pricing & calculations
  const slotObj = useMemo(() => TIME_SLOTS.find(t => t.slot === timeSlot) || TIME_SLOTS[1], [timeSlot]);

  const basePricePerKwh = station?.pricePerKwh ? station.pricePerKwh * 80 : 25; // Convert base to INR equivalent ~ ₹25-30/kWh
  const rawCost = energyNeeded * basePricePerKwh;
  const ecoDiscount = slotObj.discount > 0 ? rawCost * slotObj.discount : 0;
  const peakSurcharge = slotObj.discount < 0 ? rawCost * Math.abs(slotObj.discount) : 0;
  const serviceFee = slotObj.type === 'offpeak' ? 0 : 15;
  const totalCost = Math.max(50, Number((rawCost - ecoDiscount + peakSurcharge + serviceFee).toFixed(2)));

  // Handlers
  const handleSelectStation = (id) => {
    setStationId(id);
    const targetStation = stations.find(s => s.id === id);
    const avail = targetStation?.chargers.find(c => c.status === 'Available');
    setChargerId(avail ? avail.id : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!station || !selectedCharger || !date || !vehicleNo) return;

    const response = createBooking({
      customerId: user.id,
      customerName: user.name,
      stationId: station.id,
      stationName: station.name,
      chargerId: selectedCharger.id,
      timeSlot: timeSlot,
      dateTime: new Date(`${date}T${timeSlot.slice(0, 5)}:00`).toISOString(),
      vehicleNo: vehicleNo.toUpperCase(),
      connectorType: selectedCharger.connector,
      price: totalCost,
      duration: Number(duration),
      energyKwh: energyNeeded,
      targetSoC: batteryTarget
    });

    setResult(response);
  };

  // SUCCESS STATE VIEW - CYBER DIGITAL GATE PASS
  if (result) {
    return (
      <div className="page-wrap max-w-4xl mx-auto py-8 px-4">
        <div className="glass-panel border border-primary/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden bg-slate-900/90 backdrop-blur-xl text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Success Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs tracking-wider uppercase mb-6 animate-pulse">
            <FiCheckCircle size={16} /> RESERVATION CONFIRMED & SLOT LOCKED
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            You're on the Grid ⚡
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8">
            Your charging bay reservation has been generated. Present this digital gate pass or booking ID upon arrival.
          </p>

          {/* Cyber Gate Pass Card */}
          <div className="max-w-xl mx-auto bg-slate-950/80 border border-white/10 rounded-2xl p-6 mb-8 text-left relative shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-[10px] text-primary uppercase tracking-widest font-black">RESERVATION PASS</span>
                <h3 className="text-xl font-bold text-white">{station?.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <FiMapPin className="text-primary shrink-0" /> {station?.location}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">PASS ID</span>
                <span className="font-mono text-xl font-black text-primary">{result.bookingId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bay / Charger</span>
                <strong className="text-emerald-400 font-mono text-sm block mt-0.5">{selectedCharger?.id}</strong>
                <span className="text-[10px] text-slate-500">{selectedCharger?.connector} ({selectedCharger?.speed})</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date & Time</span>
                <strong className="text-slate-200 block mt-0.5">{date}</strong>
                <span className="text-[10px] text-primary font-semibold">{timeSlot}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Battery</span>
                <strong className="text-slate-200 block mt-0.5">{batteryStart}% ➔ {batteryTarget}%</strong>
                <span className="text-[10px] text-emerald-400 font-medium">+{energyNeeded} kWh</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Amount</span>
                <strong className="text-primary text-base font-black block mt-0.5">₹{totalCost}</strong>
                <span className="text-[10px] text-slate-400">Guaranteed Rate</span>
              </div>
            </div>

            {/* Sim Barcode */}
            <div className="bg-slate-900 border border-white/10 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
                  QR
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-300 block">INVOICE: {result.invoiceId}</span>
                  <span className="text-[10px] text-emerald-400">Vehicle: {vehicleNo.toUpperCase()}</span>
                </div>
              </div>
              <span className="text-[10px] bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Approved Gate Access
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setResult(null)} 
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-semibold transition cursor-pointer text-sm"
            >
              Book Another Charging Bay
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-slate-950 font-extrabold hover:shadow-lg hover:shadow-primary/30 transition cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              Return to Dashboard <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary tracking-widest uppercase mb-2">
            <FiZap className="animate-pulse" /> NEXT-GEN RESERVATION MATRIX
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Book a Charging Bay
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Select live hubs, inspect real-time 2D bay availability, and simulate battery charging requirements.
          </p>
        </div>

        {/* Live Grid Stats */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{activeStations.length} Active Hubs Live</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-slate-300">
            <FiSun className="text-amber-400" />
            <span>Grid Status: <b className="text-primary">88% Solar Clean</b></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Controls Left + Live HUD Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 4 Interactive Reservation Steps */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: Station Selector Matrix */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 bg-slate-900/60 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Select Charging Hub</h3>
                  <p className="text-xs text-slate-400">Choose an active charging station near your location</p>
                </div>
              </div>

              {/* Speed Filters */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                {['All', '250kW', '150kW'].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setSpeedFilter(speed)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      speedFilter === speed ? 'bg-primary text-slate-950 font-extrabold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            {/* Station Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeStations.map(s => {
                const isSelected = s.id === stationId;
                const freeBays = s.chargers.filter(c => c.status === 'Available').length;
                const usagePercent = Math.round((s.currentPowerUsage / s.totalPowerLimit) * 100);

                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectStation(s.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-primary/15 to-slate-900 border-primary shadow-lg shadow-primary/10'
                        : 'bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 text-primary bg-primary/20 rounded-full p-1 border border-primary/40">
                        <FiCheck size={12} />
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.distance}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                          ₹{(s.pricePerKwh * 80).toFixed(0)}/kWh
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{s.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{s.location}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-400">Available Bays</span>
                        <span className={`font-bold ${freeBays > 0 ? 'text-primary' : 'text-rose-400'}`}>
                          {freeBays} / {s.chargers.length} Free
                        </span>
                      </div>
                      {/* Power usage meter */}
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-cyan-400 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: 2D Visual Interactive Charging Bay Layout Grid */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 bg-slate-900/60 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Interactive Charging Bay Layout</h3>
                  <p className="text-xs text-slate-400">Click an available bay to reserve connector</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In-Use</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Maintenance</span>
              </div>
            </div>

            {/* Bay Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {chargers.map((c) => {
                const isSelected = c.id === chargerId;
                const isAvailable = c.status === 'Available';
                const isOccupied = c.status === 'Charging' || c.status === 'Occupied';

                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setChargerId(c.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-b from-primary/20 to-slate-950 border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/20 scale-[1.02]'
                        : isAvailable
                        ? 'bg-white/5 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 cursor-pointer'
                        : isOccupied
                        ? 'bg-amber-500/5 border-amber-500/20 opacity-75 cursor-not-allowed'
                        : 'bg-slate-950 border-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {/* Top status indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-white tracking-wider">{c.id}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isAvailable ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : isOccupied ? 'bg-amber-400' : 'bg-slate-600'
                      }`} />
                    </div>

                    {/* Speed & Connector */}
                    <div className="my-2">
                      <span className="text-lg font-extrabold text-white block tracking-tight">{c.speed}</span>
                      <span className="text-[11px] font-semibold text-primary block mt-0.5">{c.connector}</span>
                    </div>

                    {/* Bottom Bay State Info */}
                    <div className="mt-3 pt-2 border-t border-white/10 text-[10px]">
                      {isAvailable ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <FiCheckCircle size={10} /> Ready to Book
                        </span>
                      ) : isOccupied ? (
                        <div className="text-amber-300 font-medium">
                          <span>Active: {c.currentVehicle || 'EV Session'}</span>
                          {c.currentSoC && <span className="block text-[9px] text-amber-400/80">SoC: {c.currentSoC}%</span>}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-medium">Bay Offline</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Smart AI Energy & Battery Charge Estimator */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 bg-slate-900/60 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs">
                03
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Vehicle & Battery Requirements</h3>
                <p className="text-xs text-slate-400">Configure vehicle battery target to calculate required energy</p>
              </div>
            </div>

            {/* EV Model Switcher */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Select Vehicle Preset</label>
              <div className="flex flex-wrap gap-2">
                {EV_MODELS.map(m => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedModel(m)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedModel.name === m.name
                        ? 'bg-primary text-slate-950 font-bold shadow-md shadow-primary/20'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {m.name} ({m.capacity} kWh)
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Registration */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Vehicle License / Reg Number</label>
              <div className="relative max-w-md">
                <FiTruck className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={e => setVehicleNo(e.target.value)}
                  placeholder="e.g. TN 58 AB 1234"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono uppercase tracking-wider focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Interactive Dual Battery Slider */}
            <div className="bg-slate-950/80 border border-white/10 p-5 rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FiBattery className="text-primary" /> Target Battery State of Charge (SoC)
                </span>
                <span className="text-sm font-extrabold text-primary font-mono bg-primary/10 px-3 py-1 rounded-lg border border-primary/30">
                  {batteryStart}% ➔ {batteryTarget}%
                </span>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Starting Charge</span>
                    <b className="text-slate-200">{batteryStart}%</b>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="5"
                    value={batteryStart}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setBatteryStart(val);
                      if (val >= batteryTarget) setBatteryTarget(val + 10);
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Target Charge</span>
                    <b className="text-emerald-400">{batteryTarget}%</b>
                  </div>
                  <input
                    type="range"
                    min={batteryStart + 5}
                    max="100"
                    step="5"
                    value={batteryTarget}
                    onChange={e => setBatteryTarget(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Dynamic AI Energy Calculation Display */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-center">
                <div className="bg-white/3 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Energy Needed</span>
                  <strong className="text-lg font-black text-primary block mt-0.5">{energyNeeded} <span className="text-xs font-normal">kWh</span></strong>
                </div>
                <div className="bg-white/3 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Est. Charge Time</span>
                  <strong className="text-lg font-black text-emerald-400 block mt-0.5">~{estChargeMins} <span className="text-xs font-normal">Mins</span></strong>
                </div>
                <div className="bg-white/3 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Added Range</span>
                  <strong className="text-lg font-black text-cyan-400 block mt-0.5">+{estRangeAdded} <span className="text-xs font-normal">km</span></strong>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Smart Time-Slot Timeline Grid */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 bg-slate-900/60 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs">
                04
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Date & Demand-Aware Time Slot</h3>
                <p className="text-xs text-slate-400">Select session schedule; green slots offer off-peak discounts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Reservation Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Session Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3'].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDuration(h)}
                      className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        duration === h
                          ? 'bg-primary text-slate-950 font-bold'
                          : 'bg-slate-950 border border-white/10 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {h} {h === '1' ? 'Hour' : 'Hours'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slot Chips */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Available Time Windows</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map(t => {
                  const isSelected = t.slot === timeSlot;
                  const isOffPeak = t.type === 'offpeak';
                  const isPeak = t.type === 'peak';

                  return (
                    <button
                      key={t.slot}
                      type="button"
                      onClick={() => setTimeSlot(t.slot)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/20 border-primary ring-2 ring-primary/40'
                          : isOffPeak
                          ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-400/50'
                          : isPeak
                          ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-400/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block">{t.slot}</span>
                      <span className={`text-[10px] font-semibold mt-0.5 block ${
                        isOffPeak ? 'text-emerald-400' : isPeak ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Cyber HUD Reservation Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass-panel border border-primary/30 rounded-3xl p-6 bg-slate-900/90 backdrop-blur-xl sticky top-24 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-black text-primary tracking-widest uppercase flex items-center gap-1.5">
                <FiActivity /> LIVE CYBER HUD PREVIEW
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                Lock Guaranteed
              </span>
            </div>

            {/* Station & Charger Selected Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">SELECTED HUB</span>
                <h4 className="text-base font-bold text-white mt-0.5">{station?.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <FiMapPin className="text-primary" /> {station?.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                <div className="bg-white/3 p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Charging Bay</span>
                  <strong className="text-emerald-400 font-mono">{selectedCharger?.id || 'Select Bay'}</strong>
                </div>
                <div className="bg-white/3 p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Power Rating</span>
                  <strong className="text-slate-200">{selectedCharger?.speed || '—'}</strong>
                </div>
              </div>
            </div>

            {/* Live Battery Animation Meter */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Battery Charge Target</span>
                <span className="text-primary font-bold font-mono">{batteryStart}% ➔ {batteryTarget}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-white/10 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 via-primary to-cyan-400 h-full rounded-full transition-all duration-700 shadow-lg shadow-primary/30"
                  style={{ width: `${batteryTarget}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Required: {energyNeeded} kWh</span>
                <span>Speed: ~{chargeSpeedKw} kW</span>
              </div>
            </div>

            {/* Itemized Cost Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-slate-400">Energy Cost ({energyNeeded} kWh)</span>
                <span className="font-mono">₹{rawCost.toFixed(2)}</span>
              </div>
              
              {ecoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Eco Off-Peak Discount (-20%)</span>
                  <span className="font-mono">-₹{ecoDiscount.toFixed(2)}</span>
                </div>
              )}

              {peakSurcharge > 0 && (
                <div className="flex justify-between text-amber-400 font-medium">
                  <span>Peak Demand Surcharge</span>
                  <span className="font-mono">+₹{peakSurcharge.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Smart Grid Fee</span>
                <span className="font-mono">{serviceFee === 0 ? 'FREE' : `₹${serviceFee.toFixed(2)}`}</span>
              </div>

              {/* Total Payable */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-primary/15 to-emerald-500/10 border border-primary/30 mt-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold block">TOTAL ESTIMATED RATE</span>
                  <span className="text-2xl font-black text-primary font-mono">₹{totalCost}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                  {duration} Hr Session
                </span>
              </div>
            </div>

            {/* Confirm Reservation Trigger Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedCharger}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONFIRM RESERVATION <FiZap size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
