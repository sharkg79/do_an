const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const { generateCertificate, getMyCertificates } = require("../controllers/certificateController");

// Student generate certificate for a course
router.post("/generate/:courseId", auth, role(["STUDENT"]), generateCertificate);

// Student get all their certificates
router.get("/my", auth, role(["STUDENT"]), getMyCertificates);

module.exports = router;