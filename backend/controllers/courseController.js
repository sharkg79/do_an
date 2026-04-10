const Course = require("../models/Course");
const Class = require("../models/Class");

// Create course
async function createCourse(req, res) {
  try {
    const { title, description, category, level, price, image } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Get all courses (support filter by category)
async function getCourses(req, res) {
  try {
    const { category } = req.query;
    const filter = category ? { category: category.toLowerCase() } : {};

    const courses = await Course.find(filter).populate(
      "instructor",
      "name email role"
    );
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Get course by ID
async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email role"
    );
    if (!course) return res.status(404).json({ error: "Course not found" });

    const classes = await Class.find({ course: course._id }).populate(
      "instructor",
      "name email"
    );
    res.json({ course, classes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Update course
async function updateCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (
      req.user.role === "INSTRUCTOR" &&
      course.instructor.toString() !== req.user._id
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Delete course
async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (
      req.user.role === "INSTRUCTOR" &&
      course.instructor.toString() !== req.user._id
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
const getInstructorCoursesFull = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // 1. Lấy courses của instructor
    const courses = await Course.find({ instructor: instructorId }).lean();
    const courseIds = courses.map(c => c._id);

    // 2. Lấy classes + populate sâu
    const classes = await Class.find({ course: { $in: courseIds } })
      .populate("lessons students tests")
      .populate({
        path: "assignments",
        populate: {
          path: "submissions"
        }
      })
      .lean();

    // 3. Map classes vào course
    const courseMap = {};

    courses.forEach(c => {
      courseMap[c._id] = { ...c, classes: [] };
    });

    classes.forEach(cls => {
      const courseId = cls.course.toString();
      if (courseMap[courseId]) {
        courseMap[courseId].classes.push(cls);
      }
    });

    res.json(Object.values(courseMap));

  } catch (error) {
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