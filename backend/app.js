// backend/server.js
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

require("./auth"); // GitHub OAuth config

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth routes
app.use("/auth", require("./routes/auth"));

// API routes
app.get("/api/user", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ error: "Not logged in" });
  }
});

// Serve frontend (React build) if in production
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
