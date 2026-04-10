const express = require("express");
const router = express.Router();

const {
  getMyCertificates,
  getAllCertificates,
  deleteCertificate,
} = require("../controllers/certificateController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// ================= GET MY CERTIFICATES =================
// STUDENT lấy certificate của mình
router.get(
  "/my",
  auth,
  role(["STUDENT"]),
  getMyCertificates
);

// ================= ADMIN GET ALL =================
router.get(
  "/",
  auth,
  role(["ADMIN"]),
  getAllCertificates
);

// ================= DELETE =================
router.delete(
  "/:id",
  auth,
  role(["ADMIN"]),
  deleteCertificate
);

module.exports = router;