const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const {
  payCourse,
  confirmPayment
} = require("../controllers/paymentController");

// STUDENT PAY
router.post("/:courseId/pay", auth, role(["STUDENT"]), payCourse);

// PAYMENT CALLBACK (KHÔNG auth vì gateway gọi)
router.post("/confirm", confirmPayment);

module.exports = router;