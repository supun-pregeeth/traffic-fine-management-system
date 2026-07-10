const defaultCitizens = [
  {
    licenseNumber: "B1234567",
    password: "password123",
    fullName: "Hirushi Perera",
    email: "hirushi@example.com",
    vehicleNumber: "WP CAB-4567"
  },
  {
    licenseNumber: "B9876543",
    password: "password123",
    fullName: "Aruni Fernando",
    email: "aruni@example.com",
    vehicleNumber: "WP CAD-9876"
  }
];

// Load from LocalStorage if exists, else use default
const getInitialCitizens = () => {
  const saved = localStorage.getItem('citizens_db');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing citizens from local storage:", e);
    }
  }
  return defaultCitizens;
};

export const mockCitizens = getInitialCitizens();

export const registerCitizen = (citizenData) => {
  const existing = mockCitizens.find(
    c => c.licenseNumber.trim().toUpperCase() === citizenData.licenseNumber.trim().toUpperCase()
  );
  if (existing) {
    return { success: false, message: "A citizen with this license number is already registered." };
  }
  mockCitizens.push(citizenData);
  localStorage.setItem('citizens_db', JSON.stringify(mockCitizens));
  return { success: true, citizen: citizenData };
};

export const mockFines = [
  {
    referenceNumber: "REF-9876-01",
    categoryCode: "CAT-A01",
    driverName: "Hirushi Perera",
    licenseNumber: "B1234567",
    vehicleNumber: "WP CAB-4567",
    violation: "Exceeding Speed Limit (100km/h in a 60km/h Zone)",
    violationDate: "2026-06-08",
    violationTime: "14:35",
    location: "Baseline Road, Colombo 05",
    officerName: "Inspector R. M. Bandara",
    officerBadge: "PS-88452",
    baseAmount: 3000,
    lateFee: 0,
    dueDate: "2026-06-22",
    status: "pending",
  },
  {
    referenceNumber: "REF-5432-02",
    categoryCode: "CAT-B04",
    driverName: "Hirushi Perera",
    licenseNumber: "B1234567",
    vehicleNumber: "WP CAB-4567",
    violation: "Reckless Driving & Overtaking from Left Side",
    violationDate: "2026-05-15",
    violationTime: "08:15",
    location: "Galle Road, Colombo 03",
    officerName: "Sergeant A. H. Silva",
    officerBadge: "PS-74931",
    baseAmount: 5000,
    lateFee: 1500,
    dueDate: "2026-05-29",
    status: "pending", // Overdue based on due date
  },
  {
    referenceNumber: "REF-1111-03",
    categoryCode: "CAT-C12",
    driverName: "Hirushi Perera",
    licenseNumber: "B1234567",
    vehicleNumber: "WP CAB-4567",
    violation: "Driving while Using Mobile Communication Device",
    violationDate: "2026-06-01",
    violationTime: "11:10",
    location: "High Level Road, Nugegoda",
    officerName: "Sub-Inspector K. L. Perera",
    officerBadge: "SI-99214",
    baseAmount: 2000,
    lateFee: 0,
    dueDate: "2026-06-15",
    status: "paid",
    paidAt: "2026-06-05 16:42",
    receiptNumber: "REC-8849-01",
    paymentMethod: "Visa ending in 4242",
  },
  {
    referenceNumber: "REF-4422-01",
    categoryCode: "CAT-A01",
    driverName: "Aruni Fernando",
    licenseNumber: "B9876543",
    vehicleNumber: "WP CAD-9876",
    violation: "Exceeding Speed Limit (75km/h in a 50km/h Zone)",
    violationDate: "2026-06-10",
    violationTime: "09:40",
    location: "Kandy Road, Kadawatha",
    officerName: "Sergeant S. K. Wickrama",
    officerBadge: "PS-12948",
    baseAmount: 3000,
    lateFee: 0,
    dueDate: "2026-06-24",
    status: "pending",
  },
  {
    referenceNumber: "REF-4422-02",
    categoryCode: "CAT-C12",
    driverName: "Aruni Fernando",
    licenseNumber: "B9876543",
    vehicleNumber: "WP CAD-9876",
    violation: "Not Wearing Seat Belt while Driving",
    violationDate: "2026-05-20",
    violationTime: "16:15",
    location: "Parliament Road, Rajagiriya",
    officerName: "Sergeant S. K. Wickrama",
    officerBadge: "PS-12948",
    baseAmount: 1000,
    lateFee: 500,
    dueDate: "2026-06-03",
    status: "pending", // Overdue
  },
  {
    referenceNumber: "REF-4422-03",
    categoryCode: "CAT-B04",
    driverName: "Aruni Fernando",
    licenseNumber: "B9876543",
    vehicleNumber: "WP CAD-9876",
    violation: "Failure to obey Traffic Light Signals",
    violationDate: "2026-05-02",
    violationTime: "11:22",
    location: "Union Place, Colombo 02",
    officerName: "Inspector R. M. Bandara",
    officerBadge: "PS-88452",
    baseAmount: 3000,
    lateFee: 0,
    dueDate: "2026-05-16",
    status: "paid",
    paidAt: "2026-05-05 10:30",
    receiptNumber: "REC-1283-02",
    paymentMethod: "MasterCard ending in **** 9912",
  }
];

export const getFine = (refNum, catCode) => {
  return mockFines.find(
    (f) =>
      f.referenceNumber.trim().toUpperCase() === refNum.trim().toUpperCase() &&
      f.categoryCode.trim().toUpperCase() === catCode.trim().toUpperCase()
  );
};

export const authenticateCitizen = (licenseNumber, password) => {
  const citizen = mockCitizens.find(
    (c) => c.licenseNumber.trim().toUpperCase() === licenseNumber.trim().toUpperCase()
  );
  if (citizen && citizen.password === password) {
    return citizen;
  }
  return null;
};
