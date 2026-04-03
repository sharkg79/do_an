const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 },

  // Người tạo course
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 🔹 UI fields cần có
  image: {
    type: String,
    default: "https://picsum.photos/300/200", // fallback image
  },

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },

  category: {
    type: String,
    enum: ["ielts", "toeic", "speaking", "writing", "business", "listening", "reading", "beginner"],
    default: "beginner",
  },

  rating: {
    type: Number,
    default: 0,
  },

  studentsCount: {
    type: Number,
    default: 0,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);