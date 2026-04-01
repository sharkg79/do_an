const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Test = require("../models/Test");
const TestSubmission = require("../models/TestSubmission");
const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ================= GENERATE =================
const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ❗ check enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      isPaid: true
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    // ❗ check đã có certificate chưa
    const existingCert = await Certificate.findOne({
      student: studentId,
      course: courseId
    });

    if (existingCert) {
      return res.json({
        message: "Certificate already exists",
        certificate: existingCert
      });
    }

    // ===== CHECK COMPLETION =====

    // ASSIGNMENTS
    const assignments = await Assignment.find({ course: courseId });

    const submissions = await Submission.find({
      student: studentId,
      assignment: { $in: assignments.map(a => a._id) }
    });

    if (assignments.length !== submissions.length) {
      return res.status(400).json({
        message: "Complete all assignments"
      });
    }

    // TESTS
    const tests = await Test.find({ course: courseId });

    const testSubs = await TestSubmission.find({
      student: studentId,
      test: { $in: tests.map(t => t._id) }
    });

    if (tests.length !== testSubs.length) {
      return res.status(400).json({
        message: "Complete all tests"
      });
    }

    // ===== CALCULATE SCORE =====
    const assignmentScore = submissions.reduce((sum, s) => sum + s.score, 0);
    const testScore = testSubs.reduce((sum, s) => sum + s.score, 0);

    const totalScore = assignmentScore + testScore;

    // ===== GENERATE PDF =====
    const fileName = `certificate_${studentId}_${courseId}.pdf`;
    const dirPath = path.join(__dirname, "../uploads/certificates");

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, fileName);

    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(25).text("Certificate of Completion", { align: "center" });
    doc.moveDown();

    doc.fontSize(18).text("This certifies that", { align: "center" });
    doc.fontSize(20).text(req.user.name, { align: "center", underline: true });

    doc.moveDown();
    doc.text("has completed the course", { align: "center" });
    doc.fontSize(20).text(course.title, { align: "center", underline: true });

    doc.moveDown();
    doc.text(`Score: ${totalScore}`, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

    doc.end();

    // đợi ghi file xong
    await new Promise(resolve => stream.on("finish", resolve));

    // ===== SAVE DB =====
    const cert = await Certificate.create({
      student: studentId,
      course: courseId,
      certificateUrl: `/uploads/certificates/${fileName}`,
      grade: totalScore
    });

    res.json({
      message: "Certificate generated",
      certificate: cert
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Certificate already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MY =================
const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({
      student: req.user._id
    }).populate("course", "title");

    res.json(certs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateCertificate,
  getMyCertificates
};