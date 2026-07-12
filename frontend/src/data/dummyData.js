// ─── Dashboard Statistics ─────────────────────────────────────────────────────

export const dashboardStats = {
  totalVehicles:    42,
  activeTrips:      17,
  driversAvailable: 24,
  openMaintenance:   6,
  fleetUtilization: 81,       // percent
  fuelEfficiency:    6.4,     // km/L
  monthlyDistance:  48320,    // km
  safetyScore:       88,      // out of 100
};

// ─── Vehicles (20 records) ────────────────────────────────────────────────────

export const vehicles = [
  { id: 'V001', registrationNumber: 'MH12AB1234', model: 'Tata Prima 4928.S', driver: 'Rajesh Kumar',     status: 'On Trip',     fuelLevel: 72, odometer: 128450, location: 'Pune, Maharashtra'        },
  { id: 'V002', registrationNumber: 'MH14CD5678', model: 'Ashok Leyland 2518', driver: 'Suresh Patil',    status: 'Available',   fuelLevel: 91, odometer:  87320, location: 'Mumbai, Maharashtra'       },
  { id: 'V003', registrationNumber: 'DL01EF9012', model: 'Eicher Pro 6031',    driver: 'Amit Sharma',     status: 'Maintenance', fuelLevel: 34, odometer: 203760, location: 'Delhi Depot'               },
  { id: 'V004', registrationNumber: 'KA03GH3456', model: 'Tata LPT 1412',      driver: 'Venkatesh Rao',   status: 'On Trip',     fuelLevel: 58, odometer:  64910, location: 'Bengaluru, Karnataka'      },
  { id: 'V005', registrationNumber: 'GJ05IJ7890', model: 'Mahindra Blazo X 35',driver: 'Dhruv Patel',     status: 'Available',   fuelLevel: 83, odometer:  51200, location: 'Ahmedabad, Gujarat'        },
  { id: 'V006', registrationNumber: 'TN07KL2345', model: 'Ashok Leyland Boss',  driver: 'Murugan Selvam',  status: 'On Trip',     fuelLevel: 47, odometer: 176340, location: 'Chennai, Tamil Nadu'       },
  { id: 'V007', registrationNumber: 'RJ09MN6789', model: 'Tata Signa 4018.T',   driver: 'Lokesh Yadav',   status: 'Available',   fuelLevel: 95, odometer:  39870, location: 'Jaipur, Rajasthan'         },
  { id: 'V008', registrationNumber: 'UP11OP0123', model: 'Eicher Pro 8031',     driver: 'Ramesh Gupta',    status: 'On Trip',     fuelLevel: 62, odometer: 154280, location: 'Lucknow, Uttar Pradesh'    },
  { id: 'V009', registrationNumber: 'MP13QR4567', model: 'Tata Prima 3530.K',   driver: 'Pramod Tiwari',   status: 'Maintenance', fuelLevel: 21, odometer: 231900, location: 'Bhopal Depot'              },
  { id: 'V010', registrationNumber: 'HR15ST8901', model: 'Ashok Leyland 3518',  driver: 'Sandeep Hooda',   status: 'Available',   fuelLevel: 78, odometer:  72640, location: 'Gurugram, Haryana'         },
  { id: 'V011', registrationNumber: 'WB17UV2345', model: 'Tata LPT 2518',       driver: 'Souvik Bose',     status: 'On Trip',     fuelLevel: 53, odometer: 108930, location: 'Kolkata, West Bengal'      },
  { id: 'V012', registrationNumber: 'OR19WX6789', model: 'Mahindra Furio 14',   driver: 'Bikram Naik',     status: 'Available',   fuelLevel: 86, odometer:  47510, location: 'Bhubaneswar, Odisha'       },
  { id: 'V013', registrationNumber: 'AP21YZ0123', model: 'Eicher Pro 2095',     driver: 'Kishore Reddy',   status: 'On Trip',     fuelLevel: 69, odometer:  93650, location: 'Hyderabad, Telangana'      },
  { id: 'V014', registrationNumber: 'PB23AA4567', model: 'Tata Ace Gold',       driver: 'Gurpreet Singh',  status: 'Available',   fuelLevel: 97, odometer:  28340, location: 'Ludhiana, Punjab'          },
  { id: 'V015', registrationNumber: 'CG25BB8901', model: 'Ashok Leyland Dost',  driver: 'Sunil Verma',     status: 'On Trip',     fuelLevel: 41, odometer: 142670, location: 'Raipur, Chhattisgarh'      },
  { id: 'V016', registrationNumber: 'JH27CC2345', model: 'Tata Ultra 1518',     driver: 'Manoj Sinha',     status: 'Maintenance', fuelLevel: 18, odometer: 189450, location: 'Ranchi Depot'              },
  { id: 'V017', registrationNumber: 'AS29DD6789', model: 'Mahindra Jeeto Plus', driver: 'Biju Gogoi',      status: 'Available',   fuelLevel: 74, odometer:  33780, location: 'Guwahati, Assam'           },
  { id: 'V018', registrationNumber: 'HP31EE0123', model: 'Eicher Pro 1110',     driver: 'Rohit Thakur',    status: 'On Trip',     fuelLevel: 55, odometer:  61290, location: 'Shimla, Himachal Pradesh'  },
  { id: 'V019', registrationNumber: 'GA33FF4567', model: 'Tata Intra V30',      driver: 'Francis Dias',    status: 'Available',   fuelLevel: 88, odometer:  19870, location: 'Panaji, Goa'               },
  { id: 'V020', registrationNumber: 'KL35GG8901', model: 'Ashok Leyland Bada Dost', driver: 'Anil Menon', status: 'On Trip',     fuelLevel: 44, odometer:  84120, location: 'Kochi, Kerala'             },
];

