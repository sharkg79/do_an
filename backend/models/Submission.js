const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ✅ FILE
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: String,
  fileType: String,

  // ✅ CHẤM ĐIỂM
  score: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: "",
  },

}, { timestamps: true });

// ✅ chống nộp 2 lần
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);