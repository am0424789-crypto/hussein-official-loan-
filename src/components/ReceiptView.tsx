import React, { useState } from 'react';
import { 
  Printer, Copy, Check, Share2, FileText, ChevronDown, 
  ShieldCheck, ArrowLeft, Phone, Calendar, CheckCircle2 
} from 'lucide-react';
import { Loan } from '../types/loan';
import { formatUGX } from '../data/seedLoans';

interface ReceiptViewProps {
  loans: Loan[];
  initialLoanId?: string;
  onBackToLoans?: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  loans,
  initialLoanId = 'QL-007',
  onBackToLoans,
}) => {
  // Select Loan ID state
  const [selectedId, setSelectedId] = useState<string>(() => {
    const found = loans.find(l => l.id === initialLoanId);
    return found ? found.id : (loans[0]?.id || 'QL-007');
  });

  const [copied, setCopied] = useState(false);

  // Active loan object
  const currentLoan = loans.find(l => l.id === selectedId) || loans[0];

  const handlePrint = () => {
    window.print();
  };

  const formattedReceiptText = currentLoan ? `
========================================
  HUSSIEN LOANS GROUP & LOANS GROUP
  CUSTOMER LOAN RECEIPT / LOAN SUMMARY
========================================

Select Loan ID: ${currentLoan.id}

Loan ID: ${currentLoan.id}
Date: ${currentLoan.date}
Customer Name: ${currentLoan.name}
Phone Number: ${currentLoan.phone || 'N/A'}
Loan Amount (UGX): ${formatUGX(currentLoan.principal)}
Interest Rate (%): ${currentLoan.rate.toFixed(2)}%
Rate Period: ${currentLoan.ratePeriod || 'Week'}
Loan Term (Periods): ${currentLoan.termWeeks}
Interest Amount (UGX): ${formatUGX(currentLoan.interest)}
Total Loan Payment (UGX): ${formatUGX(currentLoan.total)}
Payment Per Period (UGX): ${formatUGX(currentLoan.installment)}
Repayment Frequency: ${currentLoan.frequency}
Due Date: ${currentLoan.dueDate}
Status: ${currentLoan.status}

Official Microfinance Receipt
Motto: Helping You Move Forward
========================================
`.trim() : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedReceiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsAppShare = () => {
    if (!currentLoan) return;
    const url = `https://wa.me/${currentLoan.phone ? currentLoan.phone.replace(/^0/, '256') : ''}?text=${encodeURIComponent(formattedReceiptText)}`;
    window.open(url, '_blank');
  };

  if (!currentLoan) {
    return (
      <div className="p-6 text-center text-slate-500">
        No loan selected. Please add or select a loan.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-4 bg-slate-50">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          {onBackToLoans && (
            <button
              onClick={onBackToLoans}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Back to loans"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs font-bold text-slate-900">Receipt Voucher</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            title="Copy text receipt"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            title="Print official receipt"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Loan Selector Picker (Interactive) - auto populates template */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>Select Loan ID:</span>
          <span className="text-[11px] font-normal text-emerald-700">Auto-loads borrower terms</span>
        </label>
        <div className="relative">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full pl-3 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-mono font-bold text-slate-900 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none transition-all cursor-pointer appearance-none"
          >
            {loans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                {loan.id} — {loan.name} ({formatUGX(loan.principal)})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* The Printable Official Voucher / Receipt Card */}
      <div 
        id="printable-receipt"
        className="bg-white rounded-3xl border border-slate-300 shadow-md p-5 sm:p-6 text-slate-900 relative overflow-hidden"
      >
        {/* Subtle security background watermark */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/5 rounded-full pointer-events-none" />

        {/* Template Header: Hussien Loans Group & Loans Group */}
        <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full overflow-hidden mb-2 shadow-md ring-2 ring-emerald-500/30 bg-slate-900">
            <img 
              src="/assets/aistudio/hlg_official_seal_1793007495526_dffae54d.jpg" 
              alt="Hussein Loans Group Official Seal" 
              className="w-full h-full object-cover scale-105"
            />
          </div>
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-slate-900">
            Hussien Loans Group &amp; Loans Group
          </h2>
          <div className="text-xs font-bold tracking-wider text-emerald-800 uppercase mt-0.5">
            CUSTOMER LOAN RECEIPT / LOAN SUMMARY
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Motto: Helping You Move Forward · Kampala, Uganda
          </p>
        </div>

        {/* Active Selected Loan ID Pill Banner */}
        <div className="my-3 py-2 px-3 bg-slate-100/80 rounded-xl flex items-center justify-between text-xs border border-slate-200">
          <span className="font-semibold text-slate-600">Select Loan ID:</span>
          <span className="font-mono font-extrabold text-slate-900 text-sm">
            {currentLoan.id}
          </span>
        </div>

        {/* The Exact Template Fields Requested */}
        <div className="divide-y divide-slate-100 text-xs font-medium">
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Loan ID</span>
            <span className="font-mono font-bold text-slate-900">{currentLoan.id}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Date</span>
            <span className="text-slate-800">{currentLoan.date}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Customer Name</span>
            <span className="font-bold text-slate-900">{currentLoan.name}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Phone Number</span>
            <span className="font-mono text-slate-800">{currentLoan.phone || 'N/A'}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Loan Amount (UGX)</span>
            <span className="font-mono font-bold text-slate-900">{formatUGX(currentLoan.principal)}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Interest Rate (%)</span>
            <span className="font-mono text-slate-800">{currentLoan.rate.toFixed(2)}%</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Rate Period</span>
            <span className="text-slate-800">{currentLoan.ratePeriod || 'Week'}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Loan Term (Periods)</span>
            <span className="font-mono text-slate-800">{currentLoan.termWeeks}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Interest Amount (UGX)</span>
            <span className="font-mono font-bold text-emerald-700">{formatUGX(currentLoan.interest)}</span>
          </div>

          <div className="flex justify-between py-2 bg-emerald-50/50 px-2 rounded-lg">
            <span className="font-bold text-slate-900">Total Loan Payment (UGX)</span>
            <span className="font-mono font-extrabold text-sm text-emerald-800">{formatUGX(currentLoan.total)}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Payment Per Period (UGX)</span>
            <span className="font-mono font-bold text-slate-900">{formatUGX(currentLoan.installment)}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Repayment Frequency</span>
            <span className="text-slate-800">{currentLoan.frequency}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Due Date</span>
            <span className="font-mono font-bold text-slate-900">{currentLoan.dueDate}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Status</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
              currentLoan.status === 'Overdue' 
                ? 'bg-rose-100 text-rose-700' 
                : currentLoan.status === 'Settled'
                ? 'bg-slate-200 text-slate-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {currentLoan.status}
            </span>
          </div>
        </div>

        {/* Voucher Signatures & Stamp for print */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 text-center">
          <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 mt-2">
            <div className="border-t border-slate-300 pt-1">
              Authorized Loan Officer
            </div>
            <div className="border-t border-slate-300 pt-1">
              Borrower Signature
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3 font-mono">
            Receipt Generated: {new Date().toLocaleDateString('en-GB')} · Official Voucher
          </div>
        </div>
      </div>

      {/* WhatsApp / Direct Contact Button */}
      {currentLoan.phone && (
        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 transition-colors print:hidden"
        >
          <Share2 className="w-4 h-4" />
          <span>Send Receipt to Client on WhatsApp ({currentLoan.phone})</span>
        </button>
      )}
    </div>
  );
};
