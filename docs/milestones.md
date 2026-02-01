# MBWedding Modernization - Milestone Plan

## Overview

This document outlines the milestone-based approach to modernize and containerize the MBWedding application for preservation on an Ubuntu 2024 server.

**Key Simplification**: Since this is a frozen-in-time preservation project, we will:
- Eliminate the database entirely (serve guestbook from static JSON)
- Remove the admin section from the AngularJS app
- Remove the guestbook submission form (no new entries)
- Make the entire site read-only

This dramatically reduces complexity and creates a true time capsule of the wedding site.

---

## Milestone Summary

| # | Milestone | Description | Status |
|---|-----------|-------------|--------|
| 1 | Data Extraction | Extract guestbook data to JSON | **Complete** |
| 2 | Project Setup | Create .NET 8 project structure | **Complete** |
| 3 | Static Data Layer | Implement JSON-based data access | **Complete** |
| 4 | Core Application | Port controllers and API endpoints | Not Started |
| 5 | Frontend Cleanup | Remove admin, remove guestbook form, serve static | Not Started |
| 6 | Docker Configuration | Create Dockerfile and compose setup | Not Started |
| 7 | Smoke Test & Deploy | Build container, verify it runs | Not Started |

---

## Milestone 1: Data Extraction

**Goal**: Extract guestbook entries from SQL dump to a clean JSON file

### Tasks

- [x] Parse `MBWedding.sql` and extract GuestBook records
- [x] Filter to only visible, non-deleted entries
- [x] Create `guestbook.json` with clean structure
- [x] Verify all meaningful entries are captured

### Data Structure

**Input** (from SQL):
```sql
GuestBook (GuestBookID, Message, Email, Name, Injected, IsVisible, IsDeleted)
```

**Output** (`data/guestbook.json`):
```json
[
  {
    "id": 25,
    "name": "Brittney Pugh",
    "email": "brittney.pugh@gmail.com",
    "message": "I love you so much, Matt!...",
    "date": "2015-08-04T10:46:34"
  }
]
```

### Entries to Preserve

Based on SQL dump analysis, these are the real guest entries (IsVisible=1, IsDeleted=0):

| ID | Name | Date |
|----|------|------|
| 25 | Brittney Pugh | 2015-08-04 |
| 28 | Matthew Little | 2015-08-04 |
| 31 | Dad (Little) | 2015-08-12 |
| 32 | Sunny | 2016-02-22 |
| 33 | Henrietta Little | 2016-04-03 |
| 37 | Lisa Pugh | 2016-07-12 |
| 38 | Kevin, Micki and Brock | 2016-07-12 |
| 39 | Hans, Tess, Hunter | 2016-07-12 |
| 40 | Boomer | 2016-07-12 |
| 41 | Nick Gramelspacher | 2016-07-12 |
| 42 | Brady and Becky | 2016-07-12 |
| 43 | Debbi Harris | 2016-07-12 |
| 44 | Lori Howell | 2016-07-12 |
| 45 | Jay | 2016-07-12 |
| 46 | Sherry | 2016-07-12 |
| 47 | Tom & Terry | 2016-07-12 |
| 48 | Glenn and Mag | 2016-07-12 |
| 49 | Tracey & Craig | 2016-07-13 |
| 50 | Colby, Shara, Tevyn, Toryn & Teslyn | 2016-07-13 |
| 51 | Kelly, Brody and Dylan Gabriel | 2016-07-20 |
| 53 | Jen Gresenz | 2016-07-20 |
| 54 | Pat & Reggie | 2016-07-27 |
| 55 | H5 Crew | 2016-08-12 |
| 56 | Bonnie | 2016-08-24 |
| 57 | The Jerry's | 2016-09-02 |

**Total**: 25 guest book entries to preserve

### Deliverables

- `data/guestbook.json` - All guest entries in clean JSON format

---

## Milestone 2: Project Setup

**Goal**: Create new .NET 8 ASP.NET Core project structure

### Tasks

- [x] Create new ASP.NET Core 8 Web API project
- [x] Set up solution structure
- [x] Configure project for Linux/container deployment
- [x] Add required NuGet packages (none needed - built-in is sufficient)