// ─── Drivers (20 records) ─────────────────────────────────────────────────────

export const drivers = [
  { id: 'D001', name: 'Rajesh Kumar',     phone: '+91 98201 11234', licenseNumber: 'MH0120150012345', experience: 12, rating: 4.8, status: 'On Trip'   },
  { id: 'D002', name: 'Suresh Patil',     phone: '+91 97334 22345', licenseNumber: 'MH1420180023456', experience:  8, rating: 4.6, status: 'Available' },
  { id: 'D003', name: 'Amit Sharma',      phone: '+91 96445 33456', licenseNumber: 'DL0120120034567', experience: 15, rating: 4.7, status: 'Off Duty'  },
  { id: 'D004', name: 'Venkatesh Rao',    phone: '+91 95556 44567', licenseNumber: 'KA0320160045678', experience:  9, rating: 4.5, status: 'On Trip'   },
  { id: 'D005', name: 'Dhruv Patel',      phone: '+91 94667 55678', licenseNumber: 'GJ0520190056789', experience:  5, rating: 4.3, status: 'Available' },
  { id: 'D006', name: 'Murugan Selvam',   phone: '+91 93778 66789', licenseNumber: 'TN0720140067890', experience: 11, rating: 4.9, status: 'On Trip'   },
  { id: 'D007', name: 'Lokesh Yadav',     phone: '+91 92889 77890', licenseNumber: 'RJ0920210078901', experience:  3, rating: 4.1, status: 'Available' },
  { id: 'D008', name: 'Ramesh Gupta',     phone: '+91 91990 88901', licenseNumber: 'UP1120130089012', experience: 17, rating: 4.7, status: 'On Trip'   },
  { id: 'D009', name: 'Pramod Tiwari',    phone: '+91 90101 99012', licenseNumber: 'MP1320110090123', experience: 20, rating: 4.6, status: 'Off Duty'  },
  { id: 'D010', name: 'Sandeep Hooda',    phone: '+91 89212 00123', licenseNumber: 'HR1520170001234', experience:  7, rating: 4.4, status: 'Available' },
  { id: 'D011', name: 'Souvik Bose',      phone: '+91 88323 11234', licenseNumber: 'WB1720150012345', experience: 10, rating: 4.5, status: 'On Trip'   },
  { id: 'D012', name: 'Bikram Naik',      phone: '+91 87434 22345', licenseNumber: 'OR1920200023456', experience:  4, rating: 4.2, status: 'Available' },
  { id: 'D013', name: 'Kishore Reddy',    phone: '+91 86545 33456', licenseNumber: 'AP2120160034567', experience: 13, rating: 4.8, status: 'On Trip'   },
  { id: 'D014', name: 'Gurpreet Singh',   phone: '+91 85656 44567', licenseNumber: 'PB2320220045678', experience:  2, rating: 4.0, status: 'Available' },
  { id: 'D015', name: 'Sunil Verma',      phone: '+91 84767 55678', licenseNumber: 'CG2520140056789', experience: 14, rating: 4.6, status: 'On Trip'   },
  { id: 'D016', name: 'Manoj Sinha',      phone: '+91 83878 66789', licenseNumber: 'JH2720180067890', experience:  8, rating: 4.3, status: 'Off Duty'  },
  { id: 'D017', name: 'Biju Gogoi',       phone: '+91 82989 77890', licenseNumber: 'AS2920210078901', experience:  6, rating: 4.4, status: 'Available' },
  { id: 'D018', name: 'Rohit Thakur',     phone: '+91 81090 88901', licenseNumber: 'HP3120190089012', experience:  9, rating: 4.5, status: 'On Trip'   },
  { id: 'D019', name: 'Francis Dias',     phone: '+91 80101 99012', licenseNumber: 'GA3320230090123', experience:  1, rating: 3.9, status: 'Available' },
  { id: 'D020', name: 'Anil Menon',       phone: '+91 79212 00123', licenseNumber: 'KL3520120001234', experience: 16, rating: 4.7, status: 'On Trip'   },
];

