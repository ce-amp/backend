const Question = require("../models/question.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");

const calculatePoints = (difficulty) => {
  const basePoints = 10;
  return basePoints * difficulty;
};

const playerController = {
  getQuestions: async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      const query = {};

      if (category) {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          return res.status(404).json({ message: "Category not found" });
        }
      }

      if (difficulty) query.difficulty = parseInt(difficulty);

      const questions = await Question.find(query)
        .populate("category", "name")
        .select("-correctAnswer");

      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRandomQuestion: async (req, res) => {
    try {
      const answeredQuestions = await User.findById(req.user.userId).select(
        "answeredQuestions.question"
      );

      const answeredIds = answeredQuestions.answeredQuestions.map(
        (aq) => aq.question
      );

      const questions = await Question.find({
        _id: { $nin: answeredIds },
      }).select("-correctAnswer");

      if (questions.length === 0) {
        return res.status(404).json({ message: "No more questions available" });
      }

      const randomIndex = Math.floor(Math.random() * questions.length);
      res.json(questions[randomIndex]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  submitAnswer: async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Check if already answered
      const hasAnswered = await User.findOne({
        _id: req.user.userId,
        "answeredQuestions.question": question._id,
      });

      if (hasAnswered) {
        return res.status(400).json({ message: "Question already answered" });
      }

      const isCorrect = question.correctAnswer === req.body.answer;
      const points = isCorrect ? calculatePoints(question.difficulty) : 0;

      await User.findByIdAndUpdate(req.user.userId, {
        $inc: { points: points },
        $push: {
          answeredQuestions: {
            question: question._id,
            wasCorrect: isCorrect,
          },
        },
      });

      res.json({
        correct: isCorrect,
        pointsEarned: points,
        feedback: isCorrect ? "Correct answer!" : "Wrong answer.",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      const leaderboard = await User.find({ role: "player" })
        .sort("-points")
        .limit(10)
        .select("username points");
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  followDesigner: async (req, res) => {
    try {
      const designer = await User.findById(req.params.id);
      if (!designer || designer.role !== "designer") {
        return res.status(404).json({ message: "Designer not found" });
      }

      // Add designer to user's following list
      await User.findByIdAndUpdate(req.user.userId, {
        $addToSet: { following: designer._id },
      });

      // Add user to designer's followers list
      await User.findByIdAndUpdate(designer._id, {
        $addToSet: { followers: req.user.userId },
      });

      res.json({ message: "Designer followed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  followPlayer: async (req, res) => {
    try {
      const playerToFollow = await User.findById(req.params.id);
      if (!playerToFollow || playerToFollow.role !== "player") {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json({ message: "Player followed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = playerController;
