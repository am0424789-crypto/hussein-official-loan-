import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Calculator, Calendar, User, Phone, Tag, 
  RefreshCw, Users, Shield, Briefcase, CheckCircle2 
} from 'lucide-react';
import { Loan, CustomerContact } from '../types/loan';
import { formatUGX } from '../data/seedLoans';
import { detectUgandaCarrier, formatUgandaPhone } from '../data/seedCustomers';

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextId: string;
  availableFreedIds?: string[];
  onAddLoan: (loan: Loan) => void;
  customers?: CustomerContact[];
  prefilledCustomer?: CustomerContact | null;
}

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  isOpen,
  onClose,
  nextId,
  availableFreedIds = [],
  onAddLoan,
  customers = [],
  prefilledCustomer,
}) => {
  // Default to freed ID if available, otherwise nextId
  const initialAssignedId = availableFreedIds.length > 0 ? availableFreedIds[0] : nextId;
  const [selectedId, setSelectedId] = useState(initialAssignedId);

  useEffect(() => {
    if (availableFreedIds.length > 0) {
      setSelectedId(availableFreedIds[0]);
    } else {
      setSelectedId(nextId);
    }
  }, [nextId, availableFreedIds]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nin, setNin] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyIdNumber, setCompanyIdNumber] = useState('');

  const [principal, setPrincipal] = useState(25000);
  const [rate, setRate] = useState(10);
  const [termWeeks, setTermWeeks] = useState(2);
  const [frequency, setFrequency] = useState<'Weekly' | 'Monthly' | 'Daily'>('Weekly');
  const [channelNote, setChannelNote] = useState('Mobile Money');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  // Prefill when prefilledCustomer changes or modal opens
  useEffect(() => {
    if (prefilledCustomer) {
      setName(prefilledCustomer.name);
      setPhone(prefilledCustomer.phone);
      setNin(prefilledCustomer.nin || '');
      setWorkplace(prefilledCustomer.workplace || '');
      setDepartment(prefilledCustomer.department || '');
      setDesignation(prefilledCustomer.designation || '');
      setCompanyIdNumber(prefilledCustomer.companyIdNumber || '');
      setSelectedCustomerId(prefilledCustomer.id);
    } else {
      setName('');
      setPhone('');
      setNin('');
      setWorkplace('');
      setDepartment('');
      setDesignation('');
      setCompanyIdNumber('');
      setSelectedCustomerId('');
    }
  }, [prefilledCustomer, isOpen]);

  if (!isOpen) return null;

  // Handle picking from Customer Directory
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    if (!customerId) return;
    const found = customers.find(c => c.id === customerId);
    if (found) {
      setName(found.name);
      setPhone(found.phone);
      setNin(found.nin || '');
      setWorkplace(found.workplace || '');
      setDepartment(found.department || '');
      setDesignation(found.designation || '');
      setCompanyIdNumber(found.companyIdNumber || '');
    }
  };

  // Calculate defaults
  const today = new Date();
  const issueDateStr = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, '-');

  // Due date default: today + termWeeks
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + Math.round(termWeeks * 7));
  const dueDateStr = `${dueDateObj.getDate()}/${dueDateObj.getMonth() + 1}/${dueDateObj.getFullYear()}`;

  const computedInterest = Math.round(principal * (rate / 100) * termWeeks);
  const computedTotal = principal + computedInterest;
  const computedInstallment = Math.round(computedTotal / (termWeeks || 1));

  const isReusedSlot = availableFreedIds.includes(selectedId);
  const detectedCarrier = detectUgandaCarrier(phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newLoan: Loan = {
      id: selectedId,
      date: issueDateStr,
      name: name.trim(),
      phone: phone.trim(),
      principal: Number(principal),
      rate: Number(rate),
      ratePeriod: 'Week',
      termWeeks: Number(termWeeks),
      interest: computedInterest,
      total: computedTotal,
      paidAmount: 0,
      installment: computedInstallment,
      frequency,
      dueDate: dueDateStr,
      status: 'Active',
      notes: `issued - ${channelNote}${nin ? ` · NIN: ${nin}` : ''}`,
      payments: [],
      nin: nin.trim() || undefined,
      workplace: workplace.trim() || undefined,
      department: department.trim() || undefined,
      designation: designation.trim() || undefined,
      companyIdNumber: companyIdNumber.trim() || undefined,
    };

    onAddLoan(newLoan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Issue New Loan</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-500 font-mono">Assigned Slot:</span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                {selectedId}
              </span>
              {isReusedSlot && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                  Reusing Completed Slot
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3.5 overflow-y-auto custom-scrollbar pr-1 text-xs">
          {/* Quick Customer Picker from Contacts Directory */}
          {customers.length > 0 && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Choose from Customer Contacts</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Auto-fills KYC & Phone
                </span>
              </div>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900 outline-none cursor-pointer"
              >
                <option value="">-- Select an Existing Registered Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {formatUgandaPhone(c.phone)} ({c.carrier}) {c.workplace ? `· ${c.workplace}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Slot ID Selection if freed slots exist */}
          {availableFreedIds.length > 0 && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Available Completed Slot IDs</span>
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Replaces previous borrower</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {availableFreedIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedId === id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    Reuse {id}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedId(nextId)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedId === nextId
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  New {nextId}
                </button>
              </div>
            </div>
          )}

          {/* Borrower Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Borrower Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alupo Martha"
                className="w-full pl-9 pr-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Phone Number with Ugandan Carrier Detection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Ugandan Mobile Phone Number
              </label>
              {phone && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  detectedCarrier === 'MTN'
                    ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-500'
                    : detectedCarrier === 'Airtel'
                    ? 'bg-rose-600 text-white ring-1 ring-rose-700'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {detectedCarrier === 'MTN' ? 'MTN MoMo' : detectedCarrier === 'Airtel' ? 'Airtel Money' : 'Other'}
                </span>
              )}
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0772 123456 / 0701 234567"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono font-medium text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* NIN and Workplace KYC fields */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Uganda NIN Number
              </label>
              <input
                type="text"
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                placeholder="CM900..."
                className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Company / Employer ID
              </label>
              <input
                type="text"
                value={companyIdNumber}
                onChange={(e) => setCompanyIdNumber(e.target.value)}
                placeholder="EMP-..."
                className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {(workplace || designation) && (
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {designation ? `${designation} at ` : ''}
                <strong>{workplace}</strong>
                {department ? ` (${department})` : ''}
              </span>
            </div>
          )}

          {/* Principal & Term Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Principal (UGX) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="500"
                min="5000"
                required
                value={principal || ''}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interest Rate (%/wk) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={rate || ''}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Duration & Channel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (Weeks)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={termWeeks || ''}
                onChange={(e) => setTermWeeks(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Disbursement Channel
              </label>
              <select
                value={channelNote}
                onChange={(e) => setChannelNote(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
              >
                <option value="Mobile Money (MTN MoMo)">Mobile Money (MTN MoMo)</option>
                <option value="Mobile Money (Airtel Money)">Mobile Money (Airtel Money)</option>
                <option value="Cash Office">Cash Office (Branch)</option>
                <option value="Bank / ATM">Bank / Agent Banking</option>
              </select>
            </div>
          </div>

          {/* Dynamic Summary Card */}
          <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Interest ({rate}% × {termWeeks}wks):</span>
              <span className="font-mono text-emerald-400 font-bold">{formatUGX(computedInterest)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-slate-800">
              <span className="text-white">Total Expected Repayment:</span>
              <span className="font-mono text-emerald-400 text-sm">{formatUGX(computedTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Weekly Installment ({termWeeks} periods):</span>
              <span className="font-mono font-semibold text-slate-200">{formatUGX(computedInstallment)} / wk</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Due Date:</span>
              <span className="font-mono text-slate-300">{dueDateStr}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Disburse & Add to Active Portfolio</span>
          </button>
        </form>
      </div>
    </div>
  );
};
