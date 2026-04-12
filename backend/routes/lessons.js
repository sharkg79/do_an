const express = require("express");
const router = express.Router();

const {
  createLesson,
  getLessonsByClass,
  getAllLessons,
  updateLesson,
  deleteLesson,
  getLessonById,
} = require("../controllers/lessonController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const upload = require("../middlewares/upload");

// ===== Middleware xử lý file =====
const handleUpload = (req, res, next) => {
  const { contentUrl } = req.body;

  if (!contentUrl) {
    return res.status(400).json({ message: "Content URL is required" });
  }

  next();
};
// ================= ROUTES =================

// CREATE
router.post(
  "/",
  auth,
  role(["INSTRUCTOR", "ADMIN"]),
  handleUpload,
  createLesson
);

// GET BY CLASS
router.get("/class/:classId", auth, getLessonsByClass);
// GET ALL
router.get("/", auth, getAllLessons);
// GET BY ID
router.get("/:lessonId", auth, getLessonById);
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