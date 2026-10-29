export type LoanStatus = 'Active' | 'Overdue' | 'Settled';

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  channel: 'Mobile Money' | 'Cash' | 'Bank / ATM';
  notes?: string;
}

export interface Loan {
  id: string;
  date: string;
  name: string;
  phone: string;
  principal: number;
  rate: number;
  ratePeriod: string; // e.g. "Week"
  termWeeks: number;  // Loan Term (Periods)
  interest: number;
  total: number;
  paidAmount: number;
  installment: number; // Payment Per Period
  frequency: 'Weekly' | 'Monthly' | 'Daily';
  dueDate: string;
  status: LoanStatus;
  notes: string;
  payments: PaymentRecord[];
  archivedAt?: string;
  originalBorrower?: string;
  carrier?: TelecomCarrier;
  nin?: string;
  idNumber?: string;
  companyIdNumber?: string;
  department?: string;
  designation?: string;
  workplace?: string;
}

export type FilterStatus = 'ALL' | 'Active' | 'Overdue' | 'Settled';
export type ViewportMode = 'phone' | 'fullscreen';
export type SortOption = 'dueDate' | 'name' | 'principal' | 'status';
export type ActiveTab = 'loans' | 'contacts' | 'dashboard' | 'receipt' | 'history';

export type TelecomCarrier = 'MTN' | 'Airtel' | 'Other';

export interface CustomerContact {
  id: string; // e.g. "CUST-001"
  name: string;
  phone: string; // Primary MTN / Airtel number in Ugandan format
  carrier: TelecomCarrier;
  secondaryPhone?: string; // Next of kin / Guarantor phone
  nin: string; // Uganda National Identification Number (e.g. CM900231012AB4)
  idNumber: string; // National ID Number / Voter ID
  companyIdNumber: string; // Employer / Staff ID (e.g. EMP-4091)
  workplace: string; // Company / Business / Market
  department: string; // Department (e.g. Logistics, Sales, Operations)
  designation: string; // Designation / Job Role (e.g. Senior Vendor, Accountant)
  businessAddress?: string; // Location in Kampala / Uganda
  addedByStaff: string; // Admin Staff member who registered this contact
  createdAt: string;
  notes?: string;
  avatarColor?: string;
}

export interface AdminStaffMember {
  id: string;
  name: string;
  role: string;
  branch: string;
}

export interface AuthUser {
  username: string;
  displayName: string;
  role: string;
  biometricUsed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
