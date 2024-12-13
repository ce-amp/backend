const Question = require("../models/question.model");
const Category = require("../models/category.model");

const designerController = {
  // Questions
  getQuestions: async (req, res) => {
    try {
      const questions = await Question.find({ creator: req.user.userId })
        .populate("category", "name")
        .select("-correctAnswer");
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const {
        text,
        options,
        correctAnswer,
        categoryId,
        difficulty,
        relatedQuestions,
      } = req.body;

      const question = new Question({
        text,
        options,
        correctAnswer,
        category: categoryId,
        difficulty,
        creator: req.user.userId,
        relatedQuestions,
      });

      await question.save();
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getQuestion: async (req, res) => {
    try {
      const question = await Question.findOne({
        _id: req.params.id,
        creator: req.user.userId,
      }).populate("category");

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const question = await Question.findOneAndUpdate(
        { _id: req.params.id, creator: req.user.userId },
        req.body,
        { new: true }
      );

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const question = await Question.findOneAndDelete({
        _id: req.params.id,
        creator: req.user.userId,
      });

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json({ message: "Question deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Categories
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({ creator: req.user.userId });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const category = new Category({
        name: req.body.name,
        creator: req.user.userId,
      });

      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: req.params.id, creator: req.user.userId },
        { name: req.body.name },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findOneAndDelete({
        _id: req.params.id,
        creator: req.user.userId,
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = designerController;
