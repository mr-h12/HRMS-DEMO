# Professional HRMS Demo

A polished, frontend-only **Human Resource Management System** prototype for demonstrating to clients and stakeholders. It has three complete experiences (**Employee**, **Manager** and **HR Admin**) that you switch between with a global role switcher.

> All data is realistic mock data held in frontend state. There is no backend, database, authentication, payroll engine or HR integration.

## Demo roles

Use **Viewing as: ▼** in the top navigation to switch roles. Switching changes the dashboard, sidebar, available pages, data scope, permitted actions and notifications.

| Role | Persona | Highlights |
| --- | --- | --- |
| **Employee** | Ahmed Hassan · Senior Software Engineer · EMP-1042 | Dashboard, clock in/out, attendance calendar, leave requests, payslips (view/download), documents (upload), performance, requests |
| **Manager** | Mohamed Ali · Engineering Manager · team of 18 | Team KPIs, 7-day attendance chart, approvals (approve/reject), team table with filters and detail drawer, leave calendar, performance, reports |
| **HR Admin** | Mariam Hassan · HR Manager · 524 employees | Workforce KPIs, headcount and department charts, employees (filters + 5-step add wizard), attendance, leave management, payroll run, recruitment pipeline, training, documents, reports, settings |

Workflows connect across roles. For example, a leave request Ahmed submits appears in Mohamed's approvals and Mariam's leave management, and approving it notifies Ahmed.

## Languages

Use the **العربية / English** button in the top bar (or *Preferences → Language*) to switch the whole interface between English and Arabic. Arabic mode:

- mirrors the layout right-to-left (sidebar, drawers, menus, icons, calendars)
- translates every label, table, dialog, toast, notification and chart, plus the mock data (positions, departments, requests, documents) and people's names
- formats dates in Arabic, uses the IBM Plex Sans Arabic font, and remembers the choice between visits

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

- The 524-employee workforce is generated with a seeded random generator, so it is identical on every load. Department split, status counts (27 on leave, 18 new hires) and payroll totals ($842,430 gross / $112,400 deductions / $730,030 net) are derived from, and reconcile with, the row-level data.
- The demo is anchored on **Wednesday, October 7, 2026** for attendance, leave and payroll.
- The "Engineering" slice in the department chart corresponds to the **Technology** department.

## Limitations

- State is in memory. A full page reload resets the demo data (role and theme preferences are remembered).
- File uploads are accepted but not stored. Downloads produce generated text/CSV files.
- No real authentication. "Sign out" returns to a role picker.
