const mongoose = require("mongoose");
const Class = require("../models/Class");
const Course = require("../models/Course");


// ================= CREATE CLASS =================
const createClass = async (req, res) => {
  try {
    const { course, title, startDate, endDate, instructor } = req.body;

    let instructorId = req.user._id;

    // ✅ ADMIN có thể chọn instructor
    if (req.user.role === "ADMIN" && instructor) {
      instructorId = instructor;
    }

    // validate course
    if (!mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const courseExist = await Course.findById(course);

    if (!courseExist) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ INSTRUCTOR chỉ được tạo class cho course của mình
    if (
      req.user.role === "INSTRUCTOR" &&
      courseExist.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your course" });
    }

    const newClass = new Class({
      title,
      course,
      instructor: instructorId, // ✅ FIX
      startDate,
      endDate,
      students: [] // đảm bảo có field
    });

    await newClass.save();

    const populated = await Class.findById(newClass._id)
      .populate("course", "title")
      .populate("instructor", "name email");

    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL CLASSES =================
const getAllClasses = async (req, res) => {
  try {
    let query = {};

    // ✅ STUDENT → chỉ lấy lớp đã enroll
    if (req.user.role === "STUDENT") {
      query.students = req.user._id;
    }

    // ✅ INSTRUCTOR → lớp mình dạy
    if (req.user.role === "INSTRUCTOR") {
      query.instructor = req.user._id;
    }

    const classes = await Class.find(query)
      .populate("course", "title")
      .populate("instructor", "name email")
      .populate("students", "name email"); // optional

    res.json(classes);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET CLASS BY ID =================
const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classObj = await Class.findById(id)
      .populate("course", "title")
      .populate("instructor", "name email")
      .populate("students", "name email");

    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(classObj);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE CLASS =================
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classObj = await Class.findById(id);

    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // ✅ check quyền instructor
    if (
      req.user.role === "INSTRUCTOR" &&
      classObj.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your class" });
    }

    const updated = await Class.findByIdAndUpdate(id, req.body, {
      new: true
    })
      .populate("course", "title")
      .populate("instructor", "name email");

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE CLASS =================
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classObj = await Class.findById(id);

    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (
      req.user.role === "INSTRUCTOR" &&
      classObj.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your class" });
    }

    await Class.findByIdAndDelete(id);

    res.json({ message: "Class deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= ENROLL CLASS =================
const enrollClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const studentId = req.user._id;

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can enroll" });
    }

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classObj = await Class.findById(classId);

    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    const isEnrolled = classObj.students.some(
      (id) => id.toString() === studentId.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    classObj.students.push(studentId);
    await classObj.save();

    // ✅ trả về data đã populate (dashboard dùng được luôn)
    const populatedClass = await Class.findById(classId)
      .populate("course", "title")
      .populate("instructor", "name email");

    res.json({
      message: "Enroll success",
      class: populatedClass
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET CLASSES BY COURSE =================
const getClassesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const classes = await Class.find({ course: courseId })
      .populate("course", "title")
      .populate("instructor", "name email")
      .populate("students", "_id");

    res.json(classes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  enrollClass,
  getClassesByCourse
};