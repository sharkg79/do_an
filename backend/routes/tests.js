const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const {
  createTest,
  updateTest,
  deleteTest,
  getTestsByCourse,
  submitTest,
  getSubmissions
} = require("../controllers/testController");

// CREATE
router.post("/", auth, role(["INSTRUCTOR", "ADMIN"]), createTest);
// UPDATE
router.put("/:testId", auth, role(["INSTRUCTOR", "ADMIN"]), updateTest);

// DELETE
router.delete("/:testId", auth, role(["INSTRUCTOR", "ADMIN"]), deleteTest);

// GET
router.get("/course/:courseId", auth, getTestsByCourse);

// SUBMIT
router.post("/:testId/submit", auth, role(["STUDENT"]), submitTest);

// GET SUBMISSIONS
router.get("/:testId/submissions", auth, role(["INSTRUCTOR", "ADMIN"]), getSubmissions);

module.exports = router;