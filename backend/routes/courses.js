const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/role");

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCoursesFull,
} = require("../controllers/courseController");

// ✅ FIX: route cụ thể phải đặt TRƯỚC
router.get(
  "/instructor/full",
  auth,
  authorize(["INSTRUCTOR"]),
  getInstructorCoursesFull
);

// PUBLIC
router.get("/", getCourses);
router.get("/:id", getCourseById);

// PROTECTED
router.post("/", auth, authorize(["ADMIN", "INSTRUCTOR"]), createCourse);
router.put("/:id", auth, authorize(["ADMIN", "INSTRUCTOR"]), updateCourse);
router.delete("/:id", auth, authorize(["ADMIN", "INSTRUCTOR"]), deleteCourse);

module.exports = router;