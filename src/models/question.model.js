const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  relatedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);