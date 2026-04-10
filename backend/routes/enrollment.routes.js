const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const {
  createPayment,
  confirmPayment,
  checkEnrollment
} = require("../controllers/enrollment.controller");

// tạo payment
router.post("/create-payment", auth, createPayment);

// confirm payment
router.post("/confirm-payment", auth, confirmPayment);

// check enrolled
router.get("/check/:courseId", auth, checkEnrollment);

module.exports = router;