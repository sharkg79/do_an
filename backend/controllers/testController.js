const mongoose = require("mongoose");
const Test = require("../models/Test");
const TestSubmission = require("../models/TestSubmission");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ================= CREATE =================
const createTest = async (req, res) => {
  try {
    const { title, course,class: classId, questions, totalMarks, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const courseExist = await Course.findById(course);

    if (!courseExist) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check quyền instructor
    if (
      req.user.role === "INSTRUCTOR" &&
      courseExist.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your course" });
    }

    const test = await Test.create({
      title,
      course,
      instructor: req.user._id,
      class: classId,
      questions,
      totalMarks,
      dueDate
    });

    res.status(201).json(test);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ================= UPDATE =================
const updateTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // check quyền
    if (
      req.user.role === "INSTRUCTOR" &&
      test.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your test" });
    }

    // chỉ cho update field an toàn
    const allowedFields = ["title", "questions", "totalMarks", "dueDate"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updated = await Test.findByIdAndUpdate(
      testId,
      updateData,
      { new: true }
    );

    res.json({
      message: "Test updated successfully",
      test: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= DELETE =================
const deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // check quyền
    if (
      req.user.role === "INSTRUCTOR" &&
      test.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your test" });
    }

    // ❗ xóa submission liên quan
    await TestSubmission.deleteMany({ test: testId });

    await test.deleteOne();

    res.json({ message: "Test deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= GET =================
const getTestsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const tests = await Test.find({ course: courseId })
      .populate("instructor", "name email");

    res.json(tests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SUBMIT =================
const submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // check enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: test.course,
      isPaid: true
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    // check deadline
    if (test.dueDate && new Date() > test.dueDate) {
      return res.status(400).json({ message: "Deadline passed" });
    }

    // chống submit lại
    const existed = await TestSubmission.findOne({
      test: testId,
      student: studentId
    });

    if (existed) {
      return res.status(400).json({ message: "Already submitted" });
    }

    // ===== CHẤM ĐIỂM CHUẨN =====
    let correct = 0;

    answers.forEach((ans) => {
      const question = test.questions.id(ans.questionId);

      if (question && ans.selectedOption === question.correctOption) {
        correct++;
      }
    });

    const score = (correct / test.questions.length) * test.totalMarks;

    const submission = await TestSubmission.create({
      test: testId,
      student: studentId,
      answers,
      score
    });

    res.json({
      message: "Submitted",
      score,
      submission
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already submitted" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SUBMISSIONS =================
const getSubmissions = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // check quyền
    if (
      req.user.role === "INSTRUCTOR" &&
      test.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your test" });
    }

    const submissions = await TestSubmission.find({ test: testId })
      .populate("student", "name email");

    res.json(submissions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ================= GET BY ID =================
const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ================= DELETE SUBMISSION =================
const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await TestSubmission.findById(id).populate("test");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // check quyền instructor
    if (
      req.user.role === "INSTRUCTOR" &&
      submission.test.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your test" });
    }

    await submission.deleteOne();

    res.json({ message: "Submission deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllTests = async (req, res) => {
  try {
    let tests;

    if (req.user.role === "INSTRUCTOR") {
      tests = await Test.find({ instructor: req.user._id })
        .populate("course", "title")
        .populate("class", "name");
    } else {
      // ADMIN
      tests = await Test.find()
        .populate("course", "title")
        .populate("class", "name")
        .populate("instructor", "name");
    }

    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTest,
  updateTest,
  deleteTest,
  getTestsByCourse,
  submitTest,
  getSubmissions,
  getTestById,
  deleteSubmission,
  getAllTests
};