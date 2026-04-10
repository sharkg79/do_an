const Course = require("../models/Course");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const mongoose = require("mongoose");

// ================= CREATE =================
async function createCourse(req, res) {
  try {
    const { title, description, category, level, price, image } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const course = new Course({
      title,
      description,
      category: category?.toLowerCase() || "beginner",
      level: level || "Beginner",
      price: price || 0,
      image: image || "https://picsum.photos/300/200",
      instructor: req.user._id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("❌ CREATE COURSE:", err);
    res.status(500).json({ error: err.message });
  }
}

// ================= GET ALL =================
async function getCourses(req, res) {
  try {
    const { category } = req.query;
    const filter = category ? { category: category.toLowerCase() } : {};

    const courses = await Course.find(filter).populate(
      "instructor",
      "name email role"
    );

    res.json(courses);
  } catch (error) {
    console.error("❌ GET COURSES:", error);
    res.status(500).json({ error: error.message });
  }
}

// ================= GET BY ID (FIX CHÍNH) =================
async function getCourseById(req, res) {
  try {
    const { id } = req.params;

    // ✅ FIX 1: validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const course = await Course.findById(id).populate(
      "instructor",
      "name email role"
    );

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const classes = await Class.find({ course: course._id }).populate(
      "instructor",
      "name email"
    );

    let enrolledClass = null;

    // ✅ FIX 2: tránh crash khi chưa login
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
        isPaid: true,
      }).lean();

      if (enrollment) {
        enrolledClass = enrollment.class;
      }
    }

    res.json({
      course,
      classes,
      enrolledClass,
    });
  } catch (err) {
  console.error("🔥 ERROR getCourseById FULL:", err);
  res.status(500).json({
    error: err.message,
    stack: err.stack, // 👈 thêm dòng này
  });
}
}

// ================= UPDATE =================
async function updateCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (
      req.user.role === "INSTRUCTOR" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this course" });
    }

    const { title, description, category, level, price, image, rating } =
      req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category.toLowerCase();
    if (level) course.level = level;
    if (price !== undefined) course.price = price;
    if (image) course.image = image;
    if (rating !== undefined) course.rating = rating;

    await course.save();
    res.json(course);
  } catch (err) {
    console.error("❌ UPDATE COURSE:", err);
    res.status(500).json({ error: err.message });
  }
}

// ================= DELETE =================
async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (
      req.user.role === "INSTRUCTOR" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE COURSE:", err);
    res.status(500).json({ error: err.message });
  }
}

// ================= INSTRUCTOR FULL =================
const getInstructorCoursesFull = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId }).lean();
    const courseIds = courses.map((c) => c._id);

    const classes = await Class.find({ course: { $in: courseIds } })
      .populate("lessons students tests")
      .populate({
        path: "assignments",
        populate: {
          path: "submissions",
        },
      })
      .lean();

    const courseMap = {};

    courses.forEach((c) => {
      courseMap[c._id] = { ...c, classes: [] };
    });

    classes.forEach((cls) => {
      const courseId = cls.course.toString();
      if (courseMap[courseId]) {
        courseMap[courseId].classes.push(cls);
      }
    });

    res.json(Object.values(courseMap));
  } catch (error) {
    console.error("❌ INSTRUCTOR FULL:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCoursesFull,
};