const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fileUrl: { type: String, required: true },
  fileName: String,
  fileType: String,

  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  feedback: {
    type: String,
    default: ""
  }

}, { timestamps: true });

// ❗ chống submit nhiều lần
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);