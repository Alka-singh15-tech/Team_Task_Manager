# Team Task Manager – Server

## Prerequisites
- Node.js >= 18
- PostgreSQL database

## Setup
```bash
cd server
cp .env.example .env   # edit with your DB credentials
npm install
npm run dev   # starts server with nodemon on port 5000
```

## Docker (optional)
```bash
# Build image
docker build -t taskmgr-server .
# Run container (replace env vars as needed)
docker run -d -p 5000:5000 \
  -e DB_URL=postgres://user:pwd@db:5432/taskmgr \
  -e JWT_SECRET=supersecret \
  taskmgr-server
```

## API
All endpoints are prefixed with `/api`.
- **Auth**: `/auth/register`, `/auth/login`
- **Projects**: `/projects` (CRUD, protected)
- **Tasks**: `/tasks` (CRUD, protected)
- **Memberships**: `/memberships/:projectId/users` (add/remove members)

See the code for request validation and role‑based access.
