# Mining Issue Tracker

A full-stack web application for logging, triaging, and resolving operational issues across mining sites — equipment failures, safety incidents, and maintenance tasks. The backend is a **C# / ASP.NET Core 8 Web API** backed by **PostgreSQL** via **Entity Framework Core**, with a React + TypeScript front end.

---

## Why this project

Mining operations generate a constant stream of issues that need to be captured, prioritised, assigned, and tracked to resolution. This app models that workflow end to end and focuses on the parts a backend developer owns:

- A well-structured **C# domain model** (`Site`, `Equipment`, `Issue`) with enums for status and priority.
- A **REST API** with filtering, validation, and aggregate reporting.
- **EF Core** code-first migrations and relational constraints against PostgreSQL.
- Production concerns: environment-based configuration, CORS, health checks, containerisation, and automated migrations on startup.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Language** | **C# 12** (.NET 8) |
| **API** | **ASP.NET Core 8 Web API**, controller-based |
| **Data access** | **Entity Framework Core 8** (code-first) |
| **Database** | **PostgreSQL** (Npgsql provider) |
| **API docs** | Swagger / OpenAPI (Swashbuckle) |
| **Frontend** | React 19, TypeScript, Vite, Tailwind |
| **Deployment** | Docker, Render (API), Vercel (UI), Neon (DB) |

---

## Backend architecture (C#)

```text
backend/MiningIssueTracker.Api/MiningIssueTracker.Api/
├── Program.cs                 # App bootstrap: DI, DbContext, CORS, health, migrations
├── Controllers/
│   ├── IssuesController.cs     # CRUD + status transitions for issues
│   ├── DashboardController.cs  # Aggregate KPI reporting
│   ├── SitesController.cs      # Site lookup
│   └── EquipmentController.cs  # Equipment lookup (filtered by site)
├── Data/
│   └── AppDbContext.cs        # EF Core context, relationships, seed data
├── Models/
│   ├── Issue.cs               # Core entity
│   ├── Site.cs
│   ├── Equipment.cs
│   ├── IssueStatus.cs         # enum: Open, InProgress, Resolved
│   └── IssuePriority.cs       # enum: Low, Medium, High
└── Migrations/                # EF Core code-first migrations
```

### Domain model

The `Issue` entity is the heart of the system. It uses nullable reference types, C# enums, and navigation properties for EF Core relationships:

```csharp
public class Issue
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public IssuePriority Priority { get; set; } = IssuePriority.Medium;
    public IssueStatus Status { get; set; } = IssueStatus.Open;
    public int SiteId { get; set; }
    public int? EquipmentId { get; set; }
    public string? AssignedTo { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }

    public Site Site { get; set; } = null!;
    public Equipment? Equipment { get; set; }
}
```

### EF Core highlights

- **Code-first migrations** — the schema is defined in C# and generated with `dotnet ef migrations`.
- **Relationships & constraints** configured in `AppDbContext.OnModelCreating`:
  - `Site` 1‑to‑many `Equipment` and `Issue` (with `DeleteBehavior.Restrict`).
  - `Equipment` optional on `Issue` (`DeleteBehavior.SetNull`).
  - Unique index on `Site.Name`.
- **Enums persisted as strings** for readable database values (`HasConversion<string>()`).
- **Seed data** for two sites and three equipment items.

