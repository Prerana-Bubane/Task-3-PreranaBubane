const express = require("express");
const app = express();
const PORT = 3000;

// ✅ Middleware: Parse incoming JSON requests
app.use(express.json());

// ─────────────────────────────────────────
// 📦 In-memory "database" (array of users)
// ─────────────────────────────────────────
let users = [
  { id: 1, name: "Alice",   email: "alice@example.com",   age: 25, role: "admin" },
  { id: 2, name: "Bob",     email: "bob@example.com",     age: 30, role: "user"  },
  { id: 3, name: "Charlie", email: "charlie@example.com", age: 22, role: "user"  },
];
let nextId = 4;

// ─────────────────────────────────────────
// 🔧 HELPER: Validation function
// ─────────────────────────────────────────
function validateUser(data) {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("'name' is required and must be a non-empty string.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("'email' is required and must be a valid email address.");
  }

  if (data.age === undefined || typeof data.age !== "number" || data.age < 1 || data.age > 120) {
    errors.push("'age' is required and must be a number between 1 and 120.");
  }

  const validRoles = ["admin", "user", "moderator"];
  if (data.role && !validRoles.includes(data.role)) {
    errors.push(`'role' must be one of: ${validRoles.join(", ")}.`);
  }

  return errors;
}

// ─────────────────────────────────────────
// 📡 ROUTES
// ─────────────────────────────────────────

// GET /  →  Welcome + route map
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Welcome to the User Registration API!",
    version: "1.0.0",
    endpoints: {
      "GET    /users":      "Get all users",
      "GET    /users/:id":  "Get a single user by ID",
      "POST   /users":      "Register a new user",
      "PUT    /users/:id":  "Update an existing user",
      "DELETE /users/:id":  "Delete a user",
    },
  });
});

// GET /users
app.get("/users", (req, res) => {
  res.status(200).json({ success: true, count: users.length, data: users });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: `User with ID ${id} not found.` });
  }
  res.status(200).json({ success: true, data: user });
});

// POST /users
app.post("/users", (req, res) => {
  const { name, email, age, role = "user" } = req.body;

  const errors = validateUser({ name, email, age, role });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }

  const duplicate = users.find((u) => u.email === email);
  if (duplicate) {
    return res.status(400).json({ success: false, message: `Email '${email}' is already registered.` });
  }

  const newUser = { id: nextId++, name: name.trim(), email: email.toLowerCase(), age, role };
  users.push(newUser);

  res.status(201).json({ success: true, message: "User registered successfully!", data: newUser });
});

// PUT /users/:id
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: `User with ID ${id} not found.` });
  }

  const { name, email, age, role } = req.body;
  const updatedUser = {
    ...users[userIndex],
    name:  name  ? name.trim()         : users[userIndex].name,
    email: email ? email.toLowerCase() : users[userIndex].email,
    age:   age   !== undefined ? age   : users[userIndex].age,
    role:  role  ? role                : users[userIndex].role,
  };

  const errors = validateUser(updatedUser);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }

  users[userIndex] = updatedUser;
  res.status(200).json({ success: true, message: "User updated successfully!", data: updatedUser });
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: `User with ID ${id} not found.` });
  }
  const deleted = users.splice(userIndex, 1)[0];
  res.status(200).json({ success: true, message: `User '${deleted.name}' deleted.`, data: deleted });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.method} ${req.originalUrl}' not found.` });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});