### Project Structure

```
/MBWedding.Web/
├── MBWedding.Web.csproj
├── Program.cs
├── appsettings.json
├── Controllers/
│   ├── GuestBookController.cs
│   └── GalleryController.cs
├── Models/
│   └── GuestBookEntry.cs
├── Services/
│   └── GuestBookService.cs
├── Data/
│   └── guestbook.json
└── wwwroot/
    └── (AngularJS app files)
```

### NuGet Packages

- `Microsoft.AspNetCore.SpaServices.Extensions` (for SPA fallback)
- No database packages needed

### Deliverables

- New `MBWedding.Web/` directory with .NET 8 project
- `MBWedding.sln` solution file

---

## Milestone 3: Static Data Layer

**Goal**: Implement JSON-based data access to replace database repositories

### Tasks

- [x] Create `GuestBookEntry` model
- [x] Create `GuestBookService` to load and serve JSON data
- [x] Implement caching (load once at startup via singleton)
- [x] Add sorting by date (descending - newest first)

### Code Changes

**Original** (SQL Server):
```csharp
public class GuestBookRepository : BaseRepository
{
    public List<GuestBookModel> SelectVisible()
    {
        return Query<GuestBookModel>("SELECT * FROM GuestBook WHERE IsVisible=1...");
    }
}
```

**New** (JSON file):
```csharp
public class GuestBookService
{
    private readonly List<GuestBookEntry> _entries;

    public GuestBookService(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "guestbook.json");
        _entries = JsonSerializer.Deserialize<List<GuestBookEntry>>(File.ReadAllText(path));
    }

    public List<GuestBookEntry> GetAll() => _entries.OrderByDescending(e => e.Date).ToList();
}
```

### Deliverables

- `Models/GuestBookEntry.cs`
- `Services/GuestBookService.cs`
- Registered as singleton in DI

---

## Milestone 4: Core Application

**Goal**: Port API controllers from Web API 2 to ASP.NET Core

### Tasks

- [ ] Port `GuestBookController` (read-only, no POST needed for preservation)
- [ ] Port `GalleryController` (if needed, or make static)
- [ ] Configure routing to match original API paths
- [ ] Remove authentication (not needed for read-only preservation)

### API Endpoints

| Original | New | Notes |
|----------|-----|-------|
| `GET /api/guestbook` | `GET /api/guestbook` | Returns all visible entries |
| `GET /api/gallery` | Static files | Images served directly |

### Code Changes

**Original** (Web API 2):
```csharp
public class GuestBookController : ApiController
{
    [HttpGet]
    public IHttpActionResult Get()
    {
        var repo = new GuestBookRepository();
        return Ok(repo.SelectVisible());
    }
}
```

**New** (ASP.NET Core):
```csharp
[ApiController]
[Route("api/[controller]")]
public class GuestBookController : ControllerBase
{
    private readonly GuestBookService _service;

    public GuestBookController(GuestBookService service) => _service = service;

    [HttpGet]
    public ActionResult<List<GuestBookEntry>> Get() => _service.GetAll();
}
```

### Deliverables

- `Controllers/GuestBookController.cs`
- Working API endpoints matching original paths

---

## Milestone 5: Frontend Cleanup

**Goal**: Remove admin/write functionality and serve AngularJS as read-only frozen site

### Tasks

- [ ] Copy `app/` directory contents to `wwwroot/`
- [ ] **Remove admin section entirely** (`app/admin/` directory)
- [ ] **Remove guestbook submission form** from guestbook view
- [ ] **Remove login functionality** (no longer needed)
- [ ] Remove auth-related JavaScript (authService, authInterceptor)
- [ ] Update navigation to remove admin/login links
- [ ] Configure static file middleware
- [ ] Set up SPA fallback for client-side routing
- [ ] Verify all assets load correctly (CSS, JS, images, fonts)

### Files/Directories to Remove

```
app/admin/           # Entire admin module
app/login/           # Login page
app/shared/auth*/    # Auth services (if separate)
```

### Files to Modify

