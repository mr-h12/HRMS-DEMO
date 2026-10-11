# Smart Technology HRMS Demo

A polished, frontend-only **Human Resource Management System** prototype for **Smart Technology**, an Egyptian company. Its Sales and Procurement teams already run on the [Smart Technology CRM](https://github.com/mr-h12/smart-technology-CRM), and this HRMS is meant to sit beside it as the people module. Like the CRM, it is Arabic-first, works Sunday to Thursday and pays in **EGP**.

The demo models the company's departments: **Sales** (Indoor, Outdoor, Key Accounts, Solar Sales, Sales Support), **Procurement**, **Accounting**, **Construction**, **Solar Energy**, **Human Resources** and **Administration & IT**. Work locations are Cairo HQ, the warehouse, construction sites, solar sites and the field.

The prototype is for demonstrating to clients and stakeholders. It has three complete experiences (**Employee**, **Manager** and **HR Admin**) that you switch between with a global role switcher.

> All data is realistic mock data held in frontend state. There is no backend, database, authentication, payroll engine or HR integration.

## Demo roles

Use **Viewing as: ▼** in the top navigation to switch roles. Switching changes the dashboard, sidebar, available pages, data scope, permitted actions and notifications.

| Role | Persona | Highlights |
| --- | --- | --- |
| **Employee** | Ahmed Hassan · Senior Sales Engineer, Indoor Sales · EMP-1042 | Dashboard, clock in/out, attendance calendar, leave requests, salary advance requests, payslips (view/download), documents (upload), custody items, performance, requests |
| **Manager** | Mohamed Ali · Sales Team Leader (the CRM's Team Leader role) · team of 18 | Team KPIs, 7-day attendance chart, approvals (approve/reject), team table with filters and detail drawer, leave calendar, performance, reports |
| **HR Admin** | Mariam Hassan · HR Manager · 248 employees | Workforce KPIs, headcount and department charts, employees (filters + 5-step add wizard), org chart, contracts & document expiries, onboarding (pre-joining checklist + probation review), offboarding (clearance checklist + final settlement), attendance, leave management, payroll run, salary advances & loans, social insurance & tax (contributions, NOSI forms, salary calculator), recruitment pipeline, training, assets & custody, documents, reports, settings |

Workflows connect across roles. For example, a leave request Ahmed submits appears in Mohamed's approvals and Mariam's leave management, and approving it notifies Ahmed. A salary advance follows the same path and, once approved, appears in Mariam's active loans with its installment schedule.

## Languages

Use the **العربية / English** button in the top bar (or *Preferences → Language*) to switch the whole interface between English and Arabic. Arabic mode:

- mirrors the layout right-to-left (sidebar, drawers, menus, icons, calendars)
- translates every label, table, dialog, toast, notification and chart, plus the mock data (positions, departments, requests, documents) and people's names
- formats dates in Arabic, uses the self-hosted Noto Sans Arabic font, and remembers the choice between visits

Translations live in `src/i18n/` (`ar-ui.ts` for interface copy, `ar-data.ts` for mock data, `names.ts` for names).

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 with shadcn/ui-style components on Radix UI primitives
- React Router 7 (role-scoped routes, lazy-loaded pages)
- Recharts (theme-aware, colorblind-validated palette)
- Lucide React icons, Sonner toasts
- Light and dark mode
- English / Arabic with full RTL layout

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build
npm run preview   # serve the production build
```

Requires Node.js 20+.

## Project structure

```
src/
  components/
    ui/            shadcn-style primitives (button, card, dialog, sheet, select, tabs…)
    layout/        app shell, skeletons
    navbar/        brand, role switcher, global search (⌘K), profile menu, theme toggle
    sidebar/       role-aware navigation
    dashboard/     employee dashboard widgets
    manager/       manager widgets & team data hook
    cards/ charts/ tables/ calendar/ forms/ modals/ drawers/ notifications/ reports/
  pages/
    employee/  manager/  hr/  shared/
  data/            mock datasets (employees, attendance, leaves, payroll, recruitment, performance, notifications, company)
  store/           app state (requests, approvals, notifications, payroll run, candidates…)
  hooks/ types/ utils/ config/
```

## Mock data notes

- The 248-employee workforce is generated with a seeded random generator, so it is identical on every load. The department split (Construction 70, Sales 64, Solar Energy 44, Procurement 22, Administration & IT 20, Accounting 18, HR 10), status counts (13 on leave, 9 on probation) and payroll totals (EGP 5,962,400 gross / EGP 834,700 deductions / EGP 5,127,700 net) are derived from, and reconcile with, the row-level data.
- Department heads, salary bands, the `smarttech.com.eg` email domain and the company address are placeholders. Replace them with real values before showing the demo outside the company.
- The demo is anchored on **Wednesday, October 7, 2026** for attendance, leave and payroll.

## Limitations

- State is in memory. A full page reload resets the demo data (role and theme preferences are remembered).
- File uploads are accepted but not stored. Downloads produce generated text/CSV files.
- No real authentication. "Sign out" returns to a role picker.
