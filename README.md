# Expenzy — Personal Expense Tracker (MERN)

A full-stack personal expense tracker: MongoDB, Express, React (Vite), Node.js.

Track expenses and income, categorize spending, see monthly stats, a category
breakdown chart, a 12-month trend line, and a "ledger tape" strip of your
latest entries.

## Structure

```
expenzy/
├── server/     Express API (MongoDB via Mongoose, JWT auth)
└── client/     React app (Vite, Tailwind CSS, Recharts)
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — local (`mongodb://127.0.0.1:27017`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 1. Backend setup

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI and a real JWT_SECRET
npm install
npm run dev        # starts on https://expenzy-hcpp.onrender.com
```

## 2. Frontend setup

```bash
cd client
npm install
npm run dev         # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `https://expenzy-hcpp.onrender.com`
(see `client/vite.config.js`), so no extra CORS config is needed in dev.

## 3. Open the app

Visit `http://localhost:5173`, create an account, and start adding entries.

## API overview

| Method | Endpoint             | Description                     |
|--------|-----------------------|----------------------------------|
| POST   | `/api/auth/register`  | Create an account                |
| POST   | `/api/auth/login`     | Log in, returns a JWT            |
| GET    | `/api/auth/me`        | Get the current user             |
| PUT    | `/api/auth/me`        | Update name/budget/currency      |
| GET    | `/api/expenses`       | List entries (filter/paginate)   |
| POST   | `/api/expenses`       | Create an entry                  |
| GET    | `/api/expenses/:id`   | Get one entry                    |
| PUT    | `/api/expenses/:id`   | Update an entry                  |
| DELETE | `/api/expenses/:id`   | Delete an entry                  |
| GET    | `/api/expenses/stats` | Totals, category & trend data    |

All `/api/expenses*` routes require `Authorization: Bearer <token>`.

## Building for production

```bash
cd client
npm run build        # outputs client/dist — serve with any static host
```

Deploy `server/` (e.g. Render, Railway, Fly.io) with your production
`MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` env vars set, and point the
frontend's API calls at that URL (or serve both from the same origin).

## Notes

- Passwords are hashed with bcrypt; auth uses signed JWTs (7-day expiry by default).
- Categories: Food, Transport, Housing, Utilities, Health, Entertainment,
  Shopping, Education, Travel, Other — edit `CATEGORIES` in
  `server/models/Expense.js` and `client/src/constants.js` to change them.
- Currency defaults to INR; change a user's `currency` field via `PUT /api/auth/me`.
