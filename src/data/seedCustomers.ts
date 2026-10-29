import { CustomerContact, TelecomCarrier, AdminStaffMember } from '../types/loan';

export const ADMIN_STAFF_MEMBERS: AdminStaffMember[] = [
  { id: 'STAFF-01', name: 'Hussein', role: 'Senior Loan Officer & Admin', branch: 'Kampala Main' },
  { id: 'STAFF-02', name: 'Anyango', role: 'Credit & Field Officer', branch: 'Owino Sub-Branch' },
  { id: 'STAFF-03', name: 'Kato Emmanuel', role: 'Field Recovery Officer', branch: 'Kikuubo Office' },
  { id: 'STAFF-04', name: 'Nalubega Sarah', role: 'Branch Accounts Officer', branch: 'Kampala Main' },
  { id: 'STAFF-05', name: 'Mwesigwa David', role: 'Credit Risk Analyst', branch: 'Headquarters' },
];

export function detectUgandaCarrier(phone: string): TelecomCarrier {
  if (!phone) return 'Other';
  const clean = phone.replace(/\D/g, '');
  let prefix = '';
  if (clean.startsWith('256') && clean.length >= 5) {
    prefix = '0' + clean.substring(3, 5);
  } else if (clean.startsWith('0') && clean.length >= 3) {
    prefix = clean.substring(0, 3);
  } else if (clean.length === 9) {
    prefix = '0' + clean.substring(0, 2);
  }

  // MTN Uganda prefixes: 077, 078, 076, 039
  if (['077', '078', '076', '039'].includes(prefix)) {
    return 'MTN';
  }
  // Airtel Uganda prefixes: 070, 075, 074, 020
  if (['070', '075', '074', '020'].includes(prefix)) {
    return 'Airtel';
  }
  return 'Other';
}

