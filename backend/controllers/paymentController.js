const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ================= PAY COURSE =================
const payCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check đã mua chưa
    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (enrollment && enrollment.isPaid) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // nếu chưa có thì tạo
    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: studentId,
        course: courseId
      });
    }

    // FREE COURSE
    if (course.price === 0) {
      enrollment.isPaid = true;
      enrollment.paymentMethod = "FREE";
      enrollment.paidAt = new Date();
      await enrollment.save();

      return res.json({
        message: "Enroll success (free course)",
        enrollment
      });
    }

    // FAKE PAYMENT URL
    const paymentUrl = `https://fake-payment.com?enrollmentId=${enrollment._id}&amount=${course.price}`;

    res.json({
      message: "Redirect to payment",
      paymentUrl
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CONFIRM PAYMENT =================
const confirmPayment = async (req, res) => {
  try {
    const { enrollmentId, status, paymentId, method } = req.body;

    if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      return res.status(400).json({ message: "Invalid enrollment ID" });
    }

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // ❗ nếu đã paid thì không xử lý lại
    if (enrollment.isPaid) {
      return res.json({ message: "Already confirmed", enrollment });
    }

    // ❗ kiểm tra status
    if (status !== "success") {
      return res.status(400).json({ message: "Payment failed" });
    }

    // update payment
    enrollment.isPaid = true;
    enrollment.paymentId = paymentId;
    enrollment.paymentMethod = method || "VNPAY";
    enrollment.paidAt = new Date();

    await enrollment.save();

    res.json({
      message: "Payment confirmed",
      enrollment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  payCourse,
  confirmPayment
};