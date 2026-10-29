import React, { useState, useEffect } from 'react';
import { 
  X, UserPlus, Phone, Shield, Building2, Briefcase, 
  MapPin, UserCheck, FileText, Sparkles, CheckCircle2,
  AlertCircle, Smartphone, Hash
} from 'lucide-react';
import { CustomerContact, TelecomCarrier } from '../types/loan';
import { detectUgandaCarrier, formatUgandaPhone, ADMIN_STAFF_MEMBERS } from '../data/seedCustomers';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (customer: CustomerContact) => void;
  initialCustomer?: CustomerContact | null;
  currentStaffName?: string;
  onSaveAndIssueLoan?: (customer: CustomerContact) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomer,
  initialCustomer,
  currentStaffName,
  onSaveAndIssueLoan,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [nin, setNin] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [companyIdNumber, setCompanyIdNumber] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [addedByStaff, setAddedByStaff] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name);
      setPhone(initialCustomer.phone);
      setSecondaryPhone(initialCustomer.secondaryPhone || '');
      setNin(initialCustomer.nin || '');
      setIdNumber(initialCustomer.idNumber || '');
      setCompanyIdNumber(initialCustomer.companyIdNumber || '');
      setWorkplace(initialCustomer.workplace || '');
      setDepartment(initialCustomer.department || '');
      setDesignation(initialCustomer.designation || '');
      setBusinessAddress(initialCustomer.businessAddress || '');
      setAddedByStaff(initialCustomer.addedByStaff || '');
      setNotes(initialCustomer.notes || '');
    } else {
      // Default to logged in staff or first admin staff
      setName('');
      setPhone('');
      setSecondaryPhone('');
      setNin('');
      setIdNumber('');
      setCompanyIdNumber('');
      setWorkplace('');
      setDepartment('');
      setDesignation('');
      setBusinessAddress('');
      const defaultStaff = ADMIN_STAFF_MEMBERS.find(s => s.name === currentStaffName) || ADMIN_STAFF_MEMBERS[0];
      setAddedByStaff(`${defaultStaff.name} (${defaultStaff.role})`);
      setNotes('');
    }
  }, [initialCustomer, currentStaffName, isOpen]);

  if (!isOpen) return null;

  const detectedCarrier = detectUgandaCarrier(phone);

  const handleSubmit = (e: React.FormEvent, thenIssueLoan = false) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const formattedCarrier = detectedCarrier;
    const avatarColors = ['bg-emerald-600', 'bg-purple-600', 'bg-blue-600', 'bg-amber-600', 'bg-rose-600', 'bg-teal-600'];
    const chosenColor = initialCustomer?.avatarColor || avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const customerRecord: CustomerContact = {
      id: initialCustomer?.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      phone: phone.trim(),
      carrier: formattedCarrier,
      secondaryPhone: secondaryPhone.trim() || undefined,
      nin: nin.trim().toUpperCase(),
      idNumber: idNumber.trim().toUpperCase(),
      companyIdNumber: companyIdNumber.trim().toUpperCase(),
      workplace: workplace.trim(),
      department: department.trim(),
      designation: designation.trim(),
      businessAddress: businessAddress.trim() || undefined,
      addedByStaff: addedByStaff || `${ADMIN_STAFF_MEMBERS[0].name} (${ADMIN_STAFF_MEMBERS[0].role})`,
      createdAt: initialCustomer?.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: notes.trim() || undefined,
      avatarColor: chosenColor,
    };

    onSaveCustomer(customerRecord);
    if (thenIssueLoan && onSaveAndIssueLoan) {
      onSaveAndIssueLoan(customerRecord);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                {initialCustomer ? 'Edit Customer Contact & KYC' : 'Add Customer Contact & KYC Profile'}
              </h2>
              <span className="text-[10px] text-slate-400">
                Hussein Loans and Saving Group · Kampala Directory
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 custom-scrollbar">
          {/* SECTION 1: Personal & Phone */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-1 border-b border-slate-200">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Customer Identification & Phone</span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Customer Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alupo Martha / Kato David"
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-900 outline-none"
              />
            </div>

            {/* Phone with Uganda Carrier Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Ugandan Phone Number <span className="text-rose-500">*</span>
                  </label>
                  {phone.length >= 3 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
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
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0701... / 0772... / +256..."
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-900 outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  MTN: 077, 078, 076 · Airtel: 070, 075, 074
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Secondary / Guarantor Phone
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    placeholder="e.g. 0782 123456"
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-900 outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Next of Kin / Referee</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: National ID & NIN & Company ID */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-1 border-b border-slate-200">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>KYC Government & Company IDs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* NIN Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Uganda NIN Number (National ID)
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    placeholder="e.g. CM900231012AB4"
                    maxLength={16}
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-900 uppercase outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">14-character NIRA NIN</span>
              </div>

              {/* National ID / Voter / Passport */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Card / Voter ID Number
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. UG-NID-8820194"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-semibold text-slate-900 uppercase outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Physical card number</span>
              </div>
            </div>

            {/* Company / Staff ID Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Customer Company ID Number / Market Stall ID
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={companyIdNumber}
                  onChange={(e) => setCompanyIdNumber(e.target.value)}
                  placeholder="e.g. EMP-OW-4412 / STALL-B14 / EMP-7740"
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-900 uppercase outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Workplace, Department & Designation */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-1 border-b border-slate-200">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Employment & Business Profile</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Company / Employer / Market Workplace
              </label>
              <input
                type="text"
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
                placeholder="e.g. Owino Produce Market / Hardware World Ltd"
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Department */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Logistics & Transport / Sales"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-900 outline-none"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Customer Designation / Role
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Vendor / Dispatch Supervisor"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Business Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Physical Workplace Address / Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="e.g. Plot 18, Nakivubo Road, Kampala"
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Admin Staff Selection */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">
              Admin Staff Who Added This Customer <span className="text-rose-500">*</span>
            </label>
            <select
              value={addedByStaff}
              onChange={(e) => setAddedByStaff(e.target.value)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-bold text-slate-900 outline-none cursor-pointer"
            >
              {ADMIN_STAFF_MEMBERS.map((staff) => (
                <option key={staff.id} value={`${staff.name} (${staff.role})`}>
                  {staff.name} — {staff.role} ({staff.branch})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500 block">
              Customer attribution for field performance & recovery monitoring
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Creditworthiness / Relationship Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Regular Tuesday repayment habit, verified business permit..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-800 outline-none resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialCustomer ? 'Save Customer Changes' : 'Save Customer Contact'}</span>
            </button>

            {onSaveAndIssueLoan && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save Contact & Immediately Issue Loan</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
