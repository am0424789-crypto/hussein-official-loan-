import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, Search, Plus, RotateCcw, Smartphone, Maximize2, 
  CheckCircle, AlertTriangle, Share2, BarChart3, 
  Receipt, LogOut, Download, Settings, Fingerprint, Lock, ShieldCheck,
  Users, UserPlus, Sparkles
} from 'lucide-react';
import { Loan, FilterStatus, ViewportMode, LoanStatus, PaymentRecord, SortOption, ActiveTab, AuthUser, CustomerContact } from './types/loan';
import { 
  INITIAL_LOANS, loadLoansFromStorage, saveLoansToStorage, formatUGX, AUTH_STORAGE_KEY,
  getStoredFingerprintEnabled, setStoredFingerprintEnabled,
  getStoredFingerprintRecord, setStoredFingerprintRecord, FingerprintRecord
} from './data/seedLoans';
import { 
  loadCustomersFromStorage, saveCustomersToStorage, generateBulkUgandanCustomers 
} from './data/seedCustomers';
import { PhoneStatusBar } from './components/PhoneStatusBar';
import { LoanCard } from './components/LoanCard';
import { LoanDetailSheet } from './components/LoanDetailSheet';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { NewLoanModal } from './components/NewLoanModal';
import { LoginScreen } from './components/LoginScreen';
import { LoansDashboardView } from './components/LoansDashboardView';
import { ReceiptView } from './components/ReceiptView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { SettingsModal } from './components/SettingsModal';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { FingerprintEnrollModal } from './components/FingerprintEnrollModal';
import { CustomerContactsView } from './components/CustomerContactsView';
import { AddCustomerModal } from './components/AddCustomerModal';

