# VoltCharge EV MWT — Redesigned Frontend

A redesigned React + Vite EV charging management frontend with working client-side registration, login, booking, profile editing, role-based dashboards, persistent state, responsive UI, dark/light theme support, and localStorage-backed demo data.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Demo login

- Customer: `user` / `1234`
- Manager: `MGR0001` / `1234`
- Technician: `TECH001` / `1234`
- Security: `SEC0001` / `1234`
- Admin: `ADMIN001` / `1234`

## Main frontend features

- Redesigned responsive VoltCharge UI
- Animated cyber/EV visual background
- Login with Login ID or email
- Registration with generated role-specific ID
- Duplicate-email validation and password confirmation
- Persistent login/session using localStorage
- Role-based dashboards for customer, manager, technician, security and admin
- Live station/charger availability from shared system state
- Charging reservation workflow with confirmation screen and booking ID
- Booking state shared across dashboards
- Charging simulator and live session UI
- Booking approvals, charger controls and maintenance workflows
- Profile editing and persistence
- Notifications, theme toggle and responsive sidebar
- Charts and analytics already present in the admin dashboard

## Important

Authentication is intentionally frontend-only for this MWT project. Passwords are stored in browser localStorage for demonstration and should be replaced with a backend authentication service for production.
