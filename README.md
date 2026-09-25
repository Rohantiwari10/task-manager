# 🚀 TaskFlow

> A full-stack task management application for organizing tasks, tracking progress, and staying productive.

<p align="center">
  <a href="https://rohan-taskflow.vercel.app"><strong>🌐 Live Demo</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Rohantiwari10/task-manager"><strong>💻 GitHub</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-REST%20API-000000?logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000" alt="JWT">
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=white" alt="Render">
</p>

---

## 📋 Overview

**TaskFlow** is a responsive full-stack task management application built with React, Node.js, Express.js, and MySQL.

The application allows users to create an account, securely log in, manage personal tasks, organize tasks by priority and due date, track completion, and use a temporary guest account.

The project follows a simple client-server architecture:

```text
React Frontend
      │
      │ Axios / REST API
      ▼
Express.js + Node.js
      │
      │ SQL Queries
      ▼
MySQL Database
```

---

## 🌐 Live Demo

### 👉 [Open TaskFlow](https://rohan-taskflow.vercel.app)

The application is deployed using:

| Part | Platform |
|---|---|
| 🎨 Frontend | Vercel |
| ⚙️ Backend | Render |
| 🗄️ Database | Aiven MySQL |

---

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Protected frontend routes

### 📝 Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- View individual tasks
- Task descriptions
- Task priorities: **Low / Medium / High**
- Optional due dates
- Task sorting

### 👤 User Experience
- User profile page
- User-specific task data
- Temporary guest login
- Light/Dark mode
- Responsive dashboard
- Mobile-friendly navigation

### 🔒 Security & Data Isolation
- JWT verification middleware
- Passwords stored as hashes rather than plain text
- Parameterized SQL queries
- Tasks associated with their owning user
- Protected task operations using authenticated user identity

---

## 🖥️ Application Flow

```text
                    ┌─────────────────────┐
                    │      TaskFlow       │
                    │    React + Vite     │
                    └──────────┬──────────┘
                               │
                            Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express REST API  │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
                     JWT Authentication
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MySQL Database   │
                    │       Aiven         │
                    └─────────────────────┘

          Frontend → Vercel
          Backend  → Render
          Database → Aiven
```

---

## 🔑 Authentication Flow

```text
Register
   ↓
Password hashed with bcrypt
   ↓
User stored in MySQL
   ↓
Login
   ↓
Password verification
   ↓
JWT generated
   ↓
JWT stored by frontend
   ↓
Axios sends JWT with protected requests
   ↓
Express middleware verifies JWT
   ↓
Authenticated user accesses protected resources
```

Protected requests use:

```http
Authorization: Bearer <JWT>
```

---

## 👻 Guest Mode

TaskFlow also provides a **Continue as Guest** option.

Each guest session receives a separate temporary user account, allowing guest tasks to remain isolated from other users.

Guest accounts include an expiration time and can be cleaned up from the database after expiry.

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React
- ⚡ Vite
- 🧭 React Router
- 📡 Axios
- 🎨 CSS

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔑 JSON Web Token (JWT)
- 🔐 bcryptjs
- 🌐 CORS
- 📦 dotenv

### Database

- 🐬 MySQL
- 🔌 mysql2
- 🔗 Foreign Keys
- 🔒 Parameterized SQL Queries

### Tools & Deployment

- 🐙 Git & GitHub
- 📮 Postman
- ▲ Vercel
- 🚀 Render
- ☁️ Aiven

---

## 📁 Project Structure

```text
task-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── certs/
│   │   └── ca.pem
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env.development
│
└── README.md
```

> 🔒 Environment files and sensitive credentials are excluded from Git using `.gitignore`.

---

## 🔌 REST API

### Authentication Endpoints

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate a user and return a JWT |
| `GET` | `/api/auth/me` | Get the currently authenticated user |
| `POST` | `/api/auth/guest` | Create a temporary guest session |

### Task Endpoints

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/api/tasks` | Get the authenticated user's tasks |
| `GET` | `/api/tasks/:id` | Get a specific task |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## 🗄️ Database Design

### Users Table

```text
users
├── id
├── name
├── email
├── password
├── is_guest
├── expires_at
└── created_at
```

### Tasks Table

```text
tasks
├── id
├── title
├── description
├── status
├── priority
├── due_date
├── user_id
└── created_at
```

Relationship:

```text
users
  │
  │ 1
  │
  │
  │ N
  ▼
tasks
```

Each task belongs to one user through `user_id`.

The database uses a foreign key relationship with `ON DELETE CASCADE`, so deleting a user also removes the tasks belonging to that user.

---

## 💻 Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Rohantiwari10/task-manager.git
cd task-manager
```

### 2️⃣ Install backend dependencies

```bash
cd backend
npm install
```

Create a `backend/.env` file containing your database configuration and JWT secret.

### 3️⃣ Start the backend

```bash
npm run dev
```

### 4️⃣ Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 5️⃣ Configure the frontend

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6️⃣ Start the frontend

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

---

## 🔧 Environment Variables

### Backend

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_SSL_CA=
JWT_SECRET=
```

### Frontend

```env
VITE_API_URL=
```

> ⚠️ Never commit database passwords, JWT secrets, private certificates, or other sensitive credentials.

---

## ☁️ Deployment

TaskFlow uses separate services for the frontend, backend, and database:

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │     Vercel      │
              │ React Frontend  │
              └────────┬────────┘
                       │
                       │ HTTPS API Requests
                       ▼
              ┌─────────────────┐
              │     Render      │
              │ Node/Express API│
              └────────┬────────┘
                       │
                       │ SSL / MySQL
                       ▼
              ┌─────────────────┐
              │      Aiven      │
              │   MySQL DB      │
              └─────────────────┘
```

---

## 📱 Responsive Design

TaskFlow is designed to work across:

- 🖥️ Desktop
- 💻 Laptop
- 📱 Mobile

The dashboard includes responsive navigation and a mobile-friendly task management experience.

---

## 🔮 Future Improvements

Possible future enhancements include:

- 🔔 Task reminders and notifications
- 🔎 Advanced task search and filtering
- 📊 Productivity statistics
- 🏷️ Custom task labels
- 📎 File attachments
- 📅 Calendar-based task management
- 🔄 Recurring tasks

---

## 👨‍💻 Author

### Rohan Tiwari

- 💻 GitHub: [Rohantiwari10](https://github.com/Rohantiwari10)
- 🌐 Portfolio: [dev.rohantiwari.netlify.app](https://dev.rohantiwari.netlify.app)
- 🚀 Project: [TaskFlow](https://rohan-taskflow.vercel.app)

---

<p align="center">
  Made with ❤️ using React, Node.js, Express.js and MySQL
</p>
