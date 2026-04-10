const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  createUser,
  getUserById,
  updateUser
} = require("../controllers/userController");

// 👑 ADMIN ONLY
router.post("/", auth, role(["ADMIN"]), createUser);
// GET ALL USERS
router.get("/", auth, role(["ADMIN"]), getAllUsers);
router.get("/:userId", auth, role(["ADMIN"]), getUserById);
// DELETE USER
router.delete("/:userId", auth, role(["ADMIN"]), deleteUser);

// UPDATE ROLE
router.put("/:userId/role", auth, role(["ADMIN"]), updateUserRole);
// UPDATE USER
router.put("/:userId", auth, role(["ADMIN"]), updateUser);


module.exports = router;