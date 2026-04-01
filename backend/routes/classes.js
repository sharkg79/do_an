// routes/classes.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/role");

const {
  createClass,
  getAllClasses,
  enrollClass,
  deleteClass,
  updateClass,
  getClassById
} = require("../controllers/classController");

// CREATE CLASS (ADMIN hoặc INSTRUCTOR)
router.post("/", auth, authorize(["ADMIN","INSTRUCTOR"]), createClass);

// GET ALL CLASSES (ADMIN / INSTRUCTOR / STUDENT)
router.get("/", auth, authorize(["ADMIN","INSTRUCTOR","STUDENT"]), getAllClasses);

// STUDENT ENROLL CLASS
router.post("/:id/enroll", auth, authorize(["STUDENT"]), enrollClass);
// GET CLASS BY ID
router.get("/:id", auth, getClassById);
// UPDATE CLASS (ADMIN hoặc INSTRUCTOR)
router.put("/:id", auth, authorize(["ADMIN","INSTRUCTOR"]), updateClass);
// DELETE CLASS (ADMIN hoặc INSTRUCTOR)
router.delete("/:id", auth, authorize(["ADMIN","INSTRUCTOR"]), deleteClass);
module.exports = router;