import { Loan } from '../types/loan';

export const INITIAL_LOANS: Loan[] = [
  {
    id: "QL-001",
    date: "14-Oct-2026",
    name: "Alupo Martha",
    phone: "0706756970",
    principal: 50000,
    rate: 10.0,
    ratePeriod: "Week",
    termWeeks: 2,
    interest: 10000,
    total: 55000,
    paidAmount: 0,
    installment: 27500,
    frequency: "Weekly",
    dueDate: "11/04/2026",
    status: "Active",
    notes: "issued",
    payments: []
  },
  {
    id: "QL-002",
    date: "16-Sep-2026",
    name: "Mwesito Rose",
    phone: "0701158091",
    principal: 18500,
    rate: 10.0,
    ratePeriod: "Week",
    termWeeks: 2,
    interest: 3700,
    total: 22200,
    paidAmount: 0,
    installment: 11100,
    frequency: "Weekly",
    dueDate: "15/11/2026",
    status: "Active",
    notes: "issued",
    payments: []
  },
  {
    id: "QL-003",
    date: "10-Oct-2026",
    name: "Nicholas",
    phone: "",
    principal: 10000,
    rate: 10.0,
    ratePeriod: "Week",
    termWeeks: 2,
    interest: 2850,
    total: 12850,
    paidAmount: 0,
    installment: 12850,
    frequency: "Weekly",
    dueDate: "24/10/2026",
    status: "Active",
    notes: "issued",
    payments: []
  },
  {
    id: "QL-004",
    date: "19-Oct-2026",
    name: "Kilanda Paul",
    phone: "0748176619",
    principal: 200000,
    rate: 10.0,
    ratePeriod: "Week",
    termWeeks: 8,
    interest: 160000,
    total: 360000,
    paidAmount: 0,
    installment: 45000,
    frequency: "Weekly",
    dueDate: "19/12/2026",
    status: "Active",
    notes: "issued - Pin 1963",
    payments: []
  },
  {
    id: "QL-005",
    date: "10-Sep-2026",
    name: "Irene G4S",
    phone: "",
    principal: 10000,
    rate: 45.0,
    ratePeriod: "Week",
    termWeeks: 4.4,
    interest: 19800,
    total: 29800,
    paidAmount: 0,
    installment: 6773,
    frequency: "Weekly",
    dueDate: "16/10/2026",
    status: "Overdue",
    notes: "issued",
    payments: []
  },
  {
    id: "QL-006",
    date: "23-Oct-2026",
    name: "Masendi Emmanuel",
    phone: "0771196405",
    principal: 30000,
    rate: 10.0,
    ratePeriod: "Week",
    termWeeks: 2,
    interest: 6000,
    total: 36000,
    paidAmount: 0,
    installment: 18000,
    frequency: "Weekly",
    dueDate: "5/11/2026",
    status: "Active",
    notes: "issued - ATM",
    payments: []
  },
  {
    id: "QL-007",
    date: "24-Oct-2026",
    name: "Ogola Daniel",
    phone: "0743719730",
    principal: 20000,
    rate: 10.0,
    ratePeriod: "Week",
    termWeeks: 2,
    interest: 4000,
    total: 24000,
    paidAmount: 0,
    installment: 12000,
    frequency: "Weekly",
    dueDate: "10-Nov-2026",
    status: "Active",
    notes: "issued - Mobile Money",
    payments: []
  }
];

export function formatUGX(amount: number): string {
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const STORAGE_KEY = 'hussein_loans_group_data_v2';
export const AUTH_STORAGE_KEY = 'hussein_loans_group_auth_v2';
export const FINGERPRINT_ENABLED_STORAGE_KEY = 'hussein_loans_group_fingerprint_enabled_v1';
export const FINGERPRINT_RECORD_STORAGE_KEY = 'hussein_loans_group_fingerprint_record_v1';

export interface FingerprintRecord {
  id: string;
  fingerLabel: string;
  enrolledAt: string;
  officerName: string;
  quality: number; // e.g. 98%
}

export function getStoredFingerprintRecord(): FingerprintRecord | null {
  try {
    const raw = localStorage.getItem(FINGERPRINT_RECORD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredFingerprintRecord(record: FingerprintRecord | null): void {
  try {
    if (record) {
      localStorage.setItem(FINGERPRINT_RECORD_STORAGE_KEY, JSON.stringify(record));
    } else {
      localStorage.removeItem(FINGERPRINT_RECORD_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save biometric record', e);
  }
}

export function getStoredFingerprintEnabled(): boolean {
  try {
    const val = localStorage.getItem(FINGERPRINT_ENABLED_STORAGE_KEY);
    // Only enabled if true AND a biometric fingerprint has been installed/enrolled
    const hasRecord = getStoredFingerprintRecord() !== null;
    return val === 'true' && hasRecord;
  } catch {
    return false;
  }
}

export function setStoredFingerprintEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(FINGERPRINT_ENABLED_STORAGE_KEY, String(enabled));
  } catch (e) {
    console.error('Failed to save fingerprint setting', e);
  }
}

export function loadLoansFromStorage(): Loan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_LOANS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_LOANS;
}

export function saveLoansToStorage(loans: Loan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
  } catch (e) {
    console.error('Failed to save loans to storage', e);
  }
}
