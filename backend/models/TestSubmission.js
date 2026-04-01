const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOption: { type: Number, required: true }
});

const testSubmissionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  answers: [answerSchema],

  score: { type: Number, default: 0 }

}, { timestamps: true });

// ❗ chống nộp nhiều lần
testSubmissionSchema.index({ test: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("TestSubmission", testSubmissionSchema);