// ─── Trips (20 records) ────────────────────────────────────────────────────────

export const trips = [
  { tripId: 'T-0041', source: 'Mumbai',      destination: 'Pune',          driver: 'Rajesh Kumar',    vehicle: 'MH12AB1234', distance: 148, status: 'Dispatched', startDate: '2026-07-12' },
  { tripId: 'T-0040', source: 'Bengaluru',   destination: 'Chennai',       driver: 'Venkatesh Rao',   vehicle: 'KA03GH3456', distance: 346, status: 'Completed',  startDate: '2026-07-11' },
  { tripId: 'T-0039', source: 'Delhi',       destination: 'Jaipur',        driver: 'Ramesh Gupta',    vehicle: 'UP11OP0123', distance: 281, status: 'Completed',  startDate: '2026-07-11' },
  { tripId: 'T-0038', source: 'Hyderabad',   destination: 'Vijayawada',    driver: 'Kishore Reddy',   vehicle: 'AP21YZ0123', distance: 274, status: 'Dispatched', startDate: '2026-07-12' },
  { tripId: 'T-0037', source: 'Ahmedabad',   destination: 'Surat',         driver: 'Dhruv Patel',     vehicle: 'GJ05IJ7890', distance: 262, status: 'Completed',  startDate: '2026-07-10' },
  { tripId: 'T-0036', source: 'Kolkata',     destination: 'Bhubaneswar',   driver: 'Souvik Bose',     vehicle: 'WB17UV2345', distance: 441, status: 'Dispatched', startDate: '2026-07-12' },
  { tripId: 'T-0035', source: 'Chennai',     destination: 'Coimbatore',    driver: 'Murugan Selvam',  vehicle: 'TN07KL2345', distance: 497, status: 'Completed',  startDate: '2026-07-09' },
  { tripId: 'T-0034', source: 'Ludhiana',    destination: 'Delhi',         driver: 'Gurpreet Singh',  vehicle: 'PB23AA4567', distance: 310, status: 'Completed',  startDate: '2026-07-09' },
  { tripId: 'T-0033', source: 'Raipur',      destination: 'Nagpur',        driver: 'Sunil Verma',     vehicle: 'CG25BB8901', distance: 289, status: 'Dispatched', startDate: '2026-07-12' },
  { tripId: 'T-0032', source: 'Kochi',       destination: 'Thiruvananthapuram', driver: 'Anil Menon', vehicle: 'KL35GG8901', distance: 205, status: 'Dispatched', startDate: '2026-07-12' },
  { tripId: 'T-0031', source: 'Pune',        destination: 'Nashik',        driver: 'Suresh Patil',    vehicle: 'MH14CD5678', distance: 210, status: 'Completed',  startDate: '2026-07-08' },
  { tripId: 'T-0030', source: 'Jaipur',      destination: 'Udaipur',       driver: 'Lokesh Yadav',    vehicle: 'RJ09MN6789', distance: 393, status: 'Completed',  startDate: '2026-07-08' },
  { tripId: 'T-0029', source: 'Guwahati',    destination: 'Shillong',      driver: 'Biju Gogoi',      vehicle: 'AS29DD6789', distance: 103, status: 'Completed',  startDate: '2026-07-07' },
  { tripId: 'T-0028', source: 'Shimla',      destination: 'Chandigarh',    driver: 'Rohit Thakur',    vehicle: 'HP31EE0123', distance: 117, status: 'Dispatched', startDate: '2026-07-12' },
  { tripId: 'T-0027', source: 'Panaji',      destination: 'Mumbai',        driver: 'Francis Dias',    vehicle: 'GA33FF4567', distance: 590, status: 'Completed',  startDate: '2026-07-06' },
  { tripId: 'T-0026', source: 'Bhubaneswar', destination: 'Kolkata',       driver: 'Bikram Naik',     vehicle: 'OR19WX6789', distance: 441, status: 'Completed',  startDate: '2026-07-05' },
  { tripId: 'T-0025', source: 'Lucknow',     destination: 'Varanasi',      driver: 'Ramesh Gupta',    vehicle: 'UP11OP0123', distance: 317, status: 'Cancelled',  startDate: '2026-07-04' },
  { tripId: 'T-0024', source: 'Gurugram',    destination: 'Agra',          driver: 'Sandeep Hooda',   vehicle: 'HR15ST8901', distance: 228, status: 'Completed',  startDate: '2026-07-04' },
  { tripId: 'T-0023', source: 'Mumbai',      destination: 'Goa',           driver: 'Anil Menon',      vehicle: 'KL35GG8901', distance: 597, status: 'Completed',  startDate: '2026-07-03' },
  { tripId: 'T-0022', source: 'Delhi',       destination: 'Amritsar',      driver: 'Amit Sharma',     vehicle: 'DL01EF9012', distance: 449, status: 'Completed',  startDate: '2026-07-02' },
];

