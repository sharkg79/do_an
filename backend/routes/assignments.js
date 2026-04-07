const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments, // ✅ đổi API
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getSubmissionsByAssignment, // ✅ API mới
} = require("../controllers/assignmentController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const upload = require("../middlewares/upload");

// ================= CREATE =================
router.post("/", auth, role(["INSTRUCTOR", "ADMIN"]), createAssignment);

// ================= GET ALL / MY =================
// admin: tất cả
// instructor: assignment của mình
router.get(
  "/",
  auth,
  role(["ADMIN", "INSTRUCTOR"]), // ✅ chặn STUDENT từ đầu
  getAssignments
);

// ================= UPDATE =================
router.put(
  "/:assignmentId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  updateAssignment
);

// ================= DELETE =================
router.delete(
  "/:assignmentId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  deleteAssignment
);

// ================= SUBMIT =================
router.post(
  "/:assignmentId/submit",
  auth,
  role(["STUDENT"]),
  upload.single("file"),
  submitAssignment
);

// ================= GRADE =================
router.put(
  "/submission/:submissionId/grade",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  gradeSubmission
);

router.get(
  "/:assignmentId/submissions",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  getSubmissionsByAssignment
);
module.exports = router;