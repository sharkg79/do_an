const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignmentsByCourse,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission
} = require("../controllers/assignmentController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const upload = require("../middlewares/upload");

// CREATE
router.post("/", auth, role(["INSTRUCTOR", "ADMIN"]), createAssignment);

// GET
router.get("/course/:courseId", auth, getAssignmentsByCourse);

// UPDATE
router.put("/:assignmentId", auth, role(["INSTRUCTOR", "ADMIN"]), updateAssignment);

// DELETE
router.delete("/:assignmentId", auth, role(["INSTRUCTOR", "ADMIN"]), deleteAssignment);

// SUBMIT (STUDENT)
router.post(
  "/:assignmentId/submit",
  auth,
  role(["STUDENT"]),
  upload.single("file"),
  submitAssignment
);

// GRADE
router.put(
  "/submission/:submissionId/grade",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  gradeSubmission
);

module.exports = router;