export default function App() {
  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loans, setLoans] = useState<Loan[]>(() => loadLoansFromStorage());
  const [activeTab, setActiveTab] = useState<ActiveTab>('loans');
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  // Default to full-screen mobile mode for edge-to-edge phone experience
  const [viewportMode, setViewportMode] = useState<ViewportMode>('fullscreen');

  // Selected Loan ID for Receipt & Detail Sheet
  const [receiptLoanId, setReceiptLoanId] = useState<string>('QL-007');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentLoan, setPaymentLoan] = useState<Loan | null>(null);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync loans to localStorage
  useEffect(() => {
    saveLoansToStorage(loans);
  }, [loans]);

  // Settings & Biometric Fingerprint State
  const [enrolledRecord, setEnrolledRecord] = useState<FingerprintRecord | null>(() => getStoredFingerprintRecord());
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState<boolean>(() => getStoredFingerprintEnabled());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isBiometricsVerified, setIsBiometricsVerified] = useState<boolean>(() => {
    // If fingerprint is disabled or not installed, biometrics are already satisfied
    return !getStoredFingerprintEnabled();
  });
  const [showBiometricModal, setShowBiometricModal] = useState<boolean>(false);
  const [isBiometricTestMode, setIsBiometricTestMode] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);

  // Customer Contacts Directory State (High-Capacity Ledger 200+ contacts)
  const [customers, setCustomers] = useState<CustomerContact[]>(() => loadCustomersFromStorage());
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerContact | null>(null);
  const [prefilledLoanCustomer, setPrefilledLoanCustomer] = useState<CustomerContact | null>(null);

  // Sync customers to localStorage
  useEffect(() => {
    saveCustomersToStorage(customers);
  }, [customers]);

  const handleSaveCustomer = (customer: CustomerContact) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === customer.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = customer;
        return copy;
      }
      return [customer, ...prev];
    });
    showToast(`Customer ${customer.name} saved (${customer.carrier} MoMo).`);
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    if (window.confirm(`Delete customer ${customerName} (${customerId}) from contacts directory?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      showToast(`Customer ${customerName} deleted.`);
    }
  };

  const handleIssueLoanForCustomer = (customer: CustomerContact) => {
    setPrefilledLoanCustomer(customer);
    setIsNewLoanOpen(true);
  };

  const handleBulkPopulateCustomers = (count: number) => {
    const newItems = generateBulkUgandanCustomers(count, customers.length + 1);
    setCustomers((prev) => [...prev, ...newItems]);
    showToast(`Added ${count} customer contacts! Directory now at ${customers.length + count} / 200+`);
  };

  const handleEnrollSuccess = (record: FingerprintRecord) => {
    setEnrolledRecord(record);
    setStoredFingerprintRecord(record);
    setFingerprintEnabled(true);
    setStoredFingerprintEnabled(true);
    setIsBiometricsVerified(true);
    showToast(`Fingerprint (${record.fingerLabel}) installed & biometric login enabled!`);
  };

  const handleDeleteEnrollment = () => {
    if (window.confirm('Delete installed biometric fingerprint from this device?')) {
      setEnrolledRecord(null);
      setStoredFingerprintRecord(null);
      setFingerprintEnabled(false);
      setStoredFingerprintEnabled(false);
      setIsBiometricsVerified(true);
      setShowBiometricModal(false);
      showToast('Biometric fingerprint deleted.');
    }
  };

  const handleToggleFingerprint = (enabled: boolean) => {
    if (enabled && !enrolledRecord) {
      setIsEnrollModalOpen(true);
      return;
    }
    setFingerprintEnabled(enabled);
    setStoredFingerprintEnabled(enabled);
    if (!enabled) {
      setIsBiometricsVerified(true);
      setShowBiometricModal(false);
      showToast('Fingerprint login disabled.');
    } else {
      showToast('Fingerprint login enabled in settings.');
    }
  };

  const handleTestBiometrics = () => {
    setIsBiometricTestMode(true);
    setShowBiometricModal(true);
  };

  const handleBiometricSuccess = () => {
    setShowBiometricModal(false);
    setIsBiometricTestMode(false);
    showToast('Biometric sensor test verified successfully!');
  };

  const handleBiometricCancel = () => {
    setShowBiometricModal(false);
    setIsBiometricTestMode(false);
  };

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setIsBiometricsVerified(true);
    showToast(`Welcome, ${user.displayName}!`);
  };

  const handleQuickBiometricLogin = () => {
    if (!enrolledRecord) {
      setIsEnrollModalOpen(true);
      return;
    }
    const targetUser: AuthUser = authUser || {
      username: 'hussein',
      displayName: enrolledRecord.officerName || 'Hussein',
      role: 'Senior Loan Officer & Admin',
    };
    setPendingUser(targetUser);
    setIsBiometricTestMode(false);
    setShowBiometricModal(true);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setPendingUser(null);
    setIsBiometricsVerified(!fingerprintEnabled);
    setShowBiometricModal(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out successfully.');
  };

  // Portfolio KPIs
  const portfolioStats = useMemo(() => {
    let totalPrincipal = 0;
    let totalExpected = 0;
    let totalInterest = 0;
    let totalCollected = 0;
    let activeCount = 0;
    let overdueCount = 0;
    let settledCount = 0;

    loans.forEach((l) => {
      totalPrincipal += l.principal;
      totalExpected += l.total;
      totalInterest += l.interest;
      totalCollected += l.paidAmount || 0;
      if (l.status === 'Active') activeCount++;
      if (l.status === 'Overdue') overdueCount++;
      if (l.status === 'Settled') settledCount++;
    });

    const outstandingBalance = Math.max(0, totalExpected - totalCollected);

    return {
      totalPrincipal,
      totalExpected,
      totalInterest,
      totalCollected,
      outstandingBalance,
      activeCount,
      overdueCount,
      settledCount,
      totalCount: loans.length,
    };
  }, [loans]);

  // Next Loan ID generator
  const nextLoanId = useMemo(() => {
    let maxNum = 0;
    loans.forEach((l) => {
      const match = l.id.match(/QL-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `QL-${String(maxNum + 1).padStart(3, '0')}`;
  }, [loans]);

  // Filtering and Sorting
  const filteredLoans = useMemo(() => {
    return loans
      .filter((loan) => {
        if (filter !== 'ALL' && loan.status !== filter) return false;
        
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = loan.name.toLowerCase().includes(q);
          const matchId = loan.id.toLowerCase().includes(q);
          const matchPhone = loan.phone.toLowerCase().includes(q);
          const matchNotes = loan.notes.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchPhone && !matchNotes) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'principal') return b.principal - a.principal;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [loans, filter, searchQuery, sortBy]);

  // Handlers
  const handleRecordPayment = (loanId: string, payment: PaymentRecord) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id !== loanId) return l;
        const newPaid = (l.paidAmount || 0) + payment.amount;
        const isNowSettled = newPaid >= l.total;
        const updated: Loan = {
          ...l,
          paidAmount: newPaid,
          status: isNowSettled ? 'Settled' : l.status,
          payments: [payment, ...(l.payments || [])],
        };

        if (selectedLoan && selectedLoan.id === loanId) {
          setSelectedLoan(updated);
        }

        return updated;
      })
    );
    showToast(`Payment of ${formatUGX(payment.amount)} recorded!`);
  };

  const handleUpdateStatus = (loanId: string, newStatus: LoanStatus) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id !== loanId) return l;
        const updated = { ...l, status: newStatus };
        if (selectedLoan && selectedLoan.id === loanId) {
          setSelectedLoan(updated);
        }
        return updated;
      })
    );
    showToast(`Loan ${loanId} marked as ${newStatus}`);
  };

  const handleAddLoan = (newLoan: Loan) => {
    setLoans((prev) => [newLoan, ...prev]);
    // Also sync borrower into customer directory if not already saved
    setCustomers((prev) => {
      const cleanPhone = newLoan.phone.replace(/[\s+-]/g, '');
      const exists = prev.some((c) => c.phone.replace(/[\s+-]/g, '') === cleanPhone);
      if (exists) return prev;
      const newCust: CustomerContact = {
        id: `CUST-${String(prev.length + 1).padStart(3, '0')}`,
        name: newLoan.name,
        phone: newLoan.phone,
        carrier: newLoan.carrier || 'MTN',
        nin: newLoan.nin || '',
        idNumber: newLoan.idNumber || '',
        companyIdNumber: newLoan.companyIdNumber || '',
        workplace: newLoan.workplace || '',
        department: newLoan.department || '',
        designation: newLoan.designation || '',
        addedByStaff: authUser?.displayName || 'Hussein',
        createdAt: new Date().toISOString().split('T')[0],
      };
      return [newCust, ...prev];
    });
    setPrefilledLoanCustomer(null);
    showToast(`Disbursed loan ${newLoan.id} for ${newLoan.name}!`);
  };

  const handleDeleteLoan = (loanId: string, borrowerName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete completed loan ${loanId} (${borrowerName})?`)) {
      setLoans((prev) => {
        const remaining = prev.filter((l) => l.id !== loanId);
        if (receiptLoanId === loanId && remaining.length > 0) {
          setReceiptLoanId(remaining[0].id);
        }
        return remaining;
      });
      if (selectedLoan && selectedLoan.id === loanId) {
        setSelectedLoan(null);
      }
      showToast(`Completed loan ${loanId} (${borrowerName}) deleted.`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all loans back to original 7 seed records?')) {
      setLoans(INITIAL_LOANS);
      setSelectedLoan(null);
      setReceiptLoanId('QL-007');
      showToast('Restored default portfolio data.');
    }
  };

  const handleOpenReceiptForLoan = (loanId?: string) => {
    if (loanId) {
      setReceiptLoanId(loanId);
    }
    setActiveTab('receipt');
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col items-center justify-start ${viewportMode === 'fullscreen' ? 'p-0 sm:p-4' : 'p-2 sm:p-6'} font-sans`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-slate-900 text-white border border-emerald-500/40 px-4 py-2.5 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop/Tablet Utility Bar (Hidden on actual mobile screens for edge-to-edge phone feel) */}
      <header className="hidden sm:flex w-full max-w-xl mb-3 items-center justify-between gap-3 px-4 py-2 bg-slate-900/95 border border-slate-800 rounded-2xl backdrop-blur-md shadow-lg text-slate-300 text-xs print:hidden">
        <div className="flex items-center gap-2.5 font-medium">
          <div className="w-8 h-8 rounded-full overflow-hidden shadow-xs ring-1 ring-emerald-500/40 shrink-0 bg-slate-950 border border-amber-400/40">
            <img 
              src="/assets/aistudio/hlg_official_seal_1793007495526_dffae54d.jpg" 
              alt="Hussein Loans Group Official Seal" 
              className="w-full h-full object-cover scale-105"
            />
          </div>
          <span className="text-white font-bold tracking-tight">Hussein Loans and Saving Group</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download App / PWA Install Button */}
          <PWAInstallButton compact />

          {/* Viewport switch */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/50">
            <button
              onClick={() => setViewportMode('fullscreen')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                viewportMode === 'fullscreen'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Edge-to-edge phone full screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
            <button
              onClick={() => setViewportMode('phone')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                viewportMode === 'phone'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="View in phone frame mockup"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Frame</span>
            </button>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Settings & Security"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetData}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset to default seed loans"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Full Screen Phone Canvas */}
      <main
        className={`w-full transition-all duration-300 ${
          viewportMode === 'phone'
            ? 'max-w-[420px] h-[870px] max-h-[92vh] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_12px_#1e293b] border-4 border-slate-700/50 overflow-hidden flex flex-col relative bg-slate-50'
            : 'max-w-md w-full min-h-screen sm:min-h-[92vh] sm:h-[92vh] h-dvh rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl border-none sm:border sm:border-slate-800 overflow-hidden flex flex-col relative bg-slate-50'
        }`}
      >
        {/* Phone Notch & Status Bar (Live Uganda EAT Time) */}
        <PhoneStatusBar />

        {/* First Face of Application: Authentication Screen */}
        {!authUser ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          /* Main Authenticated Application Area */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Brand Header with Official Seal Logo */}
            <div className="bg-white border-b border-slate-100 p-3 sm:p-4 shrink-0 shadow-xs print:hidden">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs ring-2 ring-emerald-500/30 shrink-0 bg-slate-900 border border-amber-400/40">
                    <img 
                      src="/assets/aistudio/hlg_official_seal_1793007495526_dffae54d.jpg" 
                      alt="Hussein Loans Group Official Seal" 
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                  <div>
                    <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                      Hussein Loans and Saving Group
                    </h1>
                    <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                      Helping You Move Forward
                    </span>
                  </div>
                </div>

                {/* Right Header: Settings + Install PWA + User Logout */}
                <div className="flex items-center gap-1.5">
                  <div className="sm:hidden">
                    <PWAInstallButton compact />
                  </div>

                  {/* Settings Gear Button */}
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 cursor-pointer"
                    title="Open Settings"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>

                  <div 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-1 bg-slate-100 py-1 px-2 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-200/70 transition-colors"
                    title="Officer Profile & Settings"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {authUser.displayName[0]}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">{authUser.displayName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="text-slate-400 hover:text-rose-600 ml-0.5 p-0.5 transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs: Loans / Contacts (Near Loans) / Dashboard / Receipt */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setActiveTab('loans')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'loans'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Loans ({portfolioStats.totalCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'contacts'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contacts ({customers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('receipt')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === 'receipt'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>

            {/* TAB: CUSTOMER CONTACTS DIRECTORY (Near Loans - 200+ Capacity) */}
            {activeTab === 'contacts' && (
              <CustomerContactsView
                customers={customers}
                loans={loans}
                onOpenAddCustomer={() => {
                  setEditingCustomer(null);
                  setIsAddCustomerOpen(true);
                }}
                onEditCustomer={(cust) => {
                  setEditingCustomer(cust);
                  setIsAddCustomerOpen(true);
                }}
                onDeleteCustomer={handleDeleteCustomer}
                onIssueLoanForCustomer={handleIssueLoanForCustomer}
                onBulkPopulate={handleBulkPopulateCustomers}
                onViewLoanDetail={(l) => setSelectedLoan(l)}
              />
            )}

            {/* TAB 1: LOANS FEED */}
            {activeTab === 'loans' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Filters Header */}
                <div className="bg-white border-b border-slate-100 px-3 sm:px-4 py-2.5 shrink-0 space-y-2.5">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, phone, or ID (e.g. QL-007)..."
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filter Chips row: ALL -> ACTIVE -> OVERDUE -> [DASHBOARD] -> SETTLED */}
                  <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setFilter('ALL')}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                          filter === 'ALL'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All ({portfolioStats.totalCount})
                      </button>

                      <button
                        onClick={() => setFilter('Active')}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                          filter === 'Active'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Active ({portfolioStats.activeCount})
                      </button>

                      <button
                        onClick={() => setFilter('Overdue')}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                          filter === 'Overdue'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Overdue ({portfolioStats.overdueCount})
                      </button>

                      {/* Direct Dashboard trigger right after Overdue */}
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition-colors whitespace-nowrap flex items-center gap-1"
                        title="View Hussein Loans Group Dashboard"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </button>

                      {portfolioStats.settledCount > 0 && (
                        <button
                          onClick={() => setFilter('Settled')}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                            filter === 'Settled'
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Settled ({portfolioStats.settledCount})
                        </button>
                      )}
                    </div>

                    <div className="shrink-0 pl-1">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 rounded-lg px-2 py-1 outline-none border border-slate-200 cursor-pointer"
                      >
                        <option value="dueDate">Due Date</option>
                        <option value="principal">Principal</option>
                        <option value="name">Name</option>
                        <option value="status">Status</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Loans Feed */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                  {filteredLoans.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700">No matching loans found</h3>
                      <button
                        onClick={() => {
                          setFilter('ALL');
                          setSearchQuery('');
                        }}
                        className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    filteredLoans.map((loan) => (
                      <LoanCard
                        key={loan.id}
                        loan={loan}
                        onSelect={(l) => setSelectedLoan(l)}
                        onQuickPay={(l) => setPaymentLoan(l)}
                        onDeleteLoan={handleDeleteLoan}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: HUSSEIN LOANS GROUP — LOANS DASHBOARD */}
            {activeTab === 'dashboard' && (
              <LoansDashboardView
                loans={loans}
                onSelectLoan={(l) => setSelectedLoan(l)}
                onNavigateToReceipt={(id) => handleOpenReceiptForLoan(id)}
                onDeleteLoan={handleDeleteLoan}
              />
            )}

            {/* TAB 3: CUSTOMER LOAN RECEIPT / LOAN SUMMARY */}
            {activeTab === 'receipt' && (
              <ReceiptView
                loans={loans}
                initialLoanId={receiptLoanId}
                onBackToLoans={() => setActiveTab('loans')}
              />
            )}

            {/* Sticky Mobile Bottom Navigation Bar */}
            <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 py-2 shrink-0 grid grid-cols-5 gap-1 z-10 print:hidden">
              <button
                onClick={() => setActiveTab('loans')}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                  activeTab === 'loans' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Wallet className="w-4 h-4 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-1">Loans</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer relative ${
                  activeTab === 'contacts' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Users className="w-4 h-4 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-1">Contacts</span>
                {customers.length > 0 && (
                  <span className="absolute top-0.5 right-2 px-1 text-[8px] font-bold bg-emerald-100 text-emerald-800 rounded-full leading-tight">
                    {customers.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                  activeTab === 'dashboard' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-1">Dashboard</span>
              </button>

              <button
                onClick={() => handleOpenReceiptForLoan(loans[0]?.id || 'QL-007')}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                  activeTab === 'receipt' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Receipt className="w-4 h-4 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-1">Receipt</span>
              </button>

              <button
                onClick={() => {
                  setPrefilledLoanCustomer(null);
                  setIsNewLoanOpen(true);
                }}
                className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-emerald-700 transition-colors min-h-[44px] cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold mt-0.5 text-slate-700">Disburse</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Slide-Up Bottom Sheet: Full Borrower Details */}
      <LoanDetailSheet
        loan={selectedLoan}
        isOpen={Boolean(selectedLoan)}
        onClose={() => setSelectedLoan(null)}
        onOpenPaymentModal={(loan) => setPaymentLoan(loan)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteLoan={handleDeleteLoan}
      />

      {/* Modal: Record UGX Payment */}
      <RecordPaymentModal
        loan={paymentLoan}
        isOpen={Boolean(paymentLoan)}
        onClose={() => setPaymentLoan(null)}
        onRecordPayment={handleRecordPayment}
      />

      {/* Modal: Issue New Loan */}
      <NewLoanModal
        isOpen={isNewLoanOpen}
        onClose={() => {
          setIsNewLoanOpen(false);
          setPrefilledLoanCustomer(null);
        }}
        nextId={nextLoanId}
        onAddLoan={handleAddLoan}
        customers={customers}
        prefilledCustomer={prefilledLoanCustomer}
      />

      {/* Modal: Add or Edit Customer Contact (Ugandan MTN/Airtel KYC) */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => {
          setIsAddCustomerOpen(false);
          setEditingCustomer(null);
        }}
        onSaveCustomer={handleSaveCustomer}
        initialCustomer={editingCustomer}
        currentStaffName={authUser?.displayName}
        onSaveAndIssueLoan={handleIssueLoanForCustomer}
      />

      {/* Modal: Settings & Biometrics */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        authUser={authUser}
        fingerprintEnabled={fingerprintEnabled}
        enrolledRecord={enrolledRecord}
        onToggleFingerprint={handleToggleFingerprint}
        onRequestEnroll={() => {
          setIsSettingsOpen(false);
          setIsEnrollModalOpen(true);
        }}
        onDeleteEnrollment={handleDeleteEnrollment}
        onTestBiometrics={handleTestBiometrics}
        onLogout={handleLogout}
        onResetData={handleResetData}
      />

      {/* Modal: Biometric Authentication Step (No auto-verify, touch sensor to scan) */}
      <BiometricAuthModal
        isOpen={showBiometricModal}
        user={pendingUser || authUser}
        enrolledRecord={enrolledRecord}
        onSuccess={handleBiometricSuccess}
        onCancel={handleBiometricCancel}
        onRequestEnroll={() => {
          setShowBiometricModal(false);
          setIsEnrollModalOpen(true);
        }}
        isTestMode={isBiometricTestMode}
      />

      {/* Modal: Install / Register Biometric Fingerprint */}
      <FingerprintEnrollModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        authUser={authUser || pendingUser}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </div>
  );
}
