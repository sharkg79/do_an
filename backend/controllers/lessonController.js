const mongoose = require("mongoose");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// ================= CREATE =================
const createLesson = async (req, res) => {
  try {
    const { title, description, course, contentType } = req.body;

    if (!title || !course) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const courseExist = await Course.findById(course);

    if (!courseExist) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Instructor chỉ được tạo lesson cho course của mình
    if (
      req.user.role === "INSTRUCTOR" &&
      courseExist.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your course" });
    }

    const lesson = new Lesson({
      title,
      description,
      course,
      instructor: req.user._id,
      contentType,
      contentUrl: req.body.contentUrl // từ middleware upload
    });

    await lesson.save();

    res.status(201).json({
      message: "Lesson created successfully",
      lesson
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY COURSE =================
const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const lessons = await Lesson.find({ course: courseId })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Lessons fetched successfully",
      lessons
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // check quyền
    if (
      req.user.role === "INSTRUCTOR" &&
      lesson.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your lesson" });
    }

    // chỉ cho update field an toàn
    const allowedFields = ["title", "description", "contentType", "contentUrl"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updated = await Lesson.findByIdAndUpdate(
      lessonId,
      updateData,
      { new: true }
    );

    res.json({
      message: "Lesson updated successfully",
      lesson: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (
      req.user.role === "INSTRUCTOR" &&
      lesson.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your lesson" });
    }

    await lesson.deleteOne();

    res.json({ message: "Lesson deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson
};