const Certificate = require("../models/Certificate");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Class = require("../models/Class");

// ================= AUTO CREATE =================
const createCertificateIfEligible = async ({
  studentId,
  classId,
  finalScore,
}) => {
  try {
    // ❌ chưa đủ điểm
    if (finalScore < 80) return null;

    // ================= GET CLASS =================
    const classData = await Class.findById(classId).populate("course");

    if (!classData) return null;

    const courseId = classData.course._id;

    // ================= CHECK ASSIGNMENTS =================
    const assignments = await Assignment.find({ classId });

    // nếu không có assignment → không cấp
    if (assignments.length === 0) return null;

    const submissions = await Submission.find({
      student: studentId,
      assignment: { $in: assignments.map((a) => a._id) },
    });

    // ❌ chưa nộp đủ
    if (submissions.length !== assignments.length) {
      return null;
    }

    // ================= CHECK EXIST =================
    const existed = await Certificate.findOne({
      student: studentId,
      course: courseId,
    });

    if (existed) return existed;

    // ================= CREATE =================
    const certificate = await Certificate.create({
      student: studentId,
      course: courseId,
      grade: finalScore,
      certificateUrl: "", // có thể generate sau
    });

    return certificate;
  } catch (error) {
    console.error("AUTO CERT ERROR:", error);
    return null;
  }
};

// ================= GET MY =================
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
  student: req.user._id,
})
  .populate("classId", "title")
  .populate("course", "title");

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN GET ALL =================
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE (OPTIONAL ADMIN) =================
const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    await Certificate.findByIdAndDelete(id);

    res.json({ message: "Deleted certificate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= UPDATE =================
const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, certificateUrl } = req.body;

    const cert = await Certificate.findById(id);

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    cert.grade = grade ?? cert.grade;
    cert.certificateUrl = certificateUrl ?? cert.certificateUrl;

    await cert.save();

    res.json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= GET DETAIL =================
const getCertificateById = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title description");

    if (!cert) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(cert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createCertificateIfEligible, // ⚠️ internal
  getMyCertificates,
  getAllCertificates,
  deleteCertificate,
  updateCertificate,
  getCertificateById,
};