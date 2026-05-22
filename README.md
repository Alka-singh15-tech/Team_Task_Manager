# Team Task Manager (Ethara.ai Project)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.x-blue)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready, full-stack collaborative platform designed for efficient team management and task tracking. This project implements a modern architectural pattern with a clear separation between the client and server, ensuring scalability, security, and high performance.

---

## 🚀 Overview

The **Team Task Manager** is built to solve transparency and productivity challenges in team-based environments. It provides a centralized dashboard where administrators can manage projects, assign tasks to specific team members, and track real-time progress.

### Core Value Proposition:
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Members.
- **Real-time Collaboration**: Centralized project and task updating.
- **Enterprise-Grade Security**: JWT authentication and encrypted data storage.
- **Scalable Architecture**: Decoupled frontend/backend with a solid ORM-based relational database.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) for high-speed builds.
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest) for server-state synchronization.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first responsive design.
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for schema-based validation.
- **Routing**: [React Router v6](https://reactrouter.com/) for declarative client-side routing.

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) for streamlined API development.
- **Database**: [PostgreSQL](https://www.postgresql.org/) for robust relational data storage.
- **ORM**: [Sequelize](https://sequelize.org/) for intuitive model management and associations.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) for secure, stateless sessions.
- **Security**: [Helmet.js](https://helmetjs.github.io/) (headers), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (password hashing), and [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit).

---

## 📂 Project Structure

```text
Team_Task_Manager/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/           # Axios instance & API interceptors
│   │   ├── components/    # Reusable UI components (Common, Layout, Auth)
│   │   ├── context/       # Global AuthContext provider
│   │   ├── hooks/         # Custom React Query hooks (useTasks, useProjects, etc.)
│   │   ├── pages/         # Main view components (Dashboard, Tasks, Admin)
│   │   └── router.jsx     # Route definitions & ProtectedRoutes
│   └── tailwind.config.js # CSS configuration
│
├── server/                 # Node.js Backend (Express)
│   ├── config/            # Database connection logic
│   ├── controllers/      # Business logic for Auth, Tasks, Projects, Users
│   ├── middleware/       # Auth guards & Global error handling
│   ├── models/           # Sequelize schema definitions & associations
│   ├── routes/           # API endpoint definitions
│   ├── seeders/          # Database seeding scripts
│   └── server.js         # Entry point & Middleware setup
│
└── package.json            # Root configuration for workspace orchestration
```

---

## 🔄 Working Workflow

1.  **Authentication**: Users register or log in. The server validates credentials and returns a **JWT token**.
2.  **Authorization**: The client stores the token and includes it in the `Authorization` header for all private API requests.
3.  **Project Organization**: 
    - **Admins** can create projects and define project scopes.
    - **Members** can be associated with projects through a "Membership" table (Many-to-Many).
4.  **Task Lifecycle**:
    - Tasks are created within specific projects.
    - They are assigned to a user (`assigneeId`) and tracked via status (Pending, In Progress, Completed).
5.  **State Synchronization**: React Query ensures the UI is always up-to-date by handling background fetching and cache invalidation.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (Ensure the service is running)

### 2. General Setup
Clone the repository and install root dependencies:
```bash
git clone https://github.com/Alka-singh15-tech/Team_Task_Manager.git
cd Team_Task_Manager
npm run install-all
```

### 3. Backend Configuration
Navigate to `server/`, create a `.env` file, and configure your credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmgr
DB_USER=postgres
DB_PASSWORD=yourpass
JWT_SECRET=yoursecret
FRONTEND_URL=http://localhost:5173
```
Run migrations and seed the database:
```bash
npm run seed
```

### 4. Frontend Configuration
Navigate to `client/`, create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

You can start both client and server from the root directory using a single command:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🛡️ Security Implementation
- **Data Integrity**: Input validation at both client (Zod) and server (Express-Validator) levels.
- **Stateless Auth**: JWT prevents session-hijacking and allows for horizontal scaling.
- **CORS Configuration**: Restricts API access to the approved frontend origin only.
- **DDoS Prevention**: Rate limiting applied to preventing brute-force attacks on auth routes.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors
- **Alka Singh** - [GitHub Profile](https://github.com/Alka-singh15-tech)

Developed as part of the **Ethara.ai** initiative.
