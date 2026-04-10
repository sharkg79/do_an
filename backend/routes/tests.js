const express = require("express");
const router = express.Router();

const {
  createTest,
  getTests,
  updateTest,
  deleteTest,
  submitTest,
  getTestSubmissions,
} = require("../controllers/testController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// ================= CREATE =================
router.post(
  "/",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  createTest
);

// ================= GET ALL =================
router.get(
  "/",
  auth,
  role(["ADMIN", "INSTRUCTOR", "STUDENT"]),
  getTests
);

// ================= UPDATE =================
router.put(
  "/:testId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  updateTest
);

// ================= DELETE =================
router.delete(
  "/:testId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  deleteTest
);

// ================= SUBMIT =================
router.post(
  "/:testId/submit",
  auth,
  role(["STUDENT"]),
  submitTest
);

// ================= GET SUBMISSIONS =================
router.get(
  "/:testId/submissions",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  getTestSubmissions
);

module.exports = router;