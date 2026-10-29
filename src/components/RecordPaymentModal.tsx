import React, { useState } from 'react';
import { X, Check, DollarSign, Wallet, Banknote, Landmark } from 'lucide-react';
import { Loan, PaymentRecord } from '../types/loan';
import { formatUGX } from '../data/seedLoans';

interface RecordPaymentModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordPayment: (loanId: string, payment: PaymentRecord) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  loan,
  isOpen,
  onClose,
  onRecordPayment,
}) => {
  if (!isOpen || !loan) return null;

  const remaining = Math.max(0, loan.total - (loan.paidAmount || 0));
  const suggestedInstallment = Math.min(loan.installment, remaining);

  const [amount, setAmount] = useState<number>(suggestedInstallment);
  const [channel, setChannel] = useState<'Mobile Money' | 'Cash' | 'Bank / ATM'>('Mobile Money');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleApplyPreset = (val: number) => {
    setAmount(val);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount greater than UGX 0');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');

    const payment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      amount: Number(amount),
      date: todayStr,
      channel,
      notes: notes.trim() || undefined,
    };

    onRecordPayment(loan.id, payment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Record Payment</h3>
            <span className="text-xs text-slate-500 font-medium">
              {loan.name} ({loan.id})
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick Balance Reminder */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between text-xs">
            <span className="text-slate-500">Remaining Balance:</span>
            <span className="font-mono font-bold text-slate-900">{formatUGX(remaining)}</span>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Amount (UGX)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                UGX
              </span>
              <input
                type="number"
                min="100"
                step="100"
                value={amount || ''}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  setError('');
                }}
                className="w-full pl-14 pr-3 py-2.5 text-sm font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                placeholder="27500"
                required
              />
            </div>
            {error && <p className="text-rose-600 text-xs mt-1">{error}</p>}
          </div>

          {/* Preset Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset(suggestedInstallment)}
              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors"
            >
              Weekly Inst. ({formatUGX(suggestedInstallment)})
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(remaining)}
              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors"
            >
              Full Clear ({formatUGX(remaining)})
            </button>
          </div>

          {/* Payment Channel */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('Mobile Money')}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                  channel === 'Mobile Money'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-[10px]">Mobile Money</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('Cash')}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                  channel === 'Cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span className="text-[10px]">Cash Field</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('Bank / ATM')}
                className={`py-2 px-1 text-center rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                  channel === 'Bank / ATM'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span className="text-[10px]">Bank / ATM</span>
              </button>
            </div>
          </div>

          {/* Note / Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Receipt / Transaction Note (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. MTN TID: 9918231 or Agent Cash"
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Log {formatUGX(amount || 0)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