### API design

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/issues` | List issues, filterable by `status`, `priority`, `siteId` |
| `GET` | `/api/issues/{id}` | Get a single issue with related site/equipment |
| `POST` | `/api/issues` | Create an issue (validates site & equipment references) |
| `PATCH` | `/api/issues/{id}/status` | Transition status; stamps `ResolvedAt` when resolved |
| `GET` | `/api/dashboard/summary` | KPIs: open, in-progress, high-priority counts + avg resolution time |
| `GET` | `/api/sites` | List sites |
| `GET` | `/api/equipment?siteId=` | List equipment, optionally filtered by site |
| `GET` | `/health` | Liveness probe |

C# techniques used across the controllers:

- **Async/await** end to end with `async Task<ActionResult<T>>`.
- **LINQ** query composition for filtering and aggregation (e.g. average resolution hours over resolved issues).
- **Server-side validation** returning appropriate `BadRequest` / `NotFound` results.
- **Constructor dependency injection** of `AppDbContext`.
- `System.Text.Json` configured with `ReferenceHandler.IgnoreCycles` to safely serialise related entities.

---

## Project structure

```text
mining-issue-tracker/
├── backend/     ASP.NET Core 8 Web API + EF Core + PostgreSQL  (C#)
├── frontend/    Vite + React + TypeScript + Tailwind
└── render.yaml  Render Blueprint for the API
```

---

## Running locally

### Prerequisites

- **.NET 8 SDK**
- Node.js 20+
- PostgreSQL 14+

### 1. Database

```bash
sudo -u postgres psql -c "CREATE DATABASE mining_issue_tracker;"
```

### 2. Backend (C# API)

```bash
# Copy the local config template and set your PostgreSQL password
cp backend/MiningIssueTracker.Api/MiningIssueTracker.Api/appsettings.Development.example.json \
   backend/MiningIssueTracker.Api/MiningIssueTracker.Api/appsettings.Development.json

cd backend/MiningIssueTracker.Api/MiningIssueTracker.Api
dotnet ef database update   # apply migrations
dotnet run                  # start the API
```

API + Swagger UI: `http://localhost:5253/swagger`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## Configuration

| Variable | Purpose |
|----------|---------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string (backend) |
| `CORS_ORIGINS` | Comma-separated allowed frontend URLs (backend) |
| `VITE_API_BASE_URL` | API base URL used by the frontend build |

See `.env.example` and `frontend/.env.example`.

---

## Deployment

Deployed with a free-tier-friendly stack:

| Layer | Service | Notes |
|-------|---------|-------|
| Database | [Neon](https://neon.tech) | Managed PostgreSQL |
| Backend API | [Render](https://render.com) | Docker web service, auto-migrates on startup |
| Frontend | [Vercel](https://vercel.com) | Static build from `frontend/dist` |

Production-readiness features baked into the C# backend:

- **Environment-driven CORS** — origins read from `CORS_ORIGINS`.
- **Automatic EF Core migrations** on startup in Production (`db.Database.Migrate()`).
- **Health endpoint** (`/health`) used by Render's health checks.
- **Forwarded headers** support for running behind a reverse proxy.
- **Swagger disabled** outside Development.
- **Multi-stage Dockerfile** using the official .NET SDK/runtime images.

### Deploy steps

1. **Database (Neon)** — create a project, copy the Npgsql connection string, then run `dotnet ef database update` once against it.
2. **API (Render)** — `New → Blueprint` (uses `render.yaml`). Set `ConnectionStrings__DefaultConnection`, `CORS_ORIGINS`, and `ASPNETCORE_ENVIRONMENT=Production`. Verify `GET /health`.
3. **Frontend (Vercel)** — import repo, set **Root Directory** to `frontend`, add `VITE_API_BASE_URL` = your Render API URL.
4. **CORS** — update `CORS_ORIGINS` on Render with your Vercel URL and redeploy.

> Render's free tier spins down after inactivity, so the first request may take ~30s.

---

## Security notes

- `appsettings.Development.json` and `.env` files are git-ignored — no secrets in source control.
- Connection strings and CORS origins are provided via environment variables in production.
- Swagger is only enabled in the Development environment.

---

## Possible next steps

- DTOs + AutoMapper to decouple API contracts from EF entities.
- Unit/integration tests with xUnit and an in-memory or Testcontainers PostgreSQL.
- Authentication & role-based authorisation (site supervisors vs. operators).
- Audit history of status changes.
