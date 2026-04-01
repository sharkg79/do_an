// models/Class.js
const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  startDate: Date,
  endDate: Date,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Class", classSchema);