const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const {
  getUsers,
  deleteUser,
  updateUserRole
} = require("../controllers/userController");

// 👑 ADMIN ONLY

// GET ALL USERS
router.get("/", auth, role(["ADMIN"]), getUsers);

// DELETE USER
router.delete("/:userId", auth, role(["ADMIN"]), deleteUser);

// UPDATE ROLE
router.put("/:userId/role", auth, role(["ADMIN"]), updateUserRole);

module.exports = router;