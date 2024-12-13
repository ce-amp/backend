const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/quiz_app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Array to store questions
const questions = [];

// Topics for question generation
const topics = [
  "JavaScript",
  "Python",
  "HTML",
  "CSS",
  "React",
  "Node.js",
  "Database",
  "Git",
  "Docker",
  "APIs",
  "Security",
  "Networks",
];

// Generate 100 questions
for (let i = 0; i < 100; i++) {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const difficulty = Math.floor(Math.random() * 4) + 1;

  questions.push({
    text: `Question about ${topic} #${i + 1}`,
    options: [
      `Option 1 for ${topic}`,
      `Option 2 for ${topic}`,
      `Option 3 for ${topic}`,
      `Option 4 for ${topic}`,
    ],
    correctAnswer: Math.floor(Math.random() * 4),
    difficulty: difficulty,
    creator: new ObjectId("675bf22fa9b675e038789f27"),
    relatedQuestions: [],
    createdAt: new Date(),
  });
}

// Create Question model
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  relatedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);

// Insert questions into MongoDB
Question.insertMany(questions)
  .then(() => {
    console.log("100 questions inserted successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error inserting questions:", error);
    mongoose.connection.close();
  });
