const express = require("express");
const router = express.Router();

const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson
} = require("../controllers/lessonController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const upload = require("../middlewares/upload");

// ===== Middleware xử lý file =====
const handleUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  req.body.contentUrl = `/uploads/${req.file.filename}`;
  next();
};

// ================= ROUTES =================

// CREATE
router.post(
  "/",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  upload.single("file"),
  handleUpload,
  createLesson
);

// GET BY COURSE
router.get("/course/:courseId", auth, getLessonsByCourse);

// UPDATE
router.put(
  "/:lessonId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  updateLesson
);

// DELETE
router.delete(
  "/:lessonId",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  deleteLesson
);

module.exports = router;