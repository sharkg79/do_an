// routes/courses.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/role"); // import trực tiếp function

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");
// PUBLIC ROUTES
router.get("/", getCourses);
router.get("/:id", getCourseById);


//AUTH
// CREATE COURSE (ADMIN hoặc INSTRUCTOR)
router.post("/", auth, authorize(["ADMIN","INSTRUCTOR"]), createCourse);

// UPDATE COURSE (ADMIN hoặc INSTRUCTOR)
router.put("/:id", auth, authorize(["ADMIN","INSTRUCTOR"]), updateCourse);

// DELETE COURSE (ADMIN hoặc INSTRUCTOR)
router.delete("/:id", auth, authorize(["ADMIN","INSTRUCTOR"]), deleteCourse);

module.exports = router;