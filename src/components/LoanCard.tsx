import React from 'react';
import { Phone, Calendar, ArrowRight, DollarSign, AlertCircle, Trash2 } from 'lucide-react';
import { Loan } from '../types/loan';
import { formatUGX, getInitials } from '../data/seedLoans';

interface LoanCardProps {
  loan: Loan;
  onSelect: (loan: Loan) => void;
  onQuickPay: (loan: Loan) => void;
  onDeleteLoan?: (loanId: string, borrowerName: string) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onSelect, onQuickPay, onDeleteLoan }) => {
  const isOverdue = loan.status === 'Overdue';
  const isSettled = loan.status === 'Settled';
  const remaining = Math.max(0, loan.total - (loan.paidAmount || 0));
  const progressPercent = Math.min(100, Math.round(((loan.paidAmount || 0) / loan.total) * 100));

  // Avatar pastel background based on first letter
  const avatarColors = [
    'bg-emerald-100 text-emerald-800',
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
    'bg-indigo-100 text-indigo-800',
  ];
  const charCode = loan.name.charCodeAt(0) || 0;
  const colorClass = avatarColors[charCode % avatarColors.length];

  return (
    <div
      onClick={() => onSelect(loan)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer active:scale-[0.99] relative group"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${colorClass}`}>
            {getInitials(loan.name)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-base leading-tight truncate">
              {loan.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
              <span className="font-mono text-slate-700 font-semibold">{loan.id}</span>
              <span aria-hidden="true">·</span>
              <span>Issued {loan.date}</span>
            </div>
          </div>
        </div>

        {/* Semantic Status Badge */}
        <div className="shrink-0">
          {isOverdue && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 uppercase tracking-wider">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </span>
          )}
          {!isOverdue && !isSettled && (
            <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wider">
              Active
            </span>
          )}
          {isSettled && (
            <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
              Settled
            </span>
          )}
        </div>
      </div>

      {/* Financial Numbers Matrix */}
      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-3 grid grid-cols-2 gap-2">
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Principal</span>
          <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
            {formatUGX(loan.principal)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {loan.rate}% · {loan.termWeeks}w
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-medium text-slate-500 block">
            {isSettled ? 'Total Paid' : 'Total Due'}
          </span>
          <span className={`text-sm font-bold font-mono tabular-nums ${isOverdue ? 'text-rose-600' : 'text-emerald-700'}`}>
            {formatUGX(loan.total)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Inst: {formatUGX(loan.installment)}/wk
          </span>
        </div>

        {/* Payment progress bar if partial payments exist */}
        {loan.paidAmount > 0 && !isSettled && (
          <div className="col-span-2 pt-1 border-t border-slate-200/50 mt-1">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Paid: {formatUGX(loan.paidAmount)}</span>
              <span className="font-semibold text-slate-700">Rem: {formatUGX(remaining)}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Details & Quick Action Buttons */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Due <strong className={`font-mono ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>{loan.dueDate}</strong></span>
          {loan.notes && (
            <span className="text-slate-400 hidden sm:inline text-[11px]">
              · {loan.notes.replace('issued - ', '').replace('issued', 'Standard')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {loan.phone ? (
            <a
              href={`tel:${loan.phone}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-colors min-h-[38px]"
              title={`Call ${loan.name} at ${loan.phone}`}
            >
              <Phone className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Call</span>
            </a>
          ) : (
            <span className="text-slate-400 text-[11px] px-2 py-1">No Phone</span>
          )}

          {!isSettled && (
            <button
              onClick={() => onQuickPay(loan)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors min-h-[38px]"
              title="Record installment payment in UGX"
            >
              <span className="font-mono text-[10px] bg-emerald-900/60 text-emerald-200 px-1 py-0.5 rounded font-extrabold tracking-tight">
                UGX
              </span>
              <span>Pay</span>
            </button>
          )}

          {isSettled && onDeleteLoan && (
            <button
              onClick={() => onDeleteLoan(loan.id, loan.name)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors min-h-[38px]"
              title="Delete completed loan record"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          <div className="text-slate-400 group-hover:text-slate-700 transition-colors p-1">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
