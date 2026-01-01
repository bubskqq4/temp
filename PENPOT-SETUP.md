# Penpot Local Setup

This directory contains the local Penpot installation for the Design Lab.

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- At least 4GB of available RAM

### Starting Penpot

**Option 1: Using Docker Compose (Recommended)**
```powershell
# From the founder directory
docker-compose -f docker-compose.penpot.yml up -d
```

**Option 2: Using the startup script**
```powershell
.\start-penpot.ps1
```

### Accessing Penpot
Once running, Penpot will be available at:
- **URL**: http://localhost:9001
- **First time**: Create an account (registration is enabled)
- **Login**: Use your created credentials

### Stopping Penpot
```powershell
docker-compose -f docker-compose.penpot.yml down
```

### Viewing Logs
```powershell
docker-compose -f docker-compose.penpot.yml logs -f
```

## Integration with Design Lab

The Design Lab page (`/design-lab`) is configured to:
1. Open Penpot at `http://localhost:9001` when clicking projects
2. Manage project metadata (names, descriptions, stars)
3. Provide quick access to your local Penpot instance

## Troubleshooting

### Port 9001 already in use
Change the port in `docker-compose.penpot.yml`:
```yaml
ports:
  - 9002:80  # Change 9001 to 9002
```
Then update the Design Lab page to use the new port.

### Docker not running
Make sure Docker Desktop is running before starting Penpot.

### Data persistence
All Penpot data is stored in Docker volumes:
- `penpot_postgres_v15` - Database
- `penpot_assets` - User assets and files

## Features Enabled
- ✅ User registration
- ✅ Password login
- ✅ No email verification required (for local dev)
- ✅ Asset storage (local filesystem)
- ❌ Telemetry (disabled for privacy)
