import React, { createContext, useState, useContext, useEffect } from 'react';

const SystemStateContext = createContext();

export const useSystemState = () => useContext(SystemStateContext);

export const SystemStateProvider = ({ children }) => {
  // INITIAL MOCK DATA
  const initialStations = [
    {
      id: 'ST001',
      name: 'Downtown VoltHub HQ',
      location: '122 Grid Avenue, Tech City',
      distance: '1.2 miles',
      pricePerKwh: 0.32,
      totalPowerLimit: 400, // kW
      currentPowerUsage: 150, // kW
      status: 'Active',
      chargers: [
        { id: 'ST001-C01', connector: 'NACS', status: 'Available', speed: '250 kW', currentVehicle: null, currentSoC: null },
        { id: 'ST001-C02', connector: 'CCS2', status: 'Charging', speed: '150 kW', currentVehicle: 'CA-EV-8891', currentSoC: 45 },
        { id: 'ST001-C03', connector: 'CCS2', status: 'Available', speed: '150 kW', currentVehicle: null, currentSoC: null },
        { id: 'ST001-C04', connector: 'Type 2', status: 'Offline', speed: '22 kW', currentVehicle: null, currentSoC: null },
      ]
    },
    {
      id: 'ST002',
      name: 'Eastside FastGrid Hub',
      location: '58 Commerce Street, East District',
      distance: '3.4 miles',
      pricePerKwh: 0.38,
      totalPowerLimit: 250, // kW
      currentPowerUsage: 250, // kW
      status: 'Active',
      chargers: [
        { id: 'ST002-C01', connector: 'NACS', status: 'Charging', speed: '250 kW', currentVehicle: 'NY-TES-4455', currentSoC: 78 },
        { id: 'ST002-C02', connector: 'CCS2', status: 'Available', speed: '150 kW', currentVehicle: null, currentSoC: null }
      ]
    },
    {
      id: 'ST003',
      name: 'North Metro Supercharger',
      location: '88 Highway Bypass, North End',
      distance: '5.1 miles',
      pricePerKwh: 0.29,
      totalPowerLimit: 500, // kW
      currentPowerUsage: 150, // kW
      status: 'Active',
      chargers: [
        { id: 'ST003-C01', connector: 'NACS', status: 'Available', speed: '250 kW', currentVehicle: null, currentSoC: null },
        { id: 'ST003-C02', connector: 'CCS2', status: 'Occupied', speed: '150 kW', currentVehicle: 'TX-EV-1122', currentSoC: 92 },
        { id: 'ST003-C03', connector: 'Type 2', status: 'Available', speed: '22 kW', currentVehicle: null, currentSoC: null }
      ]
    }
  ];

  const initialBookings = [
    {
      bookingId: 'BK000001',
      invoiceId: 'INV000001',
      customerId: 'CUS0001',
      customerName: 'Marcus Vance',
      stationId: 'ST001',
      stationName: 'Downtown VoltHub HQ',
      chargerId: 'ST001-C02',
      timeSlot: '12:00 - 13:00',
      dateTime: new Date().toISOString(),
      vehicleNo: 'CA-EV-8891',
      connectorType: 'CCS2',
      price: 22.00,
      status: 'Active' // Pending, Approved, Rejected, Active, Completed
    },
    {
      bookingId: 'BK000002',
      invoiceId: 'INV000002',
      customerId: 'CUS0001',
      customerName: 'Marcus Vance',
      stationId: 'ST001',
      stationName: 'Downtown VoltHub HQ',
      chargerId: 'ST001-C01',
      timeSlot: '09:00 - 10:00',
      dateTime: new Date(Date.now() - 86400000).toISOString(),
      vehicleNo: 'CA-EV-8891',
      connectorType: 'NACS',
      price: 28.50,
      status: 'Completed'
    },
    {
      bookingId: 'BK000003',
      invoiceId: 'INV000003',
      customerId: 'CUS0002',
      customerName: 'Alice Rover',
      stationId: 'ST001',
      stationName: 'Downtown VoltHub HQ',
      chargerId: 'ST001-C03',
      timeSlot: '14:30 - 15:30',
      dateTime: new Date().toISOString(),
      vehicleNo: 'NY-TES-4455',
      connectorType: 'CCS2',
      price: 22.00,
      status: 'Pending'
    }
  ];

  const initialTickets = [
    {
      id: 'TKT-001',
      stationId: 'ST001',
      chargerId: 'ST001-C04',
      issue: 'Coolant leak and overheating detected on high temp cycle.',
      severity: 'High', // Low, Medium, High
      status: 'In Progress', // Assigned, In Progress, Completed
      assignedTechId: 'TECH001',
      assignedTechName: 'Dave Miller',
      createdDate: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'TKT-002',
      stationId: 'ST002',
      chargerId: 'ST002-C01',
      issue: 'RFID reader failure during card validation.',
      severity: 'Medium',
      status: 'Completed',
      assignedTechId: 'TECH001',
      assignedTechName: 'Dave Miller',
      createdDate: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: 'TKT-003',
      stationId: 'ST003',
      chargerId: 'ST003-C02',
      issue: 'Cable mechanical locking failure.',
      severity: 'Low',
      status: 'Assigned',
      assignedTechId: 'TECH001',
      assignedTechName: 'Dave Miller',
      createdDate: new Date().toISOString()
    }
  ];

  const initialComplaints = [
    {
      id: 'CMP-001',
      name: 'Marcus Vance',
      email: 'marcus@voltcharge.com',
      message: 'Charger ST001-C02 felt like it was outputting less than 150 kW today, maybe around 80 kW. Please calibrate.',
      date: new Date().toISOString(),
      status: 'Unresolved'
    },
    {
      id: 'CMP-002',
      name: 'Sarah Jenkins',
      email: 'sarah.mgr@voltcharge.com',
      message: 'Grid feedback signal fluctuates. Power line check recommended in East District.',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'Resolved'
    }
  ];

  const initialSettings = {
    standardTariff: 0.32,
    nacsPremium: 0.05,
    peakHourMultiplier: 1.25,
    maxPowerThreshold: 90, // % of grid capacity
    autoAlertThreshold: 85, // degrees C for chargers
  };

  // LOAD FROM LOCAL STORAGE OR FALLBACK
  const [stations, setStations] = useState(() => {
    const saved = localStorage.getItem('volt_stations');
    return saved ? JSON.parse(saved) : initialStations;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('volt_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('volt_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('volt_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('volt_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [smartStats, setSmartStats] = useState({
    liveWeather: {
      temp: '72°F',
      condition: 'Overcast & Cool',
      aqi: 42,
      aqiDesc: 'Good'
    },
    carbonSavedTotal: 254.8,
    activeSessionsCount: 2
  });

  // PERSIST STATE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('volt_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('volt_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('volt_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('volt_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('volt_settings', JSON.stringify(settings));
  }, [settings]);

  // AUTO-SYNC STATS AND REVENUE ON CHANGES
  useEffect(() => {
    const active = bookings.filter(b => b.status === 'Active').length;
    const completed = bookings.filter(b => b.status === 'Completed');
    const totalCarbonSaved = completed.reduce((acc, curr) => {
      const co2 = curr.connectorType === 'NACS' ? 18.5 : (curr.connectorType === 'CCS2' ? 15.0 : 8.2);
      return acc + co2;
    }, 142.5);

    setSmartStats(prev => ({
      ...prev,
      activeSessionsCount: active,
      carbonSavedTotal: parseFloat(totalCarbonSaved.toFixed(1))
    }));
  }, [bookings]);

  // ACTIONS / CONTROLLER FUNCTIONS
  const createBooking = (bookingData) => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `BK${randomDigits}`;
    const invoiceId = `INV${randomDigits}`;

    const newBooking = {
      ...bookingData,
      bookingId,
      invoiceId,
      status: 'Pending' // All new bookings are Pending until Manager approves
    };

    setBookings(prev => [newBooking, ...prev]);

    return {
      success: true,
      bookingId,
      invoiceId,
      booking: newBooking
    };
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId) {
        // If status turns to Active, we also update the corresponding charger status to "Charging"
        if (status === 'Active') {
          updateChargerStatus(b.stationId, b.chargerId, 'Charging', b.vehicleNo, 10);
        } else if (status === 'Completed' || status === 'Rejected') {
          updateChargerStatus(b.stationId, b.chargerId, 'Available', null, null);
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  const updateChargerStatus = (stationId, chargerId, status, currentVehicle = null, currentSoC = null) => {
    setStations(prev => prev.map(st => {
      if (st.id === stationId) {
        const updatedChargers = st.chargers.map(ch => {
          if (ch.id === chargerId) {
            return { ...ch, status, currentVehicle, currentSoC };
          }
          return ch;
        });

        // Recalculate station power usage
        const activeChargingSpeedTotal = updatedChargers.reduce((acc, curr) => {
          if (curr.status === 'Charging') {
            const speedNum = parseInt(curr.speed) || 50;
            return acc + speedNum;
          }
          return acc;
        }, 0);

        return {
          ...st,
          chargers: updatedChargers,
          currentPowerUsage: Math.min(st.totalPowerLimit, activeChargingSpeedTotal)
        };
      }
      return st;
    }));
  };

  const updateChargerSoC = (stationId, chargerId, soc) => {
    setStations(prev => prev.map(st => {
      if (st.id === stationId) {
        const updatedChargers = st.chargers.map(ch => {
          if (ch.id === chargerId) {
            return { ...ch, currentSoC: soc };
          }
          return ch;
        });
        return { ...st, chargers: updatedChargers };
      }
      return st;
    }));
  };

  const createTicket = (ticketData) => {
    const ticketId = `TKT-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket = {
      id: ticketId,
      createdDate: new Date().toISOString(),
      status: 'Assigned',
      ...ticketData
    };
    setTickets(prev => [newTicket, ...prev]);

    // If ticket is for a specific charger, we can put it in Maintenance
    if (ticketData.chargerId) {
      updateChargerStatus(ticketData.stationId, ticketData.chargerId, 'Offline');
    }

    return { success: true, ticket: newTicket };
  };

  const updateTicketStatus = (ticketId, status) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        // If ticket is complete, recover the charger to Available
        if (status === 'Completed' && t.chargerId) {
          updateChargerStatus(t.stationId, t.chargerId, 'Available');
        }
        return { ...t, status };
      }
      return t;
    }));
  };

  const addFeedback = (feedback) => {
    const complaintId = `CMP-${Math.floor(100 + Math.random() * 900)}`;
    const newComplaint = {
      id: complaintId,
      date: new Date().toISOString(),
      status: 'Unresolved',
      ...feedback
    };
    setComplaints(prev => [newComplaint, ...prev]);
    return { success: true };
  };

  const updateFeedbackStatus = (id, status) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addStation = (stationData) => {
    const newStation = {
      id: `ST00${stations.length + 1}`,
      chargers: [],
      currentPowerUsage: 0,
      status: 'Active',
      ...stationData
    };
    setStations(prev => [...prev, newStation]);
  };

  const updateStationStatus = (stationId, status) => {
    setStations(prev => prev.map(st => st.id === stationId ? { ...st, status } : st));
  };

  return (
    <SystemStateContext.Provider
      value={{
        stations,
        bookings,
        tickets,
        complaints,
        settings,
        smartStats,
        createBooking,
        updateBookingStatus,
        updateChargerStatus,
        updateChargerSoC,
        createTicket,
        updateTicketStatus,
        addFeedback,
        updateFeedbackStatus,
        updateSettings,
        addStation,
        updateStationStatus
      }}
    >
      {children}
    </SystemStateContext.Provider>
  );
};