export function formatUgandaPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return phone;

  // If format starts with 256 (12 digits)
  if (digits.startsWith('256') && digits.length === 12) {
    return `+256 ${digits.substring(3, 6)} ${digits.substring(6, 9)} ${digits.substring(9)}`;
  }
  // If format starts with 0 (10 digits)
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  }
  // If 9 digits without 0
  if (digits.length === 9) {
    return `0${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }
  return phone;
}

export const INITIAL_CUSTOMERS: CustomerContact[] = [
  {
    id: 'CUST-001',
    name: 'Alupo Martha',
    phone: '0706756970',
    carrier: 'Airtel',
    secondaryPhone: '0772418902',
    nin: 'CM900451023MA4',
    idNumber: 'UG-NID-8820194',
    companyIdNumber: 'EMP-OW-4412',
    workplace: 'Owino Produce & Cereals Market',
    department: 'Fresh Food Wholesale',
    designation: 'Senior Grain Stall Trader',
    businessAddress: 'Stall B-14, Owino Market, Kampala',
    addedByStaff: 'Hussein (Senior Loan Officer & Admin)',
    createdAt: '12-Oct-2026',
    notes: 'Regular active borrower. Repays via Airtel Money promptly every Tuesday.',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'CUST-002',
    name: 'Mwesito Rose',
    phone: '0701158091',
    carrier: 'Airtel',
    secondaryPhone: '0754890123',
    nin: 'CF870192043RM8',
    idNumber: 'UG-NID-4519280',
    companyIdNumber: 'EMP-KK-1092',
    workplace: 'Kikuubo Commercial Traders',
    department: 'FMCG Retail & Distribution',
    designation: 'Cosmetics Store Manager',
    businessAddress: 'Plot 18, Nakivubo Road, Kampala',
    addedByStaff: 'Anyango (Credit & Field Officer)',
    createdAt: '14-Sep-2026',
    notes: 'Second cycle borrower. Excellent creditworthiness.',
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'CUST-003',
    name: 'Nicholas Kigozi',
    phone: '0774892105',
    carrier: 'MTN',
    secondaryPhone: '0782390144',
    nin: 'CM920182049NK2',
    idNumber: 'UG-NID-3391024',
    companyIdNumber: 'EMP-NT-3901',
    workplace: 'Nakasero Fresh Fruits Hub',
    department: 'Procurement & Quality',
    designation: 'Chief Sourcing Coordinator',
    businessAddress: 'Market Street, Nakasero, Kampala',
    addedByStaff: 'Hussein (Senior Loan Officer & Admin)',
    createdAt: '08-Oct-2026',
    notes: 'Uses MTN Mobile Money merchant pay.',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'CUST-004',
    name: 'Namubiru Sarah',
    phone: '0752109843',
    carrier: 'Airtel',
    secondaryPhone: '0703991201',
    nin: 'CF940283011SN7',
    idNumber: 'UG-NID-7721093',
    companyIdNumber: 'EMP-PL-0082',
    workplace: 'Kampala Quality Tailoring & Fabrics',
    department: 'Fashion & Design',
    designation: 'Head Seamstress & Proprietor',
    businessAddress: 'Equatoria Shopping Mall, Kampala',
    addedByStaff: 'Anyango (Credit & Field Officer)',
    createdAt: '19-Sep-2026',
    notes: 'Fabric import financing. High turnover business.',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'CUST-005',
    name: 'Mugisha Brian',
    phone: '0772648901',
    carrier: 'MTN',
    secondaryPhone: '0781204910',
    nin: 'CM910394012BM9',
    idNumber: 'UG-NID-6102934',
    companyIdNumber: 'EMP-BODA-883',
    workplace: 'Kampala Central Boda Express Co-op',
    department: 'Fleet & Transit Operations',
    designation: 'Stage Chairperson & Fleet Lead',
    businessAddress: 'City Square Stage, Kampala',
    addedByStaff: 'Kato Emmanuel (Field Recovery Officer)',
    createdAt: '10-Aug-2026',
    notes: 'Operates 3 boda bikes on Hire Purchase. Always pays via MTN MoMo.',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'CUST-006',
    name: 'Katende Joseph',
    phone: '0782190455',
    carrier: 'MTN',
    secondaryPhone: '0773901248',
    nin: 'CM890129034KJ1',
    idNumber: 'UG-NID-9920145',
    companyIdNumber: 'EMP-AG-2910',
    workplace: 'AgroFarm Inputs & Seeds Uganda',
    department: 'Sales & Field Distribution',
    designation: 'Senior Agricultural Sales Rep',
    businessAddress: 'Old Kampala Hill Road, Kampala',
    addedByStaff: 'Nalubega Sarah (Branch Accounts Officer)',
    createdAt: '25-Sep-2026',
    notes: 'Seasonal bulk seed buyer with stable monthly commission.',
    avatarColor: 'bg-emerald-700',
  },
  {
    id: 'CUST-007',
    name: 'Nabukeera Florence',
    phone: '0705882190',
    carrier: 'Airtel',
    secondaryPhone: '0751992044',
    nin: 'CF930481029FN4',
    idNumber: 'UG-NID-1209384',
    companyIdNumber: 'EMP-PH-5519',
    workplace: 'FirstCare Community Pharmacy',
    department: 'Dispensary & Pharmacy',
    designation: 'Licensed Dispenser',
    businessAddress: 'Wandegeya Trading Centre, Kampala',
    addedByStaff: 'Hussein (Senior Loan Officer & Admin)',
    createdAt: '01-Oct-2026',
    notes: 'Health sector business with guaranteed daily cash-flow.',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'CUST-008',
    name: 'Otim Denis',
    phone: '0776492019',
    carrier: 'MTN',
    secondaryPhone: '0789012344',
    nin: 'CM950182039OD3',
    idNumber: 'UG-NID-4491028',
    companyIdNumber: 'EMP-HW-7710',
    workplace: 'Hardware World Uganda Ltd',
    department: 'Warehouse & Logistics',
    designation: 'Inventory Dispatch Supervisor',
    businessAddress: 'Ntinda Industrial Area, Kampala',
    addedByStaff: 'Hussein (Senior Loan Officer & Admin)',
    createdAt: '15-Oct-2026',
    notes: 'Corporate employee with direct payroll deduction.',
    avatarColor: 'bg-slate-700',
  },
  {
    id: 'CUST-009',
    name: 'Atuhaire Brenda',
    phone: '0759201844',
    carrier: 'Airtel',
    secondaryPhone: '0702491029',
    nin: 'CF960192048BA8',
    idNumber: 'UG-NID-5501923',
    companyIdNumber: 'EMP-ED-1099',
    workplace: 'Kampala City Academy Schools',
    department: 'Academic Staff',
    designation: 'Senior Science Educator',
    businessAddress: 'Kyebando Central, Kampala',
    addedByStaff: 'Anyango (Credit & Field Officer)',
    createdAt: '18-Oct-2026',
    notes: 'School teacher salary loan customer. Guaranteed payslip.',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'CUST-010',
    name: 'Wasswa Derrick',
    phone: '0773901284',
    carrier: 'MTN',
    secondaryPhone: '0784910293',
    nin: 'CM910293049WD5',
    idNumber: 'UG-NID-3391028',
    companyIdNumber: 'EMP-AU-4421',
    workplace: 'Prime Auto Electricals & Spares',
    department: 'Technical & Repairs',
    designation: 'Master Auto Electrician',
    businessAddress: 'Kisekka Market, Kampala',
    addedByStaff: 'Kato Emmanuel (Field Recovery Officer)',
    createdAt: '20-Oct-2026',
    notes: 'High-volume workshop customer. Tools & equipment financing.',
    avatarColor: 'bg-amber-700',
  },
  {
    id: 'CUST-011',
    name: 'Kiconco Peace',
    phone: '0702938471',
    carrier: 'Airtel',
    secondaryPhone: '0759102938',
    nin: 'CF920394018KP9',
    idNumber: 'UG-NID-8819203',
    companyIdNumber: 'EMP-ST-9912',
    workplace: 'Crown Bakery & Supermarket',
    department: 'Sales & Billing',
    designation: 'Head Cashier & Store Supervisor',
    businessAddress: 'Bukoto Street, Kampala',
    addedByStaff: 'Nalubega Sarah (Branch Accounts Officer)',
    createdAt: '22-Oct-2026',
    notes: 'Supermarket staff with proven savings history in Group.',
    avatarColor: 'bg-pink-600',
  },
  {
    id: 'CUST-012',
    name: 'Sempijja Ronald',
    phone: '0788291034',
    carrier: 'MTN',
    secondaryPhone: '0771920394',
    nin: 'CM880192038SR4',
    idNumber: 'UG-NID-7710293',
    companyIdNumber: 'EMP-TR-3019',
    workplace: 'Express Cargo Movers Ltd',
    department: 'Fleet Management',
    designation: 'Commercial Truck Driver',
    businessAddress: 'Bwaise Freight Terminal, Kampala',
    addedByStaff: 'Hussein (Senior Loan Officer & Admin)',
    createdAt: '24-Oct-2026',
    notes: 'Transit logistics customer. Weekly repayments on Friday.',
    avatarColor: 'bg-cyan-700',
  },
];

export const CUSTOMERS_STORAGE_KEY = 'hussein_loans_customers_v2';

export function loadCustomersFromStorage(): CustomerContact[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) return INITIAL_CUSTOMERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load customers from storage', e);
  }
  return INITIAL_CUSTOMERS;
}

export function saveCustomersToStorage(customers: CustomerContact[]): void {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error('Failed to save customers to storage', e);
  }
}

// Helper to generate up to 200+ realistic Ugandan contacts for testing large directories
export function generateBulkUgandanCustomers(countToAdd: number, startIdx: number): CustomerContact[] {
  const firstNames = [
    'Emmanuel', 'Moses', 'Isaac', 'Daniel', 'Grace', 'Mercy', 'Doreen', 'Esther', 
    'Agnes', 'Josephine', 'Samuel', 'Patrick', 'Geoffrey', 'Julius', 'Joan', 
    'Ritah', 'Jackline', 'Simon', 'Charles', 'Christine', 'Lillian', 'Timothy',
    'Andrew', 'Richard', 'Kenneth', 'Winnie', 'Annet', 'Faith', 'Solomon', 'Paul'
  ];
  const lastNames = [
    'Mukasa', 'Kintu', 'Ocheng', 'Okello', 'Kasule', 'Byamukama', 'Namatovu', 
    'Ndagire', 'Kyomugisha', 'Auma', 'Opio', 'Tumusiime', 'Kyaligonza', 'Bukenya', 
    'Lule', 'Ssebaggala', 'Kibirige', 'Mbabazi', 'Akello', 'Nansubuga', 'Lubega',
    'Kato', 'Wasswa', 'Nalubega', 'Sserwadda', 'Mayanja', 'Nabatanzi', 'Kizza'
  ];
  const workplaces = [
    { name: 'Kikuubo General Merchandise', dept: 'Wholesale Sales', role: 'Sales Rep' },
    { name: 'Owino Textile Dealers', dept: 'Garments & Linen', role: 'Fabric Importer' },
    { name: 'Mulago Hospital Canteen', dept: 'Catering Services', role: 'Food Service Supervisor' },
    { name: 'Kampala City Transporters', dept: 'Logistics', role: 'Fleet Operator' },
    { name: 'Nakawa Vocational Institute', dept: 'Vocational Training', role: 'Technical Instructor' },
    { name: 'Quality Chemical Industries', dept: 'Packaging & Dispatch', role: 'Operations Officer' },
    { name: 'Bwaise Timber Yard Co.', dept: 'Carpentry & Mill', role: 'Senior Wood Trader' },
    { name: 'Uganda Breweries Distribution', dept: 'Depot Distribution', role: 'Route Manager' },
    { name: 'St. Balikuddembe Market Traders', dept: 'Poultry & Meat', role: 'Butchery Vendor' },
    { name: 'Stanbic Bank Sub-Agency', dept: 'Agency Banking', role: 'Mobile Money Operator' },
  ];
  const staff = ADMIN_STAFF_MEMBERS;

  const generated: CustomerContact[] = [];
  for (let i = 0; i < countToAdd; i++) {
    const num = startIdx + i;
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const wp = workplaces[Math.floor(Math.random() * workplaces.length)];
    const isMtn = Math.random() > 0.45;
    const carrier: TelecomCarrier = isMtn ? 'MTN' : 'Airtel';
    const mtnPrefix = ['077', '078', '076'][Math.floor(Math.random() * 3)];
    const airtelPrefix = ['070', '075', '074'][Math.floor(Math.random() * 3)];
    const prefix = isMtn ? mtnPrefix : airtelPrefix;
    const suffix = Math.floor(1000000 + Math.random() * 9000000).toString().substring(0, 7);
    const phone = `${prefix}${suffix}`;
    const ninYear = 85 + Math.floor(Math.random() * 18);
    const genderLetter = Math.random() > 0.5 ? 'M' : 'F';
    const nin = `C${genderLetter}${ninYear}${Math.floor(100000 + Math.random() * 900000)}${fn[0]}${ln[0]}${Math.floor(Math.random() * 9)}`;
    const staffChoice = staff[Math.floor(Math.random() * staff.length)];

    generated.push({
      id: `CUST-${String(num).padStart(3, '0')}`,
      name: `${fn} ${ln}`,
      phone,
      carrier,
      secondaryPhone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
      nin,
      idNumber: `UG-NID-${Math.floor(1000000 + Math.random() * 9000000)}`,
      companyIdNumber: `EMP-${wp.name.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      workplace: wp.name,
      department: wp.dept,
      designation: wp.role,
      businessAddress: `Sector ${Math.floor(1 + Math.random() * 8)}, Kampala Central, Uganda`,
      addedByStaff: `${staffChoice.name} (${staffChoice.role})`,
      createdAt: `${Math.floor(1 + Math.random() * 28)}-Oct-2026`,
      notes: 'Verified local microfinance KYC. Eligible for Quick Loan disbursement.',
      avatarColor: isMtn ? 'bg-amber-600' : 'bg-rose-600',
    });
  }
  return generated;
}
