const mongoose = require("mongoose");

// ─────────────────────────────────────────
// 📐 USER SCHEMA — The Database Blueprint
// ─────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,           // No duplicate emails
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age cannot exceed 120"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user", "moderator"],
        message: "Role must be: admin, user, or moderator",
      },
      default: "user",
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);