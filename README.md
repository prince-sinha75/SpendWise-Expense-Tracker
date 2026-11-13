# SpendWise — Premium Personal Finance Dashboard

A polished, production-quality expense tracking web application built with React, TypeScript, and a premium dark fintech aesthetic. SpendWise helps you track income and expenses, visualize spending patterns, set budgets, and export your data — all stored locally in your browser.

## Features

### Dashboard Overview
- Four animated summary cards: Total Balance, Total Income, Total Expenses, and Savings Rate
- Interactive expense trend area chart with time-range filtering
- Category breakdown donut chart with legend and percentages
- Recent activity feed with quick edit/delete actions
- All figures calculated from real transaction data

### Transaction Management
- Full CRUD: add, edit, and delete transactions via polished modals
- Transaction details: title, type (income/expense), amount, category, date, payment method, notes
- Inline form validation with helpful error messages
- Confirmation dialog before destructive delete actions

### Transaction History
- Professional responsive table (desktop) and compact cards (mobile)
- Search by description or notes
- Filter by type, category, and date range presets
- Sort by date (newest/oldest) or amount (highest/lowest)
- Load-more pagination for large lists
- Clear empty states for no data and no search matches

### Analytics
- Income vs Expenses bar chart over 6 months
- Expense trend line chart with daily granularity
- Category breakdown donut chart
- Insight cards: average daily spending, top category, net savings
- Time-range filters (7D, 30D, 90D, This Month, This Year, All Time)

### Budgets
- Set monthly spending limits per category
- Animated progress bars with color-coded status (on track, approaching, over budget)
- Overall monthly budget overview with aggregate progress
- Create, edit, and delete budgets with validation
- Budget calculations use actual current-month expenses

### Settings
- Dark and light theme toggle with live preview (persisted)
- Currency selection (USD, EUR, GBP, JPY, INR, CAD, AUD, CHF)
- Starting balance configuration
- Reduce-motion preference for accessibility
- CSV export of all transactions
- Clear all data with confirmation

### Data & Persistence
- All data stored in browser Local Storage — no backend, no account required
- Sample transactions seeded on first visit (removable, never re-seeded)
- Transactions, budgets, and preferences persist across refreshes
- Safe parsing of stored data with graceful fallback

### Design & Animation
- Premium dark-first fintech aesthetic with layered animated background
- Drifting gradient orbs, subtle grid texture, and atmospheric depth
- Glassmorphism on cards, modals, and floating panels
- Framer Motion animations: staggered card entrances, page transitions, modal spring physics, toast notifications, layout animations
- Reduced-motion support for accessibility
- Fully responsive across desktop, tablet, and mobile

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework with type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling with CSS custom properties for theming |
| Framer Motion | Animations and micro-interactions |
| Recharts | Interactive, responsive charts |
| Lucide React | Icon system |
| date-fns | Date formatting and range calculations |
| Local Storage | Client-side data persistence |

## Project Structure

```
src/
├── components/
│   ├── charts/          # Recharts wrappers (Trend, Comparison, Donut)
│   ├── ui/              # Reusable primitives (Card, Modal, ConfirmDialog, etc.)
│   ├── AnimatedBackground.tsx
│   ├── RangeFilter.tsx
│   ├── SummaryCard.tsx
│   ├── TransactionForm.tsx
│   └── TransactionRow.tsx
├── data/
│   ├── categories.ts    # Default expense & income category definitions
│   └── sampleData.ts    # Initial demo transactions
├── hooks/
│   ├── useApp.tsx       # Global state context (transactions, budgets, prefs)
│   ├── useToast.tsx     # Toast notification system
│   └── useTransactionModals.tsx  # Add/edit/delete modal orchestration
├── layouts/
│   ├── Sidebar.tsx      # Navigation with active indicators
│   └── Topbar.tsx       # Page title, search, theme toggle, add button
├── lib/
│   └── storage.ts       # Local Storage read/write with safe parsing
├── pages/
│   ├── DashboardPage.tsx
│   ├── TransactionsPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── BudgetsPage.tsx
│   └── SettingsPage.tsx
├── types/
│   └── index.ts         # TypeScript interfaces
├── utils/
│   ├── dates.ts         # Date formatting and range filtering
│   └── finance.ts       # Calculations, formatting, CSV export
├── App.tsx              # App shell with page routing
├── index.css            # Design system, theme tokens, animations
└── main.tsx
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Screenshots

> _Screenshots can be added here after running the app._

## Notes

- SpendWise uses browser Local Storage exclusively. Data does not sync across devices and is not backed up to any cloud service.
- Sample transactions are added only on first launch. Deleting them is permanent — they will not be restored.
- The savings rate calculation returns 0% when there is no income for the selected period.
- CSV export handles special characters and commas via proper RFC 4180 escaping.
