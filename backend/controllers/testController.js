const mongoose = require("mongoose");
const Test = require("../models/Test");
const Class = require("../models/Class");
const TestSubmission = require("../models/TestSubmission");

const { createCertificateIfEligible } = require("./certificateController");

// ================= HELPER =================
const isAdminOrInstructor = (user) => {
  return ["ADMIN", "INSTRUCTOR"].includes(user.role);
};

// ================= CREATE =================
const createTest = async (req, res) => {
  try {
    const { title, classId, questions, dueDate } = req.body;

    if (!title || !classId) {
      return res.status(400).json({
        message: "Title and classId are required",
      });
    }

    if (!isAdminOrInstructor(req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const test = await Test.create({
      title,
      class: classId,
      instructor: req.user._id,
      questions,
      dueDate,
    });

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL =================
const getTests = async (req, res) => {
  try {
    const { classId } = req.query;

    let query = {};

    // ✅ nếu có filter class
    if (classId) {
      query.classId = classId;
    }

    // ✅ STUDENT: chỉ lấy test của lớp mình học
    if (req.user.role === "STUDENT") {
      const classes = await Class.find({
        students: req.user._id,
      }).select("_id");

      const classIds = classes.map((c) => c._id);

      query.classId = { $in: classIds };
    }

    // ✅ INSTRUCTOR: chỉ lấy test mình tạo
    if (req.user.role === "INSTRUCTOR") {
      query.instructor = req.user._id;
    }

    const tests = await Test.find(query)
      .populate("classId", "title")
      .populate("instructor", "name email");

    res.json(tests);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching tests",
      error: err.message,
    });
  }
};

// ================= UPDATE =================
const updateTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!isAdminOrInstructor(req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Not found" });
    }

    const allowed = ["title", "questions", "dueDate"];
    const updateData = {};

    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const updated = await Test.findByIdAndUpdate(testId, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    console.error("UPDATE TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!isAdminOrInstructor(req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Not found" });
    }

    await TestSubmission.deleteMany({ test: testId });
    await test.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= SUBMIT TEST =================
const submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (test.dueDate && new Date() > test.dueDate) {
      return res.status(400).json({ message: "Deadline passed" });
    }

    const classData = await Class.findById(test.class);
    const isStudent = classData.students.includes(req.user._id);

    if (!isStudent) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    const existed = await TestSubmission.findOne({
      test: testId,
      student: req.user._id,
    });

    if (existed) {
      return res.status(400).json({ message: "Already submitted" });
    }

    let correct = 0;

    test.questions.forEach((q) => {
      const ans = answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );

      if (ans && ans.selectedOption === q.correctOption) {
        correct++;
      }
    });

    const score =
      (correct / test.questions.length) * test.totalMarks;

    const submission = await TestSubmission.create({
      test: testId,
      classId: test.class,
      student: req.user._id,
      answers,
      score,
      totalQuestions: test.questions.length,
    });

    await createCertificateIfEligible({
      studentId: req.user._id,
      classId: test.class,
      finalScore: score,
    });

    res.json({
      message: "Submitted",
      score,
      correct,
      total: test.questions.length,
      submission,
    });
  } catch (error) {
    console.error("SUBMIT TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET SUBMISSIONS =================
const getTestSubmissions = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!isAdminOrInstructor(req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Not found" });
    }

    const submissions = await TestSubmission.find({ test: testId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTest,
  getTests,
  updateTest,
  deleteTest,
  submitTest,
  getTestSubmissions,
};