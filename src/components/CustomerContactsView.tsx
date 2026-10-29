import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Plus, Phone, MessageSquare, 
  Building2, Briefcase, Shield, UserCheck, 
  Wallet, Sparkles, Filter, ChevronRight, 
  ExternalLink, Trash2, Edit3, CheckCircle2, UserPlus,
  ArrowUpRight, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { CustomerContact, Loan, TelecomCarrier } from '../types/loan';
import { formatUgandaPhone, generateBulkUgandanCustomers } from '../data/seedCustomers';
import { formatUGX } from '../data/seedLoans';

interface CustomerContactsViewProps {
  customers: CustomerContact[];
  loans: Loan[];
  onOpenAddCustomer: () => void;
  onEditCustomer: (customer: CustomerContact) => void;
  onDeleteCustomer: (customerId: string, customerName: string) => void;
  onIssueLoanForCustomer: (customer: CustomerContact) => void;
  onBulkPopulate?: (count: number) => void;
  onBulkPopulateCustomers?: (count: number) => void;
  onViewLoanDetail?: (loan: Loan) => void;
}

export const CustomerContactsView: React.FC<CustomerContactsViewProps> = ({
  customers,
  loans,
  onOpenAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onIssueLoanForCustomer,
  onBulkPopulate,
  onBulkPopulateCustomers,
  onViewLoanDetail,
}) => {
  const triggerBulkPopulate = onBulkPopulate || onBulkPopulateCustomers;
  const [searchQuery, setSearchQuery] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<'ALL' | 'MTN' | 'Airtel' | 'LOANS'>('ALL');
  const [staffFilter, setStaffFilter] = useState('ALL');

  // Map customer phone / name to active loans
  const customerActiveLoansMap = useMemo(() => {
    const map = new Map<string, Loan>();
    loans.forEach((loan) => {
      if (loan.status === 'Active' || loan.status === 'Overdue') {
        const cleanPhone = loan.phone.replace(/\D/g, '');
        if (cleanPhone) map.set(cleanPhone, loan);
        map.set(loan.name.toLowerCase().trim(), loan);
      }
    });
    return map;
  }, [loans]);

  // Unique list of staff members from customers
  const staffList = useMemo(() => {
    const set = new Set<string>();
    customers.forEach(c => {
      if (c.addedByStaff) set.add(c.addedByStaff);
    });
    return Array.from(set);
  }, [customers]);

  // Filtered customer contacts
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Carrier filter
      if (carrierFilter === 'MTN' && c.carrier !== 'MTN') return false;
      if (carrierFilter === 'Airtel' && c.carrier !== 'Airtel') return false;
      if (carrierFilter === 'LOANS') {
        const cleanPhone = c.phone.replace(/\D/g, '');
        const hasLoan = customerActiveLoansMap.has(cleanPhone) || customerActiveLoansMap.has(c.name.toLowerCase().trim());
        if (!hasLoan) return false;
      }

      // Staff filter
      if (staffFilter !== 'ALL' && c.addedByStaff !== staffFilter) return false;

      // Search query (matches name, phone, NIN, companyId, workplace, department, designation)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''));
        const matchesNin = (c.nin || '').toLowerCase().includes(q);
        const matchesCompanyId = (c.companyIdNumber || '').toLowerCase().includes(q);
        const matchesWorkplace = (c.workplace || '').toLowerCase().includes(q);
        const matchesDept = (c.department || '').toLowerCase().includes(q);
        const matchesDesignation = (c.designation || '').toLowerCase().includes(q);
        const matchesStaff = (c.addedByStaff || '').toLowerCase().includes(q);

        if (!matchesName && !matchesPhone && !matchesNin && !matchesCompanyId && !matchesWorkplace && !matchesDept && !matchesDesignation && !matchesStaff) {
          return false;
        }
      }

      return true;
    });
  }, [customers, carrierFilter, staffFilter, searchQuery, customerActiveLoansMap]);

  // Carrier Counts
  const counts = useMemo(() => {
    let mtn = 0;
    let airtel = 0;
    let withLoans = 0;

    customers.forEach((c) => {
      if (c.carrier === 'MTN') mtn++;
      if (c.carrier === 'Airtel') airtel++;
      const cleanPhone = c.phone.replace(/\D/g, '');
      if (customerActiveLoansMap.has(cleanPhone) || customerActiveLoansMap.has(c.name.toLowerCase().trim())) {
        withLoans++;
      }
    });

    return { total: customers.length, mtn, airtel, withLoans };
  }, [customers, customerActiveLoansMap]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Top Filter & Search Section */}
      <div className="bg-white border-b border-slate-100 p-3 sm:p-4 shrink-0 space-y-2.5 shadow-xs">
        {/* Title & Quick Add Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 leading-none">
                  Customer Contacts Directory
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {counts.total} / 200+
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                KYC profiles with Ugandan MTN & Airtel contact numbers
              </span>
            </div>
          </div>

          {/* Add Customer Button */}
          <button
            onClick={onOpenAddCustomer}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, NIN, company ID, department, or staff..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Carrier & Loan Filter Chips */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar pb-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCarrierFilter('ALL')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
                carrierFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({counts.total})
            </button>

            <button
              onClick={() => setCarrierFilter('MTN')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                carrierFilter === 'MTN'
                  ? 'bg-amber-400 text-slate-950 font-black ring-1 ring-amber-500 shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>MTN ({counts.mtn})</span>
            </button>

            <button
              onClick={() => setCarrierFilter('Airtel')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                carrierFilter === 'Airtel'
                  ? 'bg-rose-600 text-white font-black ring-1 ring-rose-700 shadow-xs'
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Airtel ({counts.airtel})</span>
            </button>

            <button
              onClick={() => setCarrierFilter('LOANS')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                carrierFilter === 'LOANS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Wallet className="w-3 h-3" />
              <span>Active Loans ({counts.withLoans})</span>
            </button>
          </div>

          {/* Staff Filter Dropdown */}
          <div className="shrink-0 pl-1">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg px-2 py-1 outline-none border border-slate-200 cursor-pointer"
            >
              <option value="ALL">All Staff Attributions</option>
              {staffList.map((staff) => (
                <option key={staff} value={staff}>
                  Staff: {staff.split('(')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customer Contacts Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Customers Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {searchQuery 
                ? `No customer contacts match "${searchQuery}".`
                : 'No customers recorded under this filter.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={onOpenAddCustomer}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Customer Contact</span>
              </button>
              {counts.total < 30 && triggerBulkPopulate && (
                <button
                  onClick={() => triggerBulkPopulate(25)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Populate 25 Contacts</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const cleanPhone = customer.phone.replace(/\D/g, '');
            const activeLoan = customerActiveLoansMap.get(cleanPhone) || customerActiveLoansMap.get(customer.name.toLowerCase().trim());

            return (
              <div
                key={customer.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all text-xs space-y-2.5"
              >
                {/* Top Row: Avatar + Name + Carrier + Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {/* Customer Avatar with Initials */}
                    <div className={`w-10 h-10 rounded-2xl ${customer.avatarColor || 'bg-emerald-600'} text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                      {customer.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 tracking-tight">
                          {customer.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {customer.id}
                        </span>
                        {/* Carrier Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          customer.carrier === 'MTN'
                            ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-500'
                            : customer.carrier === 'Airtel'
                            ? 'bg-rose-600 text-white ring-1 ring-rose-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {customer.carrier === 'MTN' ? 'MTN MoMo' : customer.carrier === 'Airtel' ? 'Airtel Money' : 'Other'}
                        </span>
                      </div>

                      {/* Phone Display with quick communication triggers */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {formatUgandaPhone(customer.phone)}
                        </span>
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${customer.phone}`}
                            className="p-1 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                            title="Call customer"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                          <a
                            href={`https://wa.me/256${cleanPhone.startsWith('0') ? cleanPhone.substring(1) : cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                            title="WhatsApp chat"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary Loan / Action Button */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onIssueLoanForCustomer(customer)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[11px] rounded-xl shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Issue new loan to this customer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Issue Loan</span>
                    </button>

                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Customer Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteCustomer(customer.id, customer.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* KYC IDs & Employment Details Grid */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {/* Left Column: NIN & IDs */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-500">NIN:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {customer.nin || 'Not Provided'}
                      </span>
                    </div>

                    {customer.companyIdNumber && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="text-slate-500">Company ID:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {customer.companyIdNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Workplace, Department & Designation */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-500">Workplace:</span>
                      <span className="font-bold text-slate-800 truncate">
                        {customer.workplace || 'Small Business Vendor'}
                      </span>
                    </div>

                    {(customer.department || customer.designation) && (
                      <div className="text-slate-600 pl-5 truncate">
                        <span className="font-semibold text-slate-800">{customer.designation || 'Staff'}</span>
                        {customer.department && (
                          <span className="text-slate-500"> · {customer.department}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Bar: Admin Staff attribution + Active Loan Pill */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px]">
                  <div className="flex items-center gap-1 text-slate-500">
                    <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Added by:</span>
                    <span className="font-bold text-slate-700">{customer.addedByStaff || 'Hussein (Admin)'}</span>
                  </div>

                  {activeLoan ? (
                    <button
                      onClick={() => onViewLoanDetail?.(activeLoan)}
                      className="px-2 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Loan: {formatUGX(activeLoan.total - activeLoan.paidAmount)}</span>
                      <ArrowUpRight className="w-2.5 h-2.5 text-emerald-600" />
                    </button>
                  ) : (
                    <span className="text-slate-400">No active balance</span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Bottom Capacity & Bulk Populate Bar */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 text-center space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 text-[11px] px-1">
            <span>High-Capacity Ledger: <strong>{customers.length} / 200+ contacts</strong></span>
            <span className="text-emerald-700 font-bold">Fast Local Database</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => triggerBulkPopulate?.(25)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Add +25 Sample Ugandan Customers</span>
            </button>
            <button
              onClick={() => triggerBulkPopulate?.(50)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Scale to 100+ / 200</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
