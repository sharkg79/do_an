const express = require("express");
const router = express.Router();

const {
  getMyCertificates,
  getAllCertificates,
  deleteCertificate,
  updateCertificate,
  getCertificateById,
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
// ================= UPDATE =================
router.put(
  "/:id",
  auth,
  role(["ADMIN"]),
  updateCertificate
);

// ================= GET DETAIL =================
router.get(
  "/:id",
  auth,
  role(["ADMIN"]),
  getCertificateById
);

module.exports = router;