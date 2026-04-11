const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
// ================= CREATE USER =================
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // validate cơ bản
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // check email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
const hashedPassword = await bcrypt.hash(password, 10);
    // tạo user
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // ⚠️ thực tế nên hash password
      role: role || "STUDENT"
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= GET USER BY ID =================
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔥 check quyền
    if (req.user.role !== "ADMIN" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const user = await User.findById(userId).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= UPDATE USER =================
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id; // 🔥 lấy từ token

    const { name, email, password } = req.body;

    const user = await User.findById(userId);

    if (name) user.name = name;

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Email already exists" });
      }
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllUsers,
  deleteUser,
  updateUserRole,
  createUser,
  getUserById,
  updateUser
};