// ─── Maintenance Records (10 records) ─────────────────────────────────────────────────────

export const maintenanceRecords = [
  { id: 'M-009', vehicle: 'MH12AB1234', issue: 'Engine oil overdue',           priority: 'High',   status: 'Overdue',     dueDate: '2026-07-08' },
  { id: 'M-010', vehicle: 'DL01EF9012', issue: 'Front brake pad replacement',  priority: 'High',   status: 'In Progress', dueDate: '2026-07-13' },
  { id: 'M-011', vehicle: 'MP13QR4567', issue: 'Transmission fluid flush',     priority: 'Medium', status: 'Scheduled',   dueDate: '2026-07-18' },
  { id: 'M-012', vehicle: 'JH27CC2345', issue: 'Radiator leak repair',         priority: 'High',   status: 'In Progress', dueDate: '2026-07-14' },
  { id: 'M-013', vehicle: 'TN07KL2345', issue: 'Air filter replacement',       priority: 'Low',    status: 'Scheduled',   dueDate: '2026-07-22' },
  { id: 'M-014', vehicle: 'WB17UV2345', issue: 'Tyre rotation & alignment',    priority: 'Medium', status: 'Scheduled',   dueDate: '2026-07-20' },
  { id: 'M-015', vehicle: 'UP11OP0123', issue: 'Battery replacement',          priority: 'Medium', status: 'Scheduled',   dueDate: '2026-07-19' },
  { id: 'M-016', vehicle: 'AP21YZ0123', issue: 'Clutch plate worn',            priority: 'High',   status: 'Overdue',     dueDate: '2026-07-10' },
  { id: 'M-017', vehicle: 'HR15ST8901', issue: 'Windshield wiper replacement', priority: 'Low',    status: 'Scheduled',   dueDate: '2026-07-25' },
  { id: 'M-018', vehicle: 'KA03GH3456', issue: 'Fuel injector cleaning',       priority: 'Medium', status: 'Scheduled',   dueDate: '2026-07-21' },
];

