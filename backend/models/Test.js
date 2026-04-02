const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },

  options: {
    type: [String],
    validate: [(arr) => arr.length >= 2, "At least 2 options required"]
  },

  correctOption: {
    type: Number,
    required: true,
    min: 0
  }

}, { _id: true });

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
class: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Class",
  required: true
},
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  questions: [questionSchema],

  totalMarks: { type: Number, default: 100 },

  dueDate: Date

}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);