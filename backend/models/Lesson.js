const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
class: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Class",
  required: true
},
  contentType: {
    type: String,
    enum: ["video", "document"],
    default: "video"
  },

  contentUrl: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lesson", lessonSchema);