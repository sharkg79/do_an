const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Class = require("../models/Class");

// ================= CREATE =================
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, classId } = req.body;

    // ✅ validate title
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    // ✅ FIX CHÍNH: bắt buộc classId
    if (!classId) {
      return res.status(400).json({
        message: "classId is required",
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate: dueDate || null,
      classId, // ✅ KHÔNG dùng || null nữa
      instructor: req.user._id,
    });

    res.status(201).json({
      message: "Created",
      assignment,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL / MY =================
const getAssignments = async (req, res) => {
  try {
    const { classId } = req.query;

    let filter = {};

    // ✅ ADMIN: không filter → lấy tất cả
    if (req.user.role === "ADMIN") {
      // giữ filter = {}
    }

    // ✅ INSTRUCTOR: chỉ lấy assignment của mình
    else if (req.user.role === "INSTRUCTOR") {
      filter.instructor = req.user._id;
    }

    // ❌ STUDENT: chặn luôn
    else {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ filter theo class nếu có
    if (classId) {
      filter.classId = classId;
    }

    const assignments = await Assignment.find(filter)
      .populate("instructor", "_id name email")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ================= UPDATE =================
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ CHECK QUYỀN
    if (
      req.user.role !== "ADMIN" &&
      assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowed = ["title", "description", "dueDate"];
    const updateData = {};

    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const updated = await Assignment.findByIdAndUpdate(
      assignmentId,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ ADMIN xóa tất cả | instructor chỉ xóa của mình
    if (
      req.user.role !== "ADMIN" &&
      assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Submission.deleteMany({ assignment: assignmentId });
    await assignment.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= SUBMIT =================
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can submit" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // ⚠️ nếu vẫn dùng class thì giữ, không thì bỏ đoạn này
    if (assignment.classId) {
      const classData = await Class.findById(assignment.classId);

      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }

      const isStudentInClass = classData.students.some(
        (s) => s.toString() === req.user._id.toString()
      );

      if (!isStudentInClass) {
        return res.status(403).json({ message: "Not enrolled in class" });
      }
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      contentUrl: `/uploads/${req.file.filename}`,
    });

    res.json({
      message: "Submitted",
      submission,
    });
  } catch (error) {
    console.error("SUBMIT ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Already submitted" });
    }

    res.status(500).json({ message: error.message });
  }
};

// ================= GRADE =================
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    if (grade === undefined) {
      return res.status(400).json({ message: "Grade required" });
    }

    const submission = await Submission.findById(submissionId)
      .populate("assignment");

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ CHECK QUYỀN
    if (
      req.user.role !== "ADMIN" &&
      submission.assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    submission.grade = grade;
    submission.feedback = feedback;

    await submission.save();

    res.json({
      message: "Graded",
      submission,
    });
  } catch (error) {
    console.error("GRADE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ================= GET SUBMISSIONS BY ASSIGNMENT =================
const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("GET SUBMISSIONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createAssignment,
  getAssignments, // ✅ đổi tên API
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getSubmissionsByAssignment, // ✅ API mới
};