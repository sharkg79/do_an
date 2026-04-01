require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const classRoutes = require("./routes/classes");
const lessonRoutes = require("./routes/lessons");
const assignmentRoutes = require("./routes/assignments");
const path = require("path");
const reportRoutes = require("./routes/reports");
const submissionRoutes = require("./routes/submissions");
const paymentRoutes = require("./routes/payments");
const testRoutes = require("./routes/tests");
const certificateRoutes = require("./routes/certificates");
const userRoutes = require("./routes/users");

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/reports", reportRoutes);
app.use("/api/submissions",submissionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/users", userRoutes);

// connect database
connectDB();

app.get("/", (req, res) => {
  res.send("API running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});