# QuickLoan UG — Mobile Microfinance Loan Manager

A specialized mobile-first loan management application designed for microfinance loan officers and managers in Uganda. The app provides a phone-format interface for tracking active and overdue loans, recording installment repayments, issuing new loans, one-tap borrower dialing, and portfolio summaries in Ugandan Shillings (UGX).

## User Review & Critical Decisions

> [!IMPORTANT]
> The recommended options were selected following the initial design questionnaire:
> 1. **Display Mode**: Centered realistic smartphone mockup on wide screens with a top toolbar toggle to switch smoothly between Phone Frame (iOS/Android mobile shell) and Responsive Full-Screen mode.
> 2. **Interactive Loan Actions**: Full microfinance lifecycle support — viewing borrower records, logging partial or full installment payments, updating loan statuses, and disbursing new loans with automated interest & installment calculations.
> 3. **Design & Currency**: Emerald green fintech identity (`#059669` / `#10B981`) paired with clean slate neutrals, tabular typography for monetary amounts, and official UGX formatting.

---

## 1. Overview & Core Concept

- **What It Does**: QuickLoan UG manages short-term micro-loans (terms in weeks, weekly installments, interest rates, disbursement notes like Mobile Money/ATM/PIN). It tracks all 7 seeded loans (QL-001 through QL-007) and allows officers to record collections in real time, view repayment schedules, check overdue warnings, and calculate interest.
- **Target Audience**: Microfinance lenders, field loan officers, and SACCO credit agents managing informal and weekly micro-credits.
- **Key Value**: Immediate portfolio health visibility (Total Principal, Expected Return, Collected Amount, Outstanding Balance, Overdue Risk) and single-tap borrower outreach.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Portfolio Overview & Quick KPI Bar**:
   - Header displays current date/time, total active vs. overdue count, total principal (UGX 338,500), expected repayment (UGX 539,850), and amount collected.
   - Interactive segmented filters (`All`, `Active`, `Overdue`, `Completed`) with immediate client-side filtering.
   - Search bar filtering dynamically by Borrower Name, Loan ID (e.g. `QL-004`), or Phone Number.

2. **Loan Card Feed & Quick Actions**:
   - Each card displays borrower initials avatar, loan reference, issue date, disbursement channel tag (Mobile Money, ATM, Cash), principal, and total expected due.
   - Due date indicator with subtle urgency coloring (active vs. overdue alert).
   - One-tap phone dialer (`tel:` link) with click-to-copy fallback for numbers like `0706756970`.
   - "Record Payment" button opening an installment logging sheet.

3. **Borrower Detail Bottom Sheet**:
   - Tapping any loan card opens a tactile mobile bottom sheet with smooth slide-up animation.
   - Breakdown of: Principal, Interest Rate (10% to 45%), Term Duration (weeks), Interest Accrued, Total Due, Installment Amount, Payment Schedule, Due Date, and Disbursement Channel / Notes.
   - Payment history log with timestamped receipts and balance countdown.
   - Status update toggle (Active / Overdue / Settled).

4. **New Loan Disbursement Modal**:
   - Floating Action Button (FAB) `+ New Loan` to quickly disburse loans.
   - Auto-computes interest accrued (`principal * rate`), total expected (`principal + interest`), and weekly installment (`total / weeks`).
   - Generates next sequential loan ID (`QL-008`).

5. **Display Viewport Switcher**:
   - On desktop, renders inside a phone device chassis (iPhone-style status bar, notch, and subtle shadow).
   - Top right toggle allows switching to full-screen responsive mode so users on physical mobile phones or tablets get 100% native edge-to-edge layout.

### Visual Identity & Theme

- **Palette**:
  - Dominant Canvas: Crisp neutral slate (`#F8FAFC` light / `#0F172A` phone bezel background).
  - Primary Brand: Emerald fintech green (`#059669` / `#10B981`) conveying financial prosperity and trust.
  - Alert Accent: Ruby red (`#DC2626` / `#FEF2F2`) for overdue loans.
  - Warning Accent: Warm amber (`#D97706` / `#FFFBEB`) for loans due within 48 hours.
- **Typography**:
  - Sans-serif display & body: `Plus Jakarta Sans` or modern system sans (`-apple-system`, `Inter`).
  - Numbers & Currencies: Strict `tabular-nums font-mono` to ensure financial figures align cleanly.
- **Anti-AI Slop Restraint**:
  - No decorative pulsing dots or synthetic version tags.
  - Metadata rendered with unboxed typographic separators (`·` and `/`).
  - Strict minimum touch hitboxes of 44x44px.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Local Storage Persistence with Seed Fallback**:
  - *Chosen Approach*: Initialize with the user's exact 7 loan records (QL-001 through QL-007) and persist all payment updates and new loans in `localStorage`. Include a "Reset to Default Seed Data" option.
  - *Why*: Provides instant reactivity, works offline without cloud database roundtrips, and preserves user edits across browser reloads.
