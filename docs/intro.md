# MBWedding Application Modernization

## Problem Statement

The MBWedding application is a wedding website built circa 2015 using ASP.NET MVC 5 and Web API 2 on .NET Framework 4.5.1. The application currently runs on an aging server and needs to be preserved by containerizing it to run on a modern Ubuntu 2024 headless server using Docker.

### Constraints

- **Target Host**: Ubuntu 2024 headless server (Linux only - no Windows containers)
- **Current Framework**: .NET Framework 4.5.1 (Windows-only, pre-.NET Core)
- **Current Database**: SQL Server with existing data that must be preserved
- **Goal**: Preservation - keep the application running with minimal ongoing maintenance

### Why This Requires Migration

.NET Framework 4.5.1 applications cannot run on Linux. Docker on Ubuntu only supports Linux containers. Therefore, the application must be ported to .NET 8 (cross-platform) to achieve the containerization goal.

---

## Current Application Analysis

### Technology Stack

| Layer | Technology |
|-------|------------|
| Backend Framework | ASP.NET MVC 5.2.3 + Web API 2 |
| Runtime | .NET Framework 4.5.1 |
| Frontend | AngularJS 1.3.16 (SPA) |
| Data Access | ADO.NET (raw SqlConnection/SqlCommand) |
| Authentication | OAuth 2.0 via OWIN middleware |
| Hosting | IIS with OWIN |
| Database | SQL Server |

### Project Structure

```
/MattAndBrittneyWedding/
├── App_Start/           # OWIN startup, routing, bundling config
├── api/                 # Web API controllers (Gallery, GuestBook)
├── app/                 # AngularJS frontend (modules, assets, views)
├── Models/              # Data models
├── Repository/          # Data access layer (BaseRepository pattern)
├── Services/            # Business logic (EmailService)
├── Providers/           # OAuth provider
├── Web.config           # Configuration (connection strings, SMTP)
└── packages.config      # NuGet dependencies
```

### Key Components Requiring Migration

1. **Data Access Layer** (`Repository/`)
   - `BaseRepository.cs` - SQL Server connection handling, generic query methods
   - `GuestBookRepository.cs` - Guestbook CRUD operations
   - `MemberRepository.cs` - User authentication queries
   - Change: SqlClient → Npgsql (PostgreSQL)

2. **Authentication** (`Providers/`, `App_Start/Startup.cs`)
   - Custom `SimpleAuthorizationServerProvider` using OWIN OAuth
   - Change: OWIN → ASP.NET Core JWT authentication

3. **Controllers** (`api/`, root controllers)
   - Web API 2 style controllers
   - Change: Minor updates to ASP.NET Core conventions

4. **Configuration** (`Web.config`)
   - Connection strings, SMTP settings, app settings
   - Change: Web.config → appsettings.json

5. **Frontend** (`app/`)
   - AngularJS 1.3.16 SPA with modules for home, gallery, guestbook, admin, etc.
   - Change: None required - static files work as-is

### External Dependencies

- **AWS SES** for email (SMTP credentials in config)
- **SQL Server** database with user data to migrate

---

## Proposed Solution

### Target Architecture

| Layer | New Technology |
|-------|----------------|
| Backend Framework | ASP.NET Core 8 (MVC + Web API) |
| Runtime | .NET 8 (cross-platform) |
| Frontend | AngularJS 1.3.16 (unchanged) |
| Data Access | Npgsql (PostgreSQL ADO.NET provider) |
| Authentication | ASP.NET Core JWT Bearer |
| Hosting | Kestrel in Docker container |
| Database | PostgreSQL 16 in Docker container |

### Docker Composition

```
┌─────────────────────────────────────────────┐
│              Ubuntu 2024 Server             │
│  ┌───────────────────────────────────────┐  │
│  │           Docker Compose              │  │
│  │  ┌─────────────┐  ┌─────────────────┐ │  │
│  │  │   web       │  │      db         │ │  │
│  │  │  .NET 8     │──│  PostgreSQL 16  │ │  │
│  │  │  Kestrel    │  │                 │ │  │
│  │  │  Port 8080  │  │  Port 5432      │ │  │
│  │  └─────────────┘  └─────────────────┘ │  │
│  │                          │            │  │
│  │                    ┌─────┴─────┐      │  │
│  │                    │  Volume   │      │  │
│  │                    │  pgdata   │      │  │
│  │                    └───────────┘      │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Database Migration Path

1. Export schema and data from existing SQL Server
2. Convert schema to PostgreSQL (handle data type differences)
3. Import into PostgreSQL container
4. Update application connection strings

---

## Risks and Considerations

### Low Risk
- **Frontend migration**: AngularJS files are static assets, no changes needed
- **Models**: Simple POCOs, direct port
- **Basic CRUD operations**: ADO.NET patterns translate well

### Medium Risk
- **SQL syntax differences**: Some T-SQL may need PostgreSQL equivalents
- **Authentication flow**: OWIN → ASP.NET Core requires rewrite but is well-documented
- **Connection string format**: Different between SQL Server and PostgreSQL

### Items to Verify
- Any stored procedures in the database (would need conversion)
- SQL Server-specific functions used in queries (GETDATE(), etc.)
- Data types that differ between SQL Server and PostgreSQL

---

## Next Steps

1. Review and approve this problem statement
2. Create detailed milestone plan with specific tasks
3. Execute milestones sequentially, tracking progress

---

*Document created: 2026-02-01*
*Last updated: 2026-02-01*
