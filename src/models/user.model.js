const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["designer", "player"], required: true },
  points: { type: Number, default: 0 },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  answeredQuestions: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      wasCorrect: Boolean,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
