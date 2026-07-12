# Mining Issue Tracker

Full-stack issue tracking app for mining operations. Monorepo with ASP.NET Core API backend and React frontend.

## Project structure

```text
mining-issue-tracker/
├── backend/     ASP.NET Core Web API + PostgreSQL
├── frontend/    Vite + React + TypeScript + Tailwind
└── render.yaml  Render Blueprint for the API
```

## Local setup

### Prerequisites

- .NET 8 SDK
- Node.js 20+
- PostgreSQL 14+

### Database

```bash
sudo -u postgres psql -c "CREATE DATABASE mining_issue_tracker;"
```

### Backend

1. Copy the local config template:

```bash
cp backend/MiningIssueTracker.Api/MiningIssueTracker.Api/appsettings.Development.example.json \
   backend/MiningIssueTracker.Api/MiningIssueTracker.Api/appsettings.Development.json
```

2. Edit `appsettings.Development.json` and set your PostgreSQL password.

3. Run migrations and start the API:

```bash
cd backend/MiningIssueTracker.Api/MiningIssueTracker.Api
dotnet ef database update
dotnet run
```

API: `http://localhost:5253/swagger`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

## Configuration

| Variable | Purpose |
|----------|---------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection (backend) |
| `CORS_ORIGINS` | Comma-separated frontend URLs (backend) |
| `VITE_API_BASE_URL` | API base URL (frontend build) |

See `.env.example` and `frontend/.env.example`.

## Deployment

Recommended stack (free tier friendly):

| Layer | Service | Notes |
|-------|---------|-------|
| Database | [Neon](https://neon.tech) or [Supabase](https://supabase.com) | Managed PostgreSQL |
| Backend API | [Render](https://render.com) | Docker Web Service |
| Frontend | [Vercel](https://vercel.com) | Static site from `frontend/dist` |

### Step 1 — PostgreSQL (Neon)

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **connection string** (Npgsql format), e.g.  
   `Host=...;Database=...;Username=...;Password=...;SSL Mode=Require`
3. Run migrations once from your machine:

```bash
export ConnectionStrings__DefaultConnection="YOUR_NEON_CONNECTION_STRING"
cd backend/MiningIssueTracker.Api/MiningIssueTracker.Api
dotnet ef database update
```

### Step 2 — Backend (Render)

1. Push this repo to GitHub.
2. In Render: **New → Blueprint** → connect repo (uses `render.yaml`),  
   or **New → Web Service → Docker** with:
   - Root directory: `backend/MiningIssueTracker.Api/MiningIssueTracker.Api`
   - Dockerfile path: `Dockerfile`
3. Set environment variables:

| Key | Value |
|-----|-------|
| `ConnectionStrings__DefaultConnection` | Neon connection string |
| `CORS_ORIGINS` | Your Vercel URL (set after Step 3), e.g. `https://mining-issue-tracker.vercel.app` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

4. Deploy and note the API URL, e.g. `https://mining-issue-tracker-api.onrender.com`.
5. Verify: `GET https://YOUR-API-URL/health` → `{ "status": "healthy" }`

> **Note:** Render free tier spins down after inactivity. First request may take ~30s.

### Step 3 — Frontend (Vercel)

1. Import the GitHub repo in [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (build: `npm run build`, output: `dist`).
4. Add environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://YOUR-API-URL.onrender.com` (no trailing slash) |

5. Deploy and copy your frontend URL.

### Step 4 — Update CORS

Back in Render, update `CORS_ORIGINS` with your exact Vercel URL and redeploy the API.

### Optional — Custom domain

- Vercel: add domain in project settings.
- Render: add custom domain for API.
- Update `CORS_ORIGINS` and `VITE_API_BASE_URL` accordingly.

## Health check

- `GET /health` — API liveness probe (used by Render)

## Security notes

- Never commit `appsettings.Development.json` or `.env` files with real passwords.
- Swagger is disabled in Production.
- Migrations run automatically on API startup in Production.
