// routes/courses.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/role"); // function authorize(roles)

// Controller
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCoursesFull,
} = require("../controllers/courseController");

// ---------------- PUBLIC ROUTES ----------------
// Lấy tất cả courses, hỗ trợ query ?category=
router.get("/", getCourses);

// Lấy course theo ID
router.get("/:id", getCourseById);

// ---------------- AUTH ROUTES ----------------
// CREATE COURSE (ADMIN hoặc INSTRUCTOR)
router.post("/", auth, authorize(["ADMIN", "INSTRUCTOR"]), createCourse);

// UPDATE COURSE (ADMIN hoặc INSTRUCTOR)
router.put("/:id", auth, authorize(["ADMIN", "INSTRUCTOR"]), updateCourse);

// DELETE COURSE (ADMIN hoặc INSTRUCTOR)
router.delete("/:id", auth, authorize(["ADMIN", "INSTRUCTOR"]), deleteCourse);

router.get(
  "/instructor/full",
  auth,
  authorize(["INSTRUCTOR"]),
  getInstructorCoursesFull
);
module.exports = router;