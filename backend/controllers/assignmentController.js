const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Course = require("../models/Course");

// ================= CREATE =================
const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check quyền instructor
    if (
      req.user.role === "INSTRUCTOR" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your course" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      instructor: req.user._id,
      dueDate
    });

    res.status(201).json({ message: "Created", assignment });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET =================
const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({ course: courseId })
      .populate("instructor", "name email")
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

    if (
      req.user.role === "INSTRUCTOR" &&
      assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your assignment" });
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

    if (
      req.user.role === "INSTRUCTOR" &&
      assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your assignment" });
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

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      contentUrl: `/uploads/${req.file.filename}`
    });

    res.json({
      message: "Submitted",
      submission
    });

  } catch (error) {
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

    const submission = await Submission.findById(submissionId)
      .populate("assignment");

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    // check quyền instructor
    if (
      req.user.role === "INSTRUCTOR" &&
      submission.assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your assignment" });
    }

    submission.grade = grade;
    submission.feedback = feedback;

    await submission.save();

    res.json({
      message: "Graded",
      submission
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission
};