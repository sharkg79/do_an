const mongoose = require("mongoose");
const User = require("../models/User");

// ================= GET ALL USERS =================
// controllers/userController.js
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let filter = {};

    // 👇 LỌC THEO ROLE
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select("name email role");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ROLE =================
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["ADMIN", "INSTRUCTOR", "STUDENT"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "Role updated",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserRole
};