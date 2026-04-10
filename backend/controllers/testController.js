const mongoose = require("mongoose");
const Test = require("../models/Test");
const Class = require("../models/Class");

// nếu bạn có model này
const TestSubmission = require("../models/TestSubmission");

// dùng để auto certificate
const { createCertificateIfEligible } = require("./certificateController");

// ================= CREATE =================
const createTest = async (req, res) => {
  try {
    const { title, classId, questions, dueDate } = req.body;

    if (!title || !classId) {
      return res.status(400).json({
        message: "Title and classId are required",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // ✅ instructor phải thuộc class
    if (
      req.user.role === "INSTRUCTOR" &&
      !classData.instructor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Not your class" });
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

    let filter = {};

    if (req.user.role === "INSTRUCTOR") {
      filter.instructor = req.user._id;
    }

    if (classId) {
      filter.class = classId;
    }

    const tests = await Test.find(filter)
      .populate("instructor", "name email")
      .populate("class", "name")
      .sort({ createdAt: -1 });

    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
const updateTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ quyền
    if (
      req.user.role !== "ADMIN" &&
      test.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
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

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      req.user.role !== "ADMIN" &&
      test.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
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
    // answers: [{ questionId, selectedOption }]

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // deadline
    if (test.dueDate && new Date() > test.dueDate) {
      return res.status(400).json({ message: "Deadline passed" });
    }

    // check class
    const classData = await Class.findById(test.class);
    const isStudent = classData.students.includes(req.user._id);

    if (!isStudent) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    // check đã làm chưa
    const existed = await TestSubmission.findOne({
      test: testId,
      student: req.user._id,
    });

    if (existed) {
      return res.status(400).json({ message: "Already submitted" });
    }

    // ================= AUTO GRADE =================
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
      classId: test.class, // ✅ QUAN TRỌNG
      student: req.user._id,
      answers,
      score,
      totalQuestions: test.questions.length,
    });

    // ================= AUTO CERTIFICATE =================
    const { createCertificateIfEligible } = require("./certificateController");

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

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      req.user.role !== "ADMIN" &&
      !test.instructor.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
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