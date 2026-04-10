const express = require("express");
const router = express.Router();

const {
  getTestSubmissions,
  getTestSubmissionsByTest,
  gradeTestSubmission,
  deleteTestSubmission,
} = require("../controllers/testSubmissionController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// ================= GET ALL =================
router.get(
  "/",
  auth,
  role(["ADMIN", "INSTRUCTOR"]),
  getTestSubmissions
);

// ================= GET BY TEST =================
router.get(
  "/test/:testId",
  auth,
  role(["ADMIN", "INSTRUCTOR"]),
  getTestSubmissionsByTest
);

// ================= AUTO GRADE =================
router.put(
  "/:submissionId/grade",
  auth,
  role(["ADMIN", "INSTRUCTOR"]),
  gradeTestSubmission
);

// ================= DELETE =================
router.delete(
  "/:submissionId",
  auth,
  role(["ADMIN", "INSTRUCTOR"]),
  deleteTestSubmission
);

module.exports = router;