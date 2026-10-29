import React, { useState } from 'react';
import { 
  History, Search, Calendar, CheckCircle2, 
  ArrowDownLeft, Receipt, Trash2, ArrowLeft,
  DollarSign, ShieldCheck, UserCheck
} from 'lucide-react';
import { Loan } from '../types/loan';
import { formatUGX, getInitials } from '../data/seedLoans';

interface CompletedHistoryViewProps {
  history: Loan[];
  onBackToLoans: () => void;
  onViewReceipt: (loanId: string) => void;
  onDeleteHistoryItem?: (loanId: string, name: string) => void;
}

export const CompletedHistoryView: React.FC<CompletedHistoryViewProps> = ({
  history,
  onBackToLoans,
  onViewReceipt,
  onDeleteHistoryItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchName = item.name.toLowerCase().includes(q);
    const matchId = item.id.toLowerCase().includes(q);
    const matchPhone = item.phone.toLowerCase().includes(q);
    const matchOriginal = item.originalBorrower?.toLowerCase().includes(q) || false;
    return matchName || matchId || matchPhone || matchOriginal;
  });

  const totalSettledPrincipal = history.reduce((sum, item) => sum + item.principal, 0);
  const totalSettledPaid = history.reduce((sum, item) => sum + (item.paidAmount || item.total), 0);
  const totalInterestEarned = history.reduce((sum, item) => sum + item.interest, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-100 p-3 sm:p-4 shrink-0 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToLoans}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              title="Back to Active Loans"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                Completed Loans Audit History
              </h2>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Permanent Ledger of Settled Borrowers &amp; Freed Slots
              </span>
            </div>
          </div>

          <div className="px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{history.length} Settled</span>
          </div>
        </div>

        {/* Aggregate History KPIs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 text-white p-3 rounded-2xl">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Principal Returned</span>
            <span className="text-xs font-extrabold font-mono text-white">
              {formatUGX(totalSettledPrincipal)}
            </span>
          </div>
          <div className="text-center border-x border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Interest Earned</span>
            <span className="text-xs font-extrabold font-mono text-emerald-400">
              {formatUGX(totalInterestEarned)}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Total Recovered</span>
            <span className="text-xs font-extrabold font-mono text-amber-300">
              {formatUGX(totalSettledPaid)}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search completed borrower or slot ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100/80 hover:bg-white focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200 m-1">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Completed Records in History Yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
              When an active borrower completes their loan, select <strong>&quot;Complete &amp; Free Slot&quot;</strong> in their loan detail sheet to archive their records here and reassign their Slot ID to the next customer.
            </p>
            <button
              onClick={onBackToLoans}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Go to Active Loans
            </button>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isExpanded = expandedLoanId === item.id + (item.archivedAt || '');
            const paymentsCount = item.payments?.length || 0;

            return (
              <div
                key={item.id + (item.archivedAt || '')}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                {/* Header card row */}
                <div 
                  onClick={() => setExpandedLoanId(isExpanded ? null : item.id + (item.archivedAt || ''))}
                  className="p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          {item.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {item.phone || 'No phone'} · Completed {item.archivedAt || item.dueDate}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Fully Settled
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {paymentsCount} payment{paymentsCount === 1 ? '' : 's'} logged
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-medium">Total Paid</span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      {formatUGX(item.paidAmount || item.total)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Principal: {formatUGX(item.principal)}
                    </span>
                  </div>
                </div>

                {/* Expanded Details & Payments Breakdown */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    {/* Loan summary grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-medium">Issue Date</span>
                        <span className="font-semibold text-slate-800">{item.date}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-medium">Interest Earned</span>
                        <span className="font-mono font-bold text-emerald-700">{formatUGX(item.interest)}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-medium">Term / Rate</span>
                        <span className="font-semibold text-slate-800">{item.termWeeks} wks @ {item.rate}%</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-medium">Payment Channel</span>
                        <span className="font-semibold text-slate-800">{item.notes}</span>
                      </div>
                    </div>

                    {/* Past Payments List */}
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Payment Installment History ({paymentsCount})
                      </h5>
                      {paymentsCount === 0 ? (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                          Direct lump-sum settlement logged at close.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                          {item.payments.map((p, idx) => (
                            <div 
                              key={p.id}
                              className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <div>
                                  <span className="font-mono font-bold text-slate-900">{formatUGX(p.amount)}</span>
                                  <span className="text-[10px] text-slate-400 ml-1.5">{p.channel}</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">{p.date}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                      <button
                        onClick={() => onViewReceipt(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Settlement Receipt</span>
                      </button>

                      {onDeleteHistoryItem && (
                        <button
                          onClick={() => onDeleteHistoryItem(item.id, item.name)}
                          className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Remove from archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Record</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
