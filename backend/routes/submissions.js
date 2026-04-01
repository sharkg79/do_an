const express = require("express");
const router = express.Router();

const {
  submitAssignment,
  gradeSubmission,
  getSubmissionsByAssignment,
  getMySubmissions,
  getSubmissionDetail,
  deleteSubmission
} = require("../controllers/submissionController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const upload = require("../middlewares/upload");

// SUBMIT
router.post(
  "/:assignmentId",
  auth,
  role(["STUDENT"]),
  upload.single("file"),
  submitAssignment
);

// GRADE (FIX dùng submissionId)
router.put(
  "/:submissionId/grade",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  gradeSubmission
);

// GET ALL
router.get(
  "/assignment/:assignmentId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  getSubmissionsByAssignment
);

// MY
router.get("/my", auth, role(["STUDENT"]), getMySubmissions);

// DETAIL
router.get("/detail/:submissionId", auth, getSubmissionDetail);

// DELETE
router.delete(
  "/:submissionId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  deleteSubmission
);

module.exports = router;