- `app/guestbook/guestbook.html` - Remove the "Sign the Guestbook" form
- `app/app.js` - Remove admin and login routes
- `app/layout/` - Remove admin/login links from navigation
- `index.html` - Remove auth script references

### Configuration

```csharp
// Program.cs
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
```

### File Mapping

| Original Location | New Location |
|-------------------|--------------|
| `/app/` | `/wwwroot/app/` |
| `/app/assets/` | `/wwwroot/app/assets/` |
| `/index.cshtml` | `/wwwroot/index.html` |

### Deliverables

- All frontend assets in `wwwroot/`
- Admin section removed
- Guestbook form removed (display only)
- Login removed
- Read-only frozen site

---

## Milestone 6: Docker Configuration

**Goal**: Create Docker setup for containerized deployment

### Tasks

- [ ] Create `Dockerfile` for .NET 8 app
- [ ] Create `docker-compose.yml`
- [ ] Configure health checks
- [ ] Set up volume for any persistent data (if needed)

### Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MBWedding.Web/MBWedding.Web.csproj", "MBWedding.Web/"]
RUN dotnet restore "MBWedding.Web/MBWedding.Web.csproj"
COPY . .
WORKDIR "/src/MBWedding.Web"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MBWedding.Web.dll"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:8080
    restart: unless-stopped
```

### Deliverables

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

---

## Milestone 7: Smoke Test & Deploy

**Goal**: Build the container and verify it runs

### Tasks

- [ ] Build Docker image
- [ ] Run container locally
- [ ] Quick manual verification (pages load, guestbook displays)
- [ ] Document deployment commands

### Quick Verification

```bash
# Build and start
docker-compose up -d --build

# Verify running
docker-compose ps

# Check guestbook API
curl http://localhost:8080/api/guestbook

# Open in browser and click around
open http://localhost:8080
```

### Deployment Commands (for Ubuntu server)

```bash
# Clone repository
git clone <repo-url>
cd MBWedding

# Build and start
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs
```

### Deliverables

- Working containerized application
- Container builds and runs successfully

---

## Progress Tracking

### Current Status

**Active Milestone**: Milestone 4 (awaiting user verification of Milestone 3)

### Completed Milestones

- **Milestone 1: Data Extraction** - Completed 2026-02-01
  - Extracted 25 guestbook entries to `data/guestbook.json`
  - Filtered out 10 test/deleted entries

- **Milestone 2: Project Setup** - Completed 2026-02-01
  - Created `MBWedding.Web/` .NET 8 project
  - Created `MBWedding.sln` solution file
  - Configured for Linux/container deployment
  - Set up directory structure (Controllers, Models, Services, Data, wwwroot)

- **Milestone 3: Static Data Layer** - Completed 2026-02-01
  - Created `GuestBookEntry` model
  - Created `GuestBookService` singleton
  - Loads JSON at startup, serves sorted by date

### Notes

- This document will be updated as we complete each milestone
- Each milestone should be completed and verified before moving to the next
- Any blockers or changes will be documented here

---

## Architecture Comparison

### Before (Original)

```
┌─────────────────┐     ┌─────────────────┐
│   IIS Server    │────▶│   SQL Server    │
│  .NET Fx 4.5.1  │     │   (MBWedding)   │
│   OWIN OAuth    │     └─────────────────┘
└─────────────────┘
```

### After (Modernized)

```
┌─────────────────────────────────────┐
│          Docker Container           │
│  ┌─────────────────────────────┐   │
│  │      .NET 8 Kestrel         │   │
│  │  ┌───────────────────────┐  │   │
│  │  │   guestbook.json      │  │   │
│  │  │   (embedded data)     │  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Benefits**:
- No external database dependency
- Single container deployment
- ~50MB image size (vs 4GB+ for Windows)
- Runs on any Linux server
- Zero maintenance for data layer
- Truly frozen in time - no write operations possible

**What Gets Removed**:
- Admin section (entire module)
- Login/authentication system
- Guestbook submission form
- All POST/write API endpoints
- Email service
- Database connectivity

---

*Document created: 2026-02-01*
*Last updated: 2026-02-01 (Milestone 3 complete)*
