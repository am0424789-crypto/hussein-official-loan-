import { 
  BarChart3, TrendingUp, AlertTriangle, CheckCircle2, 
  Layers, DollarSign, ArrowUpRight, Receipt, Users, Trash2, PhoneCall,
  Fingerprint, Lock, ShieldCheck
} from 'lucide-react';
import { Loan } from '../types/loan';
import { formatUGX } from '../data/seedLoans';

interface LoansDashboardViewProps {
  loans: Loan[];
  onSelectLoan: (loan: Loan) => void;
  onNavigateToReceipt: (loanId?: string) => void;
  onDeleteLoan?: (loanId: string, borrowerName: string) => void;
  onOpenEmergencyContacts?: () => void;
  fingerprintEnabled?: boolean;
  isBiometricVerified?: boolean;
  onRequestBiometricScan?: () => void;
  onLockDashboard?: () => void;
}

export const LoansDashboardView: React.FC<LoansDashboardViewProps> = ({
  loans,
  onSelectLoan,
  onNavigateToReceipt,
  onDeleteLoan,
  onOpenEmergencyContacts,
  fingerprintEnabled = false,
  isBiometricVerified = true,
  onRequestBiometricScan,
  onLockDashboard,
}) => {
  // Aggregate accurate stats
  let totalPrincipal = 0;
  let totalExpected = 0;
  let totalInterest = 0;
  let activeLoans = 0;
  let completedLoans = 0;
  let overdueLoans = 0;

  loans.forEach((l) => {
    totalPrincipal += l.principal;
    totalExpected += l.total;
    totalInterest += l.interest;
    if (l.status === 'Active') activeLoans++;
    if (l.status === 'Settled') completedLoans++;
    if (l.status === 'Overdue') overdueLoans++;
  });

  const totalRecords = loans.length;

  // If fingerprint login is enabled and biometric verification is pending before dashboard loads
  if (fingerprintEnabled && !isBiometricVerified) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white animate-fade-in">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center shadow-2xl animate-pulse">
            <Fingerprint className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="max-w-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60">
            Biometric Security Step
          </span>
          <h2 className="text-lg font-extrabold text-white">
            Hussein Loans Dashboard
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Fingerprint authentication is enabled. Please authenticate using the biometric sensor before loading the executive dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={onRequestBiometricScan}
          className="mt-6 w-full max-w-xs py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all"
        >
          <Fingerprint className="w-4 h-4 stroke-[2.5]" />
          <span>Authenticate Fingerprint &amp; Load Dashboard</span>
        </button>

        <p className="text-[10px] text-slate-500 mt-3">
          Configured in Admin Settings · Hussein Loans and Saving Group
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50">
      {/* Dashboard Main Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-5 rounded-3xl shadow-md border border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Executive Portfolio Overview</span>
          </div>

          {fingerprintEnabled && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Biometric Verified</span>
              </span>
              {onLockDashboard && (
                <button
                  type="button"
                  onClick={onLockDashboard}
                  title="Lock dashboard with biometric security"
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Lock className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
        <h2 className="text-lg font-extrabold tracking-tight text-white">
          Hussein Loans Group — Loans Dashboard
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Helping You Move Forward · Real-Time Portfolio Performance
        </p>

        {/* 3 Top Summary Numbers */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">
              Principal Issued
            </span>
            <span className="text-base font-extrabold font-mono text-white tabular-nums">
              {formatUGX(totalPrincipal)}
            </span>
          </div>

          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-300 block font-medium uppercase">
              Expected Return
            </span>
            <span className="text-base font-extrabold font-mono text-emerald-400 tabular-nums">
              {formatUGX(totalExpected)}
            </span>
          </div>
        </div>
      </div>

      {/* Official Required Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Core Portfolio Metrics</span>
          </h3>
          <span className="text-[11px] font-bold font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
            UGX System
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Row 1: Total Loan Records */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-700">Total Loan Records</span>
            </div>
            <span className="font-mono font-extrabold text-sm text-slate-900">
              {totalRecords}
            </span>
          </div>

          {/* Row 2: Total Principal Issued */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">
                UGX
              </div>
              <span className="font-semibold text-slate-700">Total Principal Issued (UGX)</span>
            </div>
            <span className="font-mono font-extrabold text-sm text-slate-900">
              {formatUGX(totalPrincipal)}
            </span>
          </div>

          {/* Row 3: Total Expected Repayment */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold font-mono text-[10px]">
                UGX
              </div>
              <span className="font-semibold text-slate-700">Total Expected Repayment (UGX)</span>
            </div>
            <span className="font-mono font-extrabold text-sm text-emerald-700">
              {formatUGX(totalExpected)}
            </span>
          </div>

          {/* Row 4: Total Interest */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors bg-emerald-50/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Total Interest (UGX)</span>
                <span className="text-[10px] text-slate-400">Total portfolio margin</span>
              </div>
            </div>
            <span className="font-mono font-extrabold text-sm text-emerald-800">
              {formatUGX(totalInterest)}
            </span>
          </div>

          {/* Row 5: Active Loans */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-700">Active Loans</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-sm text-slate-900">
                {activeLoans}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {Math.round((activeLoans / (totalRecords || 1)) * 100)}%
              </span>
            </div>
          </div>

          {/* Row 6: Completed Loans */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-700">Completed Loans</span>
            </div>
            <span className="font-mono font-extrabold text-sm text-slate-600">
              {completedLoans}
            </span>
          </div>

          {/* Row 7: Overdue Loans */}
          <div className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors bg-rose-50/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-rose-900 block">Overdue Loans</span>
                <span className="text-[10px] text-rose-500">Requires immediate recovery</span>
              </div>
            </div>
            <span className="font-mono font-extrabold text-sm text-rose-700">
              {overdueLoans}
            </span>
          </div>
        </div>
      </div>

      {/* Loans Ledger Quick List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            All Loan Records ({loans.length})
          </h4>
          <span className="text-[11px] text-slate-400">Tap for Receipt</span>
        </div>

        <div className="space-y-2">
          {loans.map((loan) => (
            <div
              key={loan.id}
              onClick={() => onNavigateToReceipt(loan.id)}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono font-bold text-xs text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                  {loan.id}
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 block truncate">
                    {loan.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Prin: {formatUGX(loan.principal)} · Int: {formatUGX(loan.interest)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  loan.status === 'Overdue' 
                    ? 'bg-rose-100 text-rose-700' 
                    : loan.status === 'Settled'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {loan.status}
                </span>
                <Receipt className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-700" />
                {loan.status === 'Settled' && onDeleteLoan && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLoan(loan.id, loan.name);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors ml-1"
                    title="Delete completed loan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Card */}
      {onOpenEmergencyContacts && (
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-3xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-rose-950">Emergency &amp; Admin Support</h5>
              <p className="text-[10px] text-rose-700 font-medium">Hussein Admin &amp; Secretary Anyango Mary</p>
            </div>
          </div>
          <button
            onClick={onOpenEmergencyContacts}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs shrink-0"
          >
            Contacts
          </button>
        </div>
      )}
    </div>
  );
};
