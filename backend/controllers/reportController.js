const User = require("../models/User");
const Course = require("../models/Course");
const Class = require("../models/Class");
const Lesson = require("../models/Lesson");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Enrollment = require("../models/Enrollment");

// ======================= DASHBOARD / REPORTS =======================

// Tổng quan hệ thống / dashboard
const getDashboardSummary = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "INSTRUCTOR") {
      filter.instructor = req.user._id;
    }

    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalClasses,
      totalLessons,
      totalAssignments
    ] = await Promise.all([
      req.user.role === "ADMIN" ? User.countDocuments() : User.countDocuments({ role: "STUDENT" }),
      User.countDocuments({ role: "STUDENT" }),
      User.countDocuments({ role: "INSTRUCTOR" }),
      Course.countDocuments(filter),
      Class.countDocuments(filter),
      Lesson.countDocuments(filter),
      Assignment.countDocuments(filter)
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalClasses,
      totalLessons,
      totalAssignments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tiến độ học sinh theo course
const getCourseProgress = async (req, res) => {
  try {
    let courseFilter = {};

    if (req.user.role === "INSTRUCTOR") {
      courseFilter.instructor = req.user._id;
    }

    const courses = await Course.find(courseFilter).lean();
    const Enrollment = require("../models/Enrollment");
    const result = await Promise.all(
      courses.map(async (course) => {

        // lấy students từ class
        const classes = await Class.find({ course: course._id }).lean();

        let studentIds = classes.flatMap(c => c.students || []);

        // ❗ remove duplicate
        studentIds = [...new Set(studentIds.map(id => id.toString()))];

        // lessons & assignments
        const lessons = await Lesson.countDocuments({ course: course._id });
        const assignments = await Assignment.find({ course: course._id }).lean();

        const assignmentIds = assignments.map(a => a._id);

        // lấy submissions 1 lần
        const submissions = await Submission.find({
          assignment: { $in: assignmentIds }
        }).lean();

        // map theo student
        const progressMap = {};

        submissions.forEach(sub => {
          const studentId = sub.student.toString();

          if (!progressMap[studentId]) {
            progressMap[studentId] = 0;
          }

          progressMap[studentId]++;
        });

        // build response
        const studentProgress = studentIds.map(studentId => {
          const completed = progressMap[studentId] || 0;

          return {
            studentId,
            completedAssignments: completed,
            totalAssignments: assignments.length,
            progressPercentage:
              assignments.length > 0
                ? Math.round((completed / assignments.length) * 100)
                : 0
          };
        });

        return {
          courseId: course._id,
          courseTitle: course.title,
          totalStudents: studentIds.length,
          studentProgress
        };
      })
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Lấy course của instructor
    const courses = await Course.find({ instructor: instructorId }).lean();
    const courseIds = courses.map(c => c._id);

    // Tổng học viên
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds }
    });

    // Doanh thu
    const revenueData = await Enrollment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          isPaid: true
        }
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseData"
        }
      },
      { $unwind: "$courseData" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$courseData.price" }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Stats từng course
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Enrollment.countDocuments({
          course: course._id
        });

        return {
          courseId: course._id,
          courseTitle: course.title,
          students: studentCount,
          revenue: course.price * studentCount
        };
      })
    );

    res.json({
      totalCourses: courses.length,
      totalStudents,
      totalRevenue,
      courseStats
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= STUDENT DASHBOARD =================
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Courses enrolled
    const enrollments = await Enrollment.find({
      student: studentId
    }).populate("course");

    const courseIds = enrollments.map(e => e.course._id);

    // Assignments
    const assignments = await Assignment.find({
      course: { $in: courseIds }
    });

    // Submissions
    const submissions = await Submission.find({
      student: studentId
    });

    const completed = submissions.length;
    const totalAssignments = assignments.length;

    // continue learning
    const courses = enrollments.map(e => ({
      _id: e.course._id,
      title: e.course.title,
      thumbnail: e.course.thumbnail
    }));

    res.json({
      totalCourses: enrollments.length,
      totalAssignments,
      completedAssignments: completed,
      courses
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getDashboardSummary,
  getCourseProgress,
  getInstructorDashboard,
  getStudentDashboard
};