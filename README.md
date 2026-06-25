# Project 3: Database Integration
**DecodeLabs Industrial Training Kit — Batch 2026**

---

## What This Project Does
Connects the Express API (Project 2) to a **MongoDB cloud database** using Mongoose. Data is now permanently saved — it won't disappear on server restart.

---

## Tech Stack
- **Node.js + Express** — Backend server
- **MongoDB Atlas** — Cloud database
- **Mongoose** — ORM to connect and query DB
- **dotenv** — Manage secret config

---

## Project Structure
```
user-registration-api/
├── models/
│   └── User.js       ← Database schema
├── server_p3.js      ← Main server
├── .env              ← MongoDB URI (secret)
└── package.json
```

---

## How to Run
```bash
cd user-registration-api
npm install mongoose dotenv
node server_p3.js
```
Expected output:
```
✅ Server running at http://localhost:3000
✅ MongoDB Connected Successfully!
```

---

## API Endpoints

| Method | Endpoint     | Description       |
|--------|--------------|-------------------|
| GET    | /users       | Get all users     |
| GET    | /users/:id   | Get one user      |
| POST   | /users       | Create a user     |
| PUT    | /users/:id   | Update a user     |
| DELETE | /users/:id   | Delete a user     |

---

## Database Schema (User)
```
name       → String, required
email      → String, required, unique
age        → Number, required, 1–120
role       → String, default: "user"
createdAt  → Auto timestamp
```

---

## Requirements Completed
- [x] Designed a database schema
- [x] Performed CRUD operations (Create, Read, Update, Delete)
- [x] Proper data handling and validation
