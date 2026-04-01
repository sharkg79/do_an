const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  paymentMethod: {
    type: String,
    enum: ["MOMO", "VNPAY", "STRIPE", "FREE"]
  },

  paymentId: String,

  paidAt: Date

}, { timestamps: true });

// ❗ chống trùng enrollment
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);