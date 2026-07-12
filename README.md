# Mining Issue Tracker

Full-stack issue tracking app for mining operations. Monorepo with ASP.NET Core API backend and React frontend.

## Project structure

```text
mining-issue-tracker/
├── backend/     ASP.NET Core Web API + PostgreSQL
└── frontend/    Vite + React + TypeScript + Tailwind
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

| Environment | How to set connection string |
|-------------|------------------------------|
| Local dev | `appsettings.Development.json` (not committed) |
| Production | Environment variable `ConnectionStrings__DefaultConnection` |

See `.env.example` for variable names.

## Deployment notes

- **Frontend**: build with `npm run build`, deploy `frontend/dist/` (e.g. Vercel, Netlify)
- **Backend**: `dotnet publish`, deploy to Azure / Railway / Render
- **Database**: managed PostgreSQL (Supabase, Neon, Railway)
- Set CORS allowed origins in `Program.cs` for your production frontend URL
