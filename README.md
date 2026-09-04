# 📊 Pulse — Social Media Dashboard

A full-stack dashboard to track and analyze social media metrics from multiple platforms (Twitter/X, Instagram), with user authentication, data visualization, and built-in post scheduling.

**Stack:** React.js (Vite) · Node.js / Express · PostgreSQL · REST APIs

> Runs fully out of the box with realistic mock data — no paid API keys required to try it out. Swap in real Twitter/Instagram credentials later when you're ready to go live.

---

## ✨ Features

- **User authentication** — JWT-based register/login, protected routes, editable profile
- **Data visualization** — follower growth trends, engagement breakdown, live-style metric cards (Recharts)
- **Schedule & post content** — compose a post for Twitter or Instagram, pick a publish date/time, and a background job (checks every 60s) auto-publishes it when due — or publish on demand
- **Resilient platform integration** — talks to the real Twitter API v2 / Instagram Graph API when you provide credentials, and falls back to mock data automatically otherwise

---

## 🖥️ Prerequisites

Install these first — all free:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18 or newer | https://nodejs.org |
| PostgreSQL | 14 or newer | https://www.postgresql.org/download/ |
| Git | any recent | https://git-scm.com/downloads |

Check they're installed by running in a terminal:
```bash
node -v
psql --version
git --version
```

> **Windows users:** if `psql`/`createdb` say "not recognized" after installing PostgreSQL, the installer's `bin` folder wasn't added to your PATH. See [Troubleshooting](#-troubleshooting) below — or just use **pgAdmin** (installed automatically with PostgreSQL) to create the database with a few clicks instead of the command line.

---

## 🚀 Quick start

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/social-media-dashboard.git
cd social-media-dashboard
```

### 2. Create the database

```bash
createdb social_dashboard
psql -d social_dashboard -f backend/database/schema.sql
```

*(No `createdb` command? Open pgAdmin → right-click Databases → Create → Database → name it `social_dashboard` → open its Query Tool → paste and run `backend/database/schema.sql`.)*

### 3. Set up and run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set at minimum:
- `DB_PASSWORD` — the PostgreSQL password you chose during install
- `JWT_SECRET` — any random string, e.g. `openssl rand -hex 32`

Then:
```bash
npm run seed    # optional: creates a demo login with sample posts
npm run dev     # starts the API on http://localhost:5000
```

### 4. Set up and run the frontend

Open a **new terminal** (keep the backend running):
```bash
cd frontend
npm install
npm run dev     # starts the app on http://localhost:3000
```

### 5. Open it

Visit **http://localhost:3000** and register an account — or log in with the seeded demo account:
```
Email:    demo@pulse.dev
Password: Demo@1234
```

---

## 📁 Project structure

```
social-media-dashboard/
├── backend/
│   ├── config/db.js                  # PostgreSQL connection pool
│   ├── database/schema.sql           # Table definitions
│   ├── database/seed.js              # Demo user + sample posts
│   ├── models/                       # User, Post, Metric (raw SQL via pg)
│   ├── controllers/                  # auth, posts, analytics logic
│   ├── routes/                       # /api/auth, /api/posts, /api/analytics
│   ├── middleware/auth.js            # JWT verification
│   ├── services/socialApiService.js  # Twitter/Instagram adapter + mock fallback
│   └── server.js                     # Express app + cron scheduler
└── frontend/
    ├── src/pages/                    # Login, Register, Dashboard, Analytics, Schedule, Profile
    ├── src/components/                # AppLayout, MetricCard, PulseTicker, charts
    ├── src/context/AuthContext.jsx
    ├── src/services/api.js           # Axios client
    └── src/styles/                   # theme.css (design tokens), app.css
```

---

## 🔌 Connecting real Twitter / Instagram data

By default `USE_MOCK_SOCIAL_DATA=true` in `.env`, so metrics are generated deterministically — enough to demo without an approved developer account.

To go live:
1. Get a Twitter API v2 Bearer Token (developer.twitter.com) and an Instagram Graph API access token + Business Account ID (developers.facebook.com/docs/instagram-api)
2. Fill those into `backend/.env`
3. Set `USE_MOCK_SOCIAL_DATA=false`

`services/socialApiService.js` handles the rest — if a live call ever fails, it automatically falls back to mock data so the dashboard never breaks.

---

## 📡 API reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in, receive JWT |
| GET | `/api/auth/me` | Current user profile |
| PUT | `/api/auth/me` | Update profile |
| GET | `/api/analytics/accounts` | Connected platform accounts |
| GET | `/api/analytics/overview` | Combined follower/post totals |
| GET | `/api/analytics/trend` | Follower/engagement trend over time |
| GET | `/api/analytics/engagement` | Likes/comments/shares by platform |
| GET | `/api/posts` | List posts (filter by status/platform) |
| POST | `/api/posts` | Schedule a new post |
| PUT | `/api/posts/:id` | Edit a post |
| DELETE | `/api/posts/:id` | Delete a post |
| POST | `/api/posts/:id/publish` | Publish a scheduled post immediately |

All routes except `/register`, `/login`, and `/health` require `Authorization: Bearer <token>`.

---

## 🛠️ Troubleshooting

**`createdb`/`psql` not recognized (Windows)**
PostgreSQL's `bin` folder isn't on your PATH.
1. Find it — usually `C:\Program Files\PostgreSQL\<version>\bin`
2. Search Start Menu → "Environment Variables" → Edit the system environment variables → Environment Variables → under *System variables* select `Path` → Edit → New → paste the path above → OK everywhere
3. Close and reopen your terminal, then retry

**`ECONNREFUSED` connecting to Postgres**
Make sure the PostgreSQL service is running (Windows: Services app → look for `postgresql-x64-...`; macOS/Linux: `pg_ctl status` or `brew services list`).

**Port already in use**
Change `PORT` in `backend/.env`, or stop whatever else is using 5000/3000.

**Frontend loads but shows network errors**
Confirm the backend terminal shows `Social Media Dashboard API running on port 5000` and that `backend/.env` has valid DB credentials.

---

## 📝 License

Released under the [MIT License](./LICENSE) — free to use, modify, and distribute.

## 🤝 Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.
