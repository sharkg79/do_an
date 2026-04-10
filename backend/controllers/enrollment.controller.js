const Enrollment = require("../models/Enrollment");
const mongoose = require("mongoose");
const Class = require("../models/Class");
// ================= CREATE PAYMENT =================
const createPayment = async (req, res) => {
  try {
    const { courseId, classId, paymentMethod } = req.body;

    const studentId = req.user._id;

    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (existing) {
      return res.status(400).json({
        message: "Already enrolled"
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      class: classId,
      paymentMethod,
      isPaid: false
    });

    res.json({
  enrollmentId: enrollment._id
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= CONFIRM PAYMENT =================
const confirmPayment = async (req, res) => {
  try {

    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        isPaid: true,
        paidAt: new Date()
      },
      { new: true }
    );

    // ✅ add student vào class
    await Class.findByIdAndUpdate(
      enrollment.class,
      {
        $addToSet: { students: enrollment.student }
      }
    );

    res.json(enrollment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= CHECK ENROLL =================
const checkEnrollment = async (req, res) => {
  try {

    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      isPaid: true
    });

    res.json({
      enrolled: !!enrollment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createPayment,
  confirmPayment,
  checkEnrollment
};