- **Decision 2: Phone Frame Simulator with Fullscreen Toggle**:
  - *Chosen Approach*: Offer a sleek phone frame wrapper with an explicit "Full Screen / Phone Frame" toggle in the desktop utility bar.
  - *Why*: Honoring the user's specific request for "phone formart" while remaining usable on desktop monitors and adapting to true smartphones.
- **Decision 3: Real Installment Tracking vs Static Display**:
  - *Chosen Approach*: Allow logging partial payments (e.g., logging a UGX 27,500 weekly installment) which decrements the remaining balance, updates the progress bar, and automatically marks loans "Settled" when balance reaches 0.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       QuickLoan UG App                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Viewport Container (Phone Mockup Frame / Fullscreen Mode)  │  │
│  └─────────────────────────────┬─────────────────────────────┘  │
│                                │                                │
│  ┌─────────────────────────────▼─────────────────────────────┐  │
│  │                    Top Mobile Status Bar                   │  │
│  │          (Time: 9:41 · Signal · Wi-Fi · Battery)          │  │
│  └─────────────────────────────┬─────────────────────────────┘  │
│                                │                                │
│  ┌─────────────────────────────▼─────────────────────────────┐  │
│  │                     App Header & KPIs                     │  │
│  │    Brand · Total Principal · Expected Due · Search Bar    │  │
│  │         Segmented Filter Tabs (All / Active / Overdue)    │  │
│  └─────────────────────────────┬─────────────────────────────┘  │
│                                │                                │
│  ┌─────────────────────────────▼─────────────────────────────┐  │
│  │                   Scrollable Loan Feed                    │  │
│  │  ┌──────────────────┐  ┌──────────────────┐               │  │
│  │  │ LoanCard (QL-001)│  │ LoanCard (QL-002)│  ...          │  │
│  │  │ Borrower, Phone  │  │ Borrower, Phone  │               │  │
│  │  │ Total & Due Date │  │ Total & Due Date │               │  │
│  │  └──────────────────┘  └──────────────────┘               │  │
│  └─────────────────────────────┬─────────────────────────────┘  │
│                                │                                │
│  ┌─────────────────────────────▼─────────────────────────────┐  │
│  │              Interactive Drawers & Modals                 │  │
│  │  • BorrowerDetailSheet (Complete Breakdown & Log Payment) │  │
│  │  • RecordPaymentModal (Amount, Channel, Receipt note)     │  │
│  │  • NewLoanModal (Calculates Interest, Rate, Installment)  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model & Seed Schema

```typescript
export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  channel: string;
  notes?: string;
}

export interface Loan {
  id: string;              // "QL-001"
  issueDate: string;       // "14-Oct-2026"
  borrowerName: string;    // "Alupo Martha"
  phone: string;           // "0706756970" or ""
  principal: number;       // 50000 (UGX)
  interestRate: number;    // 10.0 (%)
  termDuration: number;    // 2 (weeks)
  termUnit: 'Week' | 'Month';
  interestAccrued: number; // 10000
  totalDue: number;        // 55000 (or principal + interest)
  paidAmount: number;      // 0 initially
  installmentAmount: number; // 27500
  repaymentSchedule: 'Weekly' | 'Monthly' | 'Daily';
  dueDate: string;         // "11/04/2026"
  status: 'Active' | 'Overdue' | 'Settled';
  channelNotes: string;    // "issued", "issued - Pin 1963", "issued - ATM", etc.
  payments: PaymentRecord[];
}
```

### Pre-loaded Dataset
1. **QL-001**: Alupo Martha | 0706756970 | UGX 50,000 | 10% | 2 Wks | Int: 10,000 | Tot: 55,000 | Inst: 27,500 | Due: 11/04/2026 | Active | issued
2. **QL-002**: Mwesito Rose | 0701158091 | UGX 18,500 | 10% | 2 Wks | Int: 3,700 | Tot: 22,200 | Inst: 11,100 | Due: 15/11/2026 | Active | issued
3. **QL-003**: Nicholas | N/A | UGX 10,000 | 10% | 2 Wks | Int: 2,850 | Tot: 12,850 | Inst: 12,850 | Due: 24/10/2026 | Active | issued
4. **QL-004**: Kilanda Paul | 0748176619 | UGX 200,000 | 10% | 8 Wks | Int: 160,000 | Tot: 360,000 | Inst: 45,000 | Due: 19/12/2026 | Active | issued - Pin 1963
5. **QL-005**: Irene G4S | N/A | UGX 10,000 | 45% | 4.4 Wks | Int: 19,800 | Tot: 29,800 | Inst: 6,773 | Due: 16/10/2026 | Overdue | issued
6. **QL-006**: Masendi Emmanuel | 0771196405 | UGX 30,000 | 10% | 2 Wks | Int: 6,000 | Tot: 36,000 | Inst: 18,000 | Due: 5/11/2026 | Active | issued - ATM
7. **QL-007**: Ogola Daniel | 0743719730 | UGX 20,000 | 10% | 2 Wks | Int: 4,000 | Tot: 24,000 | Inst: 12,000 | Due: 11/10/2026 | Active | issued - Mobile Money
