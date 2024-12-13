const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Routes
app.post("/api/auth/register", (req, res) => {
  res.json({ message: "Register route" });
});

app.post("/api/auth/login", (req, res) => {
  res.json({ message: "Login route" });
});

// Designer Routes
// Questions
app.get("/api/designer/questions", (req, res) => {
  res.json({ message: "Get all designer questions" });
});

app.post("/api/designer/questions", (req, res) => {
  res.json({ message: "Create new question" });
});

app.get("/api/designer/questions/:id", (req, res) => {
  res.json({ message: "Get specific question" });
});

app.put("/api/designer/questions/:id", (req, res) => {
  res.json({ message: "Update question" });
});

app.delete("/api/designer/questions/:id", (req, res) => {
  res.json({ message: "Delete question" });
});

// Categories
app.get("/api/designer/categories", (req, res) => {
  res.json({ message: "Get all categories" });
});

app.post("/api/designer/categories", (req, res) => {
  res.json({ message: "Create new category" });
});

app.put("/api/designer/categories/:id", (req, res) => {
  res.json({ message: "Update category" });
});

app.delete("/api/designer/categories/:id", (req, res) => {
  res.json({ message: "Delete category" });
});

// Related Questions
app.get("/api/designer/questions/:id/related", (req, res) => {
  res.json({ message: "Get related questions" });
});

app.post("/api/designer/questions/:id/related", (req, res) => {
  res.json({ message: "Add related questions" });
});

// Player Routes
app.get("/api/player/questions", (req, res) => {
  res.json({ message: "Get questions for player" });
});

app.get("/api/player/questions/random", (req, res) => {
  res.json({ message: "Get random question" });
});

app.post("/api/player/questions/:id/answer", (req, res) => {
  res.json({ message: "Submit answer" });
});

// Following System
app.post("/api/player/follow/designer/:id", (req, res) => {
  res.json({ message: "Follow designer" });
});

app.post("/api/player/follow/player/:id", (req, res) => {
  res.json({ message: "Follow player" });
});

app.delete("/api/player/follow/designer/:id", (req, res) => {
  res.json({ message: "Unfollow designer" });
});

app.delete("/api/player/follow/player/:id", (req, res) => {
  res.json({ message: "Unfollow player" });
});

// Leaderboard
app.get("/api/player/leaderboard", (req, res) => {
  res.json({ message: "Get leaderboard" });
});

// User Profile Routes
app.get("/api/users/profile", (req, res) => {
  res.json({ message: "Get own profile" });
});

app.put("/api/users/profile", (req, res) => {
  res.json({ message: "Update profile" });
});

app.get("/api/users/:id", (req, res) => {
  res.json({ message: "Get other user's profile" });
});

app.get("/api/users/following", (req, res) => {
  res.json({ message: "Get following list" });
});

app.get("/api/users/followers", (req, res) => {
  res.json({ message: "Get followers list" });
});

// 404 Route
app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
