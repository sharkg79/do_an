const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đảm bảo folder uploads tồn tại
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    // Tạo tên file an toàn
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "video/mp4",
    "video/x-matroska", // mkv chuẩn mime đúng
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only video/pdf/doc allowed."), false);
  }
};

// Init multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB cho demo ổn định
  },
});

module.exports = upload;