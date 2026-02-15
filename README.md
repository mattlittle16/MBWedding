# Matt + Brittney Wedding


A preserved time capsule of our wedding website from 2016, modernized to run in Docker.

---

## About

This website was originally built in 2015 for our wedding on August 13, 2016. It features our story, photo gallery, wedding party info, and a guestbook with messages from our loved ones.

The site has been modernized from .NET Framework 4.5.1 to .NET 8 for long-term preservation, allowing it to run on any modern Linux server via Docker.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | ASP.NET Core 8 |
| Frontend | AngularJS 1.3 |
| Styling | Bootstrap 3 |
| Data | Static JSON (no database) |
| Hosting | Docker / Kestrel |

---

## Quick Start

```bash
# Clone and run
git clone <repo-url>
cd MBWedding
docker compose up -d --build

# View the site
open http://localhost:8082
```

---

## Project Structure

```
MBWedding/
├── MBWedding.Web/          # .NET 8 web application
│   ├── Controllers/        # API endpoints
│   ├── Data/               # Guestbook JSON data
│   ├── wwwroot/            # Static frontend (AngularJS)
│   └── Program.cs          # App configuration
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # Container orchestration
└── docs/                   # Project documentation
```

---

## Features

- **Our Story** - How we met and fell in love
- **Gallery** - Photos from our journey together
- **Wedding Party** - Our amazing bridesmaids and groomsmen
- **When & Where** - Ceremony and reception details
- **Lodging** - Accommodation info for guests
- **Gifts** - Registry links
- **Guestbook** - Messages from family and friends

---

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/guestbook` | Returns all guestbook entries |
| `GET /api/gallery` | Returns gallery image paths |

---

*Built with love, preserved forever.*
