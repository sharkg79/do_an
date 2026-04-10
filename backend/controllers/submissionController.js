const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");

// ================= GET ALL / FILTER =================
const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.query;

    let filter = {};

    // ✅ filter theo assignment nếu có
    if (assignmentId) {
      filter.assignment = assignmentId;
    }

    // ✅ instructor chỉ thấy submission của assignment mình
    if (req.user.role === "INSTRUCTOR") {
      const assignments = await Assignment.find({
        instructor: req.user._id,
      }).select("_id");

      const assignmentIds = assignments.map((a) => a._id);

      filter.assignment = { $in: assignmentIds };
    }

    const submissions = await Submission.find(filter)
      .populate("student", "name email")
      .populate("assignment", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("GET SUBMISSIONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY ASSIGNMENT =================
const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // ✅ check quyền
    if (
      req.user.role !== "ADMIN" &&
      !assignment.instructor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const submissions = await Submission.find({
      assignment: assignmentId,
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("GET BY ASSIGNMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GRADE =================
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback } = req.body;

    if (score === undefined) {
      return res.status(400).json({ message: "Score is required" });
    }

    const submission = await Submission.findById(submissionId).populate(
      "assignment"
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // ✅ check quyền
    if (
      req.user.role !== "ADMIN" &&
      submission.assignment.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    submission.score = score;
    submission.feedback = feedback;

    await submission.save();

    res.json({
      message: "Graded successfully",
      submission,
    });
  } catch (error) {
    console.error("GRADE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const submission = await Submission.findById(submissionId).populate(
      "assignment"
    );

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ admin hoặc instructor của assignment
    if (
      req.user.role !== "ADMIN" &&
      submission.assignment.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await submission.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubmissions,
  getSubmissionsByAssignment,
  gradeSubmission,
  deleteSubmission,
};