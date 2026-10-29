import React, { useState } from 'react';
import { 
  X, Phone, MessageSquare, DollarSign, CheckCircle2, 
  AlertCircle, Copy, Check, Clock, ShieldCheck, Tag, Trash2,
  History, FileText, ArrowDownLeft, Calendar, Wallet, Receipt
} from 'lucide-react';
import { Loan, LoanStatus } from '../types/loan';
import { formatUGX, getInitials } from '../data/seedLoans';

interface LoanDetailSheetProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal: (loan: Loan) => void;
  onUpdateStatus: (loanId: string, newStatus: LoanStatus) => void;
  onDeleteLoan?: (loanId: string, borrowerName: string) => void;
  onArchiveAndFreeSlot?: (loan: Loan) => void;
  onOpenEmergencyContacts?: () => void;
}

export const LoanDetailSheet: React.FC<LoanDetailSheetProps> = ({
  loan,
  isOpen,
  onClose,
  onOpenPaymentModal,
  onUpdateStatus,
  onDeleteLoan,
  onArchiveAndFreeSlot,
  onOpenEmergencyContacts,
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<'details' | 'history'>('details');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !loan) return null;

  const remainingBalance = Math.max(0, loan.total - (loan.paidAmount || 0));
  const progressPercent = Math.min(100, Math.round(((loan.paidAmount || 0) / loan.total) * 100));
  const isOverdue = loan.status === 'Overdue';
  const isSettled = loan.status === 'Settled';
  const paymentsCount = loan.payments?.length || 0;

  const copySmsReminder = () => {
    const text = `Hussein Loans and Saving Group Notice:\nHello ${loan.name}, your loan ${loan.id} has an installment of ${formatUGX(loan.installment)} due on ${loan.dueDate}.\nOutstanding Balance: ${formatUGX(remainingBalance)}.\nPay via Mobile Money / Cash. Motto: Helping You Move Forward.`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet panel */}
      <div 
        className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up border-t border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Sheet Top Bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
              {loan.id}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Issued {loan.date}</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEmergencyContacts && (
              <button
                onClick={onOpenEmergencyContacts}
                className="text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200/60 transition-colors"
                title="Emergency Support Contacts"
              >
                Emergency Help
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Borrower Hero Profile Summary */}
        <div className="px-5 pt-3 pb-2 shrink-0 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {getInitials(loan.name)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {loan.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {loan.phone ? loan.phone : 'No phone registered'}
                </p>
              </div>
            </div>

            <div className="text-right">
              {isOverdue && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" /> Overdue
                </span>
              )}
              {!isOverdue && !isSettled && (
                <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              )}
              {isSettled && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                </span>
              )}
            </div>
          </div>

          {/* Segmented Sheet Tabs: [Loan Details] vs [Loan History] */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/70 rounded-xl mt-3">
            <button
              onClick={() => setActiveSheetTab('details')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeSheetTab === 'details'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Loan Details</span>
            </button>
            <button
              onClick={() => setActiveSheetTab('history')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeSheetTab === 'history'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Loan History ({paymentsCount})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
          {/* TAB 1: LOAN DETAILS */}
          {activeSheetTab === 'details' && (
            <>
              {/* Quick Contact & Remind Row */}
              <div className="grid grid-cols-2 gap-2">
                {loan.phone ? (
                  <a
                    href={`tel:${loan.phone}`}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-colors border border-emerald-200/50 min-h-[40px]"
                  >
                    <Phone className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Call Client</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center py-2 px-3 bg-slate-100 text-slate-400 font-medium text-xs rounded-xl min-h-[40px]">
                    No Phone on File
                  </div>
                )}

                <button
                  onClick={copySmsReminder}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors border border-slate-200 min-h-[40px]"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied SMS!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy SMS Reminder</span>
                    </>
                  )}
                </button>
              </div>

              {/* Repayment Progress Banner */}
              <div className="bg-emerald-950 text-white p-4 rounded-2xl shadow-xs">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-emerald-200 font-medium">Repayment Status</span>
                  <span className="text-xs font-mono text-emerald-300 font-bold">
                    {progressPercent}% Complete
                  </span>
                </div>
                
                <div className="w-full bg-emerald-900/80 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-900/80 text-center">
                  <div>
                    <span className="text-[10px] text-emerald-300/80 block">Total Due</span>
                    <span className="text-xs font-bold font-mono tabular-nums">
                      {formatUGX(loan.total)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300/80 block">Paid So Far</span>
                    <span className="text-xs font-bold text-emerald-300 font-mono tabular-nums">
                      {formatUGX(loan.paidAmount || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300/80 block">Remaining</span>
                    <span className="text-xs font-bold text-amber-300 font-mono tabular-nums">
                      {formatUGX(remainingBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complete 12-Item Ledger Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Official Loan Terms
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white text-xs">
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Loan ID</span>
                    <span className="font-mono font-bold text-slate-800">{loan.id}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Disbursement Date</span>
                    <span className="font-medium text-slate-800">{loan.date}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Principal Issued</span>
                    <span className="font-mono font-bold text-slate-900">{formatUGX(loan.principal)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Interest Rate</span>
                    <span className="font-mono font-semibold text-slate-800">{loan.rate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Rate Period</span>
                    <span className="font-medium text-slate-800">{loan.ratePeriod || 'Week'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Loan Term (Periods)</span>
                    <span className="font-mono font-bold text-slate-800">{loan.termWeeks}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Interest Accrued</span>
                    <span className="font-mono font-bold text-emerald-700">{formatUGX(loan.interest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Total Repayment Due</span>
                    <span className="font-mono font-extrabold text-slate-900">{formatUGX(loan.total)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Installment Amount</span>
                    <span className="font-mono font-semibold text-slate-800">{formatUGX(loan.installment)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Repayment Schedule</span>
                    <span className="font-medium text-slate-800">{loan.frequency}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Maturity / Due Date</span>
                    <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                      {loan.dueDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500">Channel / Remarks</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      {loan.notes || 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Override Controller */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block mb-2">Manual Status Control</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateStatus(loan.id, 'Active')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      loan.status === 'Active'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => onUpdateStatus(loan.id, 'Overdue')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      loan.status === 'Overdue'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Overdue
                  </button>
                  <button
                    onClick={() => onUpdateStatus(loan.id, 'Settled')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      loan.status === 'Settled'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Settled
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LOAN HISTORY (Repayment Progress & Past Payments) */}
          {activeSheetTab === 'history' && (
            <div className="space-y-4 animate-fade-in">
              {/* Repayment Progress Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Repayment Tracking</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {progressPercent}% Paid
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Due</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatUGX(loan.total)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Paid</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatUGX(loan.paidAmount || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Remaining</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {formatUGX(remainingBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Installment Milestone Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Installments Logged
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    {paymentsCount} Payment{paymentsCount === 1 ? '' : 's'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Target: {formatUGX(loan.installment)}/wk
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Next Due Date
                  </span>
                  <span className={`text-sm font-bold font-mono ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                    {loan.dueDate}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {isSettled ? 'Loan Complete' : (isOverdue ? 'Payment Overdue!' : 'Upcoming payment')}
                  </span>
                </div>
              </div>

              {/* Past Payments List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    All Past Payments ({paymentsCount})
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Verified Ledger
                  </span>
                </div>

                {paymentsCount === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-700">No Payments Recorded Yet</h5>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      As soon as {loan.name} makes installment repayments, they will appear here with full date and amount tracking.
                    </p>
                    {!isSettled && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenPaymentModal(loan);
                        }}
                        className="mt-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                      >
                        Record First Payment
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {loan.payments.map((p, idx) => (
                      <div 
                        key={p.id} 
                        className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs text-xs flex justify-between items-start gap-2"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold font-mono text-slate-900 text-sm">
                                {formatUGX(p.amount)}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                                {p.channel}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>{p.date}</span>
                              {p.notes && (
                                <>
                                  <span>·</span>
                                  <span className="text-slate-600 font-medium truncate max-w-[150px]">
                                    {p.notes}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            #{paymentsCount - idx}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Logged
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Bottom Action Button */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          {!isSettled ? (
            <button
              onClick={() => {
                onClose();
                onOpenPaymentModal(loan);
              }}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <span className="font-mono text-xs bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded font-extrabold">
                UGX
              </span>
              <span>Record Installment Payment</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-center text-xs text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200/60 font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Loan fully settled and ready to archive.</span>
              </div>

              {onArchiveAndFreeSlot && (
                <button
                  onClick={() => {
                    onClose();
                    onArchiveAndFreeSlot(loan);
                  }}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <History className="w-4 h-4" />
                  <span>Complete &amp; Free Slot {loan.id} (Save to History)</span>
                </button>
              )}

              {onDeleteLoan && (
                <button
                  onClick={() => {
                    onClose();
                    onDeleteLoan(loan.id, loan.name);
                  }}
                  className="w-full h-9 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200/80 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Completed Record</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