// ─── Fuel Logs (20 records) ───────────────────────────────────────────────────

export const fuelLogs = [
  { id: 'FL-001', vehicle: 'MH12AB1234', liters: 180, amount: 18540, fuelStation: 'HP Petrol Pump, Pune',          date: '2026-07-11' },
  { id: 'FL-002', vehicle: 'TN07KL2345', liters: 210, amount: 21630, fuelStation: 'Indian Oil, Chennai Bypass',    date: '2026-07-11' },
  { id: 'FL-003', vehicle: 'KA03GH3456', liters: 155, amount: 15965, fuelStation: 'BPCL, Bengaluru NH-44',         date: '2026-07-10' },
  { id: 'FL-004', vehicle: 'UP11OP0123', liters: 200, amount: 20600, fuelStation: 'HP Petrol Pump, Lucknow',       date: '2026-07-10' },
  { id: 'FL-005', vehicle: 'WB17UV2345', liters: 175, amount: 18025, fuelStation: 'Indian Oil, Durgapur',          date: '2026-07-09' },
  { id: 'FL-006', vehicle: 'GJ05IJ7890', liters: 190, amount: 19570, fuelStation: 'HP Petrol Pump, Ahmedabad',    date: '2026-07-09' },
  { id: 'FL-007', vehicle: 'AP21YZ0123', liters: 165, amount: 16995, fuelStation: 'BPCL, Hyderabad ORR',           date: '2026-07-08' },
  { id: 'FL-008', vehicle: 'CG25BB8901', liters: 185, amount: 19055, fuelStation: 'Indian Oil, Raipur Bypass',     date: '2026-07-08' },
  { id: 'FL-009', vehicle: 'HR15ST8901', liters: 140, amount: 14420, fuelStation: 'HP Petrol Pump, Gurugram',      date: '2026-07-07' },
  { id: 'FL-010', vehicle: 'RJ09MN6789', liters: 220, amount: 22660, fuelStation: 'BPCL, Jaipur NH-48',            date: '2026-07-07' },
  { id: 'FL-011', vehicle: 'KL35GG8901', liters: 160, amount: 16480, fuelStation: 'Indian Oil, Kochi NH-66',       date: '2026-07-06' },
  { id: 'FL-012', vehicle: 'PB23AA4567', liters: 130, amount: 13390, fuelStation: 'HP Petrol Pump, Ludhiana',      date: '2026-07-06' },
  { id: 'FL-013', vehicle: 'OR19WX6789', liters: 195, amount: 20085, fuelStation: 'BPCL, Bhubaneswar NH-16',       date: '2026-07-05' },
  { id: 'FL-014', vehicle: 'GA33FF4567', liters: 115, amount: 11845, fuelStation: 'Indian Oil, Panaji',             date: '2026-07-05' },
  { id: 'FL-015', vehicle: 'HP31EE0123', liters: 120, amount: 12360, fuelStation: 'HP Petrol Pump, Chandigarh',    date: '2026-07-04' },
  { id: 'FL-016', vehicle: 'AS29DD6789', liters: 135, amount: 13905, fuelStation: 'Indian Oil, Guwahati NH-27',    date: '2026-07-04' },
  { id: 'FL-017', vehicle: 'MH14CD5678', liters: 170, amount: 17510, fuelStation: 'BPCL, Mumbai-Nashik Expressway',date: '2026-07-03' },
  { id: 'FL-018', vehicle: 'DL01EF9012', liters: 205, amount: 21115, fuelStation: 'HP Petrol Pump, Delhi NH-44',   date: '2026-07-03' },
  { id: 'FL-019', vehicle: 'MP13QR4567', liters: 145, amount: 14935, fuelStation: 'Indian Oil, Bhopal Bypass',     date: '2026-07-02' },
  { id: 'FL-020', vehicle: 'JH27CC2345', liters: 150, amount: 15450, fuelStation: 'BPCL, Ranchi Ring Road',        date: '2026-07-02' },
];

