const mongoose = require("mongoose");
const Lesson = require("../models/Lesson");
const Class = require("../models/Class");

// ================= HELPER =================
const canModifyLesson = (user, lesson) => {
  if (user.role === "ADMIN") return true;
  if (user.role === "INSTRUCTOR") {
    return lesson.instructor.toString() === user._id.toString();
  }
  return false;
};

// ================= CREATE =================
const createLesson = async (req, res) => {
  try {
    const { title, description, class: classId, contentType, contentUrl } = req.body;

    if (!title || !classId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classExist = await Class.findById(classId);

    if (!classExist) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Instructor chỉ được tạo lesson cho class của mình
    if (
      req.user.role === "INSTRUCTOR" &&
      classExist.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your class" });
    }

    const lesson = new Lesson({
      title,
      description,
      class: classId,
      instructor: req.user._id,
      contentType,
      contentUrl,
    });

    await lesson.save();

    res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY CLASS =================
const getLessonsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const lessons = await Lesson.find({ class: classId })
      .populate("instructor", "name email")
      .populate("class", "title")
      .sort({ createdAt: -1 });

    res.json({
      message: "Lessons fetched successfully",
      lessons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL =================
const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate("instructor", "name email")
      .populate("class", "title")
      .sort({ createdAt: -1 });

    res.json({
      message: "Lessons fetched successfully",
      lessons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY ID =================
const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    const lesson = await Lesson.findById(lessonId)
      .populate("instructor", "name email")
      .populate("class", "title");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({
      message: "Lesson fetched successfully",
      lesson,
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

    if (!canModifyLesson(req.user, lesson)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const allowedFields = ["title", "description", "contentType", "contentUrl"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updated = await Lesson.findByIdAndUpdate(lessonId, updateData, {
      new: true,
    });

    res.json({
      message: "Lesson updated successfully",
      lesson: updated,
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

    if (!canModifyLesson(req.user, lesson)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    await lesson.deleteOne();

    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLessons,
  createLesson,
  getLessonsByClass,
  updateLesson,
  deleteLesson,
  getLessonById,
};