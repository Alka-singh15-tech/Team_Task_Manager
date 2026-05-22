# Team Task Manager (Ethara.ai Project)

A production-ready full-stack Team Task Manager application built with industry-standard technologies.

## Technology Stack

### Backend (/server)
- **Node.js** & **Express**
- **PostgreSQL** with **Sequelize ORM**
- **JWT** for Authentication
- **Express-Validator** for input validation
- **Helmet.js** & **Rate Limiting** for security
- **standardized responses** `{ success: true, data: ..., message: ... }`

### Frontend (/client)
- **React 18** with **Vite**
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **React Query** for server state management
- **React Hook Form** + **Zod** for validation
- **Headless UI** & **HeroIcons**

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL installed and running

### Server Setup
1. Navigate to `/server`: `cd server`
2. Install dependencies: `npm install`
3. Create `.env` file based on `.env.example`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmgr
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   JWT_SECRET=yoursecret
   FRONTEND_URL=http://localhost:3000
   ```
4. Run migration and seed: `npm run seed`
5. Start server: `npm run dev`

### Client Setup
1. Navigate to `/client`: `cd client`
2. Install dependencies: `npm install`
3. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start client: `npm run dev`

## Default Credentials (Seeded Data)
- **Admin**: `admin1@example.com` / `admin123`
- **Member**: `member1@example.com` / `member123`

## Directory Structure
- `/server/controllers`: Business logic
- `/server/routes`: API endpoints
- `/server/models`: Database schema
- `/client/src/components`: UI components
- `/client/src/hooks`: Data fetching hooks
- `/client/src/pages`: Main view pages