// ─── Expenses (20 records) ────────────────────────────────────────────────────

export const expenses = [
  { id: 'EX-001', vehicle: 'MH12AB1234', category: 'Toll',        amount:  1240, description: 'Mumbai–Pune Expressway toll',       date: '2026-07-12' },
  { id: 'EX-002', vehicle: 'TN07KL2345', category: 'Driver DA',   amount:  2500, description: 'Daily allowance — overnight trip',   date: '2026-07-11' },
  { id: 'EX-003', vehicle: 'KA03GH3456', category: 'Toll',        amount:  1860, description: 'Bengaluru–Chennai NH-48 toll',       date: '2026-07-11' },
  { id: 'EX-004', vehicle: 'DL01EF9012', category: 'Repair',      amount: 14500, description: 'Brake pad replacement labour',        date: '2026-07-10' },
  { id: 'EX-005', vehicle: 'UP11OP0123', category: 'Toll',        amount:  2100, description: 'Lucknow–Varanasi Expressway toll',   date: '2026-07-10' },
  { id: 'EX-006', vehicle: 'WB17UV2345', category: 'Driver DA',   amount:  3000, description: 'Daily allowance — multi-day trip',   date: '2026-07-09' },
  { id: 'EX-007', vehicle: 'GJ05IJ7890', category: 'Parking',     amount:   450, description: 'Overnight parking at Surat depot',   date: '2026-07-09' },
  { id: 'EX-008', vehicle: 'AP21YZ0123', category: 'Repair',      amount:  8200, description: 'Clutch adjustment & inspection',     date: '2026-07-08' },
  { id: 'EX-009', vehicle: 'CG25BB8901', category: 'Toll',        amount:  1680, description: 'Raipur–Nagpur NH-53 toll',           date: '2026-07-08' },
  { id: 'EX-010', vehicle: 'HR15ST8901', category: 'Driver DA',   amount:  2500, description: 'Daily allowance — Agra trip',        date: '2026-07-07' },
  { id: 'EX-011', vehicle: 'RJ09MN6789', category: 'Toll',        amount:  2340, description: 'Jaipur–Udaipur NH-48 toll',          date: '2026-07-07' },
  { id: 'EX-012', vehicle: 'KL35GG8901', category: 'Parking',     amount:   300, description: 'Parking at Thiruvananthapuram depot', date: '2026-07-06' },
  { id: 'EX-013', vehicle: 'PB23AA4567', category: 'Toll',        amount:  1560, description: 'Ludhiana–Delhi NH-44 toll',          date: '2026-07-06' },
  { id: 'EX-014', vehicle: 'OR19WX6789', category: 'Driver DA',   amount:  3500, description: 'Daily allowance — Kolkata trip',     date: '2026-07-05' },
  { id: 'EX-015', vehicle: 'GA33FF4567', category: 'Toll',        amount:  3200, description: 'Goa–Mumbai coastal highway toll',    date: '2026-07-05' },
  { id: 'EX-016', vehicle: 'HP31EE0123', category: 'Repair',      amount:  5600, description: 'Suspension check & tightening',      date: '2026-07-04' },
  { id: 'EX-017', vehicle: 'AS29DD6789', category: 'Parking',     amount:   500, description: 'Overnight parking at Shillong',      date: '2026-07-04' },
  { id: 'EX-018', vehicle: 'MH14CD5678', category: 'Toll',        amount:  1120, description: 'Mumbai–Nashik Expressway toll',      date: '2026-07-03' },
  { id: 'EX-019', vehicle: 'DL01EF9012', category: 'Driver DA',   amount:  2100, description: 'Daily allowance — Delhi trip',       date: '2026-07-03' },
  { id: 'EX-020', vehicle: 'MP13QR4567', category: 'Parking',     amount:   390, description: 'Parking at Bhopal depot',            date: '2026-07-02' },
];
