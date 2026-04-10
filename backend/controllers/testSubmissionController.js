const mongoose = require("mongoose");
const TestSubmission = require("../models/TestSubmission");
const Test = require("../models/Test");
const Class = require("../models/Class");

// ================= GET ALL / FILTER =================
const getTestSubmissions = async (req, res) => {
  try {
    const { testId } = req.query;

    let filter = {};

    // ✅ instructor
    if (req.user.role === "INSTRUCTOR") {
      const tests = await Test.find({
        instructor: req.user._id,
      }).select("_id");

      const testIds = tests.map((t) => t._id);

      filter.test = { $in: testIds };
    }

    // ✅ nếu có testId → kết hợp thêm
    if (testId) {
      filter.test = {
        ...(filter.test || {}),
        $in: filter.test?.$in
          ? filter.test.$in.filter(
              (id) => id.toString() === testId
            )
          : [testId],
      };
    }

    const submissions = await TestSubmission.find(filter)
      .populate("student", "name email")
      .populate("test", "title instructor")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("GET TEST SUBMISSIONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY TEST =================
const getTestSubmissionsByTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // ✅ check quyền
    if (
      req.user.role !== "ADMIN" &&
      !test.instructor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const submissions = await TestSubmission.find({
      test: testId,
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("GET BY TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= AUTO GRADE =================
const gradeTestSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await TestSubmission.findById(submissionId)
      .populate("test");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // ✅ check quyền
    if (
      req.user.role !== "ADMIN" &&
      submission.test.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ❗ cần populate questions trong Test
    const test = await Test.findById(submission.test._id);

    let correct = 0;

    submission.answers.forEach((ans) => {
      const question = test.questions.id(ans.questionId);

      if (question && question.correctAnswer === ans.selectedOption) {
        correct++;
      }
    });

    submission.score = correct;
    submission.totalQuestions = test.questions.length;

    await submission.save();

    res.json({
      message: "Auto graded successfully",
      submission,
    });
  } catch (error) {
    console.error("GRADE TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteTestSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const submission = await TestSubmission.findById(submissionId)
      .populate("test");

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ quyền
    if (
      req.user.role !== "ADMIN" &&
      submission.test.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await submission.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTestSubmissions,
  getTestSubmissionsByTest,
  gradeTestSubmission,
  deleteTestSubmission,
};