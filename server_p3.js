require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────
// ✅ Middleware
// ─────────────────────────────────────────
app.use(express.json());

// ─────────────────────────────────────────
// 🔌 Connect to MongoDB
// ─────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

// ─────────────────────────────────────────
// 📡 ROUTES
// ─────────────────────────────────────────

// GET /  →  Welcome
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Welcome to the User Registration API — Project 3!",
    database: mongoose.connection.readyState === 1 ? "✅ MongoDB Connected" : "❌ Not Connected",
    version: "2.0.0",
    endpoints: {
      "GET    /users":      "Get all users from DB",
      "GET    /users/:id":  "Get one user by ID",
      "POST   /users":      "Create & save user to DB",
      "PUT    /users/:id":  "Update user in DB",
      "DELETE /users/:id":  "Delete user from DB",
    },
  });
});

// ─────────────────────────────────────────
// READ — GET /users  →  All users from DB
// ─────────────────────────────────────────
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // SELECT * FROM users
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// READ — GET /users/:id  →  One user
// ─────────────────────────────────────────
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // SELECT * FROM users WHERE id = ?
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid ID format", error: err.message });
  }
});

// ─────────────────────────────────────────
// CREATE — POST /users  →  Save to DB
// ─────────────────────────────────────────
app.post("/users", async (req, res) => {
  try {
    const { name, email, age, role } = req.body;

    // Create new user document (INSERT INTO users ...)
    const newUser = await User.create({ name, email, age, role });

    res.status(201).json({
      success: true,
      message: "User created and saved to database!",
      data: newUser,
    });
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Email '${req.body.email}' is already registered.`,
      });
    }
    // Handle validation errors from schema
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// UPDATE — PUT /users/:id  →  Update in DB
// ─────────────────────────────────────────
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Return the updated document
        runValidators: true, // Re-run schema validation on update
      }
    ); // UPDATE users SET ... WHERE id = ?

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated in database!",
      data: user,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE — DELETE /users/:id  →  Remove from DB
// ─────────────────────────────────────────
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // DELETE FROM users WHERE id = ?

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User '${user.name}' deleted from database!`,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.method} ${req.originalUrl}' not found.` });
});

// ─────────────────────────────────────────
// 🚀 Start Server
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});