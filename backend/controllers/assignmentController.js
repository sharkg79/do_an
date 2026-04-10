const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Class = require("../models/Class");

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, classId } = req.body;

    if (!title || !classId) {
      return res.status(400).json({
        message: "Title and classId are required",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // ✅ ADMIN: luôn được
    // ✅ INSTRUCTOR: phải đúng class
    if (
      req.user.role === "INSTRUCTOR" &&
      !classData.instructor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Not your class" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      classId,
      instructor: classData.instructor, // ✅ FIX: luôn gán instructor của class
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL / MY =================
const getAssignments = async (req, res) => {
  try {
    const { classId } = req.query;
    let filter = {};

    if (req.user.role === "INSTRUCTOR") {
      // ✅ lấy tất cả class của instructor
      const classes = await Class.find({
        instructor: req.user._id,
      }).select("_id");

      const classIds = classes.map((c) => c._id);

      filter.classId = { $in: classIds };
    }

    if (classId) {
      filter.classId = classId;
    }

    const assignments = await Assignment.find(filter)
      .populate("instructor", "name email")
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= UPDATE =================
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Not found" });
    }

    const classData = await Class.findById(assignment.classId);

    // ✅ ADMIN: ok
    // ✅ INSTRUCTOR: phải là chủ class
    if (
      req.user.role !== "ADMIN" &&
      !classData.instructor.equals(req.user._id)
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
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Not found" });
    }

    const classData = await Class.findById(assignment.classId);

    if (
      req.user.role !== "ADMIN" &&
      !classData.instructor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Submission.deleteMany({ assignment: assignmentId });
    await assignment.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SUBMIT =================
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ check deadline
    if (assignment.dueDate && new Date() > assignment.dueDate) {
      return res.status(400).json({ message: "Deadline passed" });
    }

    // ✅ check class
    const classData = await Class.findById(assignment.classId);

    const isStudent = classData.students.includes(req.user._id);

    if (!isStudent) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    // ✅ check đã submit chưa
    const existed = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    if (existed) {
      return res.status(400).json({ message: "Already submitted" });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      contentUrl: `/uploads/${req.file.filename}`,
    });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ chỉ instructor của assignment hoặc admin
    if (
      req.user.role !== "ADMIN" &&
      !assignment.instructor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
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