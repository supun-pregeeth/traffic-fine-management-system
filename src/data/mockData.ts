export type FineRecord = {
  referenceNumber: string;
  categoryCode: string;
  driverName: string;
  licenseNumber: string;
  vehicleNumber: string;
  violation: string;
  violationDate: string;
  violationTime: string;
  location: string;
  officerName: string;
  officerBadge: string;
  baseAmount: number;
  lateFee: number;
  dueDate: string;
  status: string;
};

export type UserRecord = {
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'paid' | 'pending' | 'failed';
};

export const finesData: FineRecord[] = [];
export const officersData: Array<Record<string, any>> = [];
export const monthlyCollections: Array<Record<string, any>> = [];
export const violationDistribution: Array<Record<string, any>> = [];
export const paymentData: Array<Record<string, any>> = [];
export const districtCollection: Array<Record<string, any>> = [];
export const categoryRevenue: Array<Record<string, any>> = [];
export const usersData: UserRecord[] = [];
