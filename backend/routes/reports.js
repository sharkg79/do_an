const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const {
  getDashboardSummary,
  getCourseProgress,
  getInstructorDashboard,
  getStudentDashboard
} = require("../controllers/reportController");

// ======================= REPORT ROUTES =======================

// Dashboard summary 
router.get("/summary", auth, role(["ADMIN", "INSTRUCTOR"]), getDashboardSummary);

// Course progress 
router.get("/course-progress", auth, role(["ADMIN", "INSTRUCTOR"]), getCourseProgress);
router.get( "/instructor-dashboard", auth, role(["INSTRUCTOR"]), getInstructorDashboard );
router.get( "/dashboard", auth, role(["ADMIN"]), getDashboardSummary);
router.get("/student-dashboard",auth,role(["STUDENT"]),getStudentDashboard);
module.exports = router;