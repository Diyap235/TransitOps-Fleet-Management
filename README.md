# TransitOps — Smart Transport Operations Platform

A full-stack fleet management system built with React (Vite) + Node/Express + MongoDB.

---

## Project Structure

```
transitops/
├── backend/          # Express API server
│   ├── config/       # MongoDB connection
│   ├── controllers/  # Request handlers (one file per entity)
│   ├── middleware/   # JWT auth + RBAC
│   ├── models/       # Mongoose schemas
│   └── routes/       # Express routers
└── frontend/         # React (Vite) SPA
    └── src/
        ├── api/      # Axios API modules (one file per entity)
        ├── components/  # Shared UI components
        ├── context/  # React context (AuthContext)
        └── pages/    # Route-level page components
```

---

## Roles & Permissions

| Role              | Access                                         |
|-------------------|------------------------------------------------|
| FleetManager      | Full CRUD on all entities                      |
| Driver            | Read vehicles/trips; create fuel logs          |
| SafetyOfficer     | Read/write maintenance records                 |
| FinancialAnalyst  | Read/write expenses and fuel logs              |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env        # fill in your values
npm install
npm run dev                 # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:3000
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`.

---

## API Endpoints

| Method | Path                   | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/auth/register     | Register a new user      |
| POST   | /api/auth/login        | Login, returns JWT       |
| GET    | /api/auth/me           | Get current user         |
| GET    | /api/vehicles          | List all vehicles        |
| POST   | /api/vehicles          | Create vehicle           |
| GET    | /api/vehicles/:id      | Get single vehicle       |
| PUT    | /api/vehicles/:id      | Update vehicle           |
| DELETE | /api/vehicles/:id      | Delete vehicle           |
| GET    | /api/drivers           | List all drivers         |
| POST   | /api/drivers           | Create driver            |
| GET    | /api/trips             | List all trips           |
| POST   | /api/trips             | Create trip              |
| GET    | /api/maintenance       | List maintenance records |
| POST   | /api/maintenance       | Create maintenance record|
| GET    | /api/fuel-logs         | List fuel logs           |
| POST   | /api/fuel-logs         | Log fuel fill-up         |
| GET    | /api/expenses          | List expenses            |
| POST   | /api/expenses          | Log an expense           |

---

## Module Assignments (Team of 4)

Each person owns a vertical slice — backend controller + routes + frontend page + API module:

| Module         | Files to implement                                                                 |
|----------------|------------------------------------------------------------------------------------|
| **Auth/Users** | `backend/controllers/auth.controller.js` · `frontend/src/pages/Login.jsx`         |
| **Fleet**      | `vehicle.controller.js` · `driver.controller.js` · `Vehicles.jsx` · `Drivers.jsx` |
| **Operations** | `trip.controller.js` · `maintenance.controller.js` · `Trips.jsx` · `Maintenance.jsx` |
| **Finance**    | `fuelLog.controller.js` · `expense.controller.js` · `Reports.jsx`                 |
