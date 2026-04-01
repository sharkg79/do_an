const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Enrollment = require("../models/Enrollment");

// ================= SUBMIT =================
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // ✅ check enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: assignment.course,
      isPaid: true
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course"
      });
    }

    // ✅ check deadline
    if (assignment.dueDate && new Date() > assignment.dueDate) {
      return res.status(400).json({
        message: "Deadline passed"
      });
    }

    const fileData = {
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype
    };

    // upsert
    const submission = await Submission.findOneAndUpdate(
      { assignment: assignmentId, student: studentId },
      {
        ...fileData,
        score: 0,
        feedback: ""
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Submitted successfully",
      submission
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GRADE =================
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid submission ID" });
    }

    const submission = await Submission.findById(submissionId)
      .populate("assignment");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // check quyền
    if (
      req.user.role === "INSTRUCTOR" &&
      submission.assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your assignment" });
    }

    // validate score
    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Score must be 0-100" });
    }

    submission.score = score;
    submission.feedback = feedback;

    await submission.save();

    res.json({
      message: "Graded successfully",
      submission
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL =================
const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (
      req.user.role === "INSTRUCTOR" &&
      assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your assignment" });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= MY =================
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user._id
    })
      .populate("assignment", "title dueDate")
      .sort({ createdAt: -1 });

    res.json(submissions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DETAIL =================
const getSubmissionDetail = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId)
      .populate("student", "name email")
      .populate("assignment", "title instructor");

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    // student chỉ xem của mình
    if (
      req.user.role === "STUDENT" &&
      submission.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(submission);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId)
      .populate("assignment");

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      req.user.role === "INSTRUCTOR" &&
      submission.assignment.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your assignment" });
    }

    await submission.deleteOne();

    res.json({ message: "Deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAssignment,
  gradeSubmission,
  getSubmissionsByAssignment,
  getMySubmissions,
  getSubmissionDetail,
  deleteSubmission
};