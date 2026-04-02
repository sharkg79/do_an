📘 I. TỔNG QUAN HỆ THỐNG

Hệ thống là một Web E-Learning (Learning Management System - LMS) cho phép:

Quản lý khóa học

Học trực tuyến

Làm bài tập & bài kiểm tra

Thanh toán khóa học

Cấp chứng chỉ

Theo dõi tiến độ & báo cáo

🧱 II. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE DESIGN)

1. User
User (

  _id PRIMARY KEY,
  
  name,
  
  email UNIQUE,
  
  password,
  
  role ENUM('ADMIN', 'INSTRUCTOR', 'STUDENT'),
  
  createdAt,
  
  updatedAt
  
)

4. Course
Course (

  _id PRIMARY KEY,
  
  title,
  
  description,
  
  price,
  
  instructor FOREIGN KEY → User(_id),
  
  createdAt
  
)

6. Enrollment
Enrollment (

  _id PRIMARY KEY,
  
  student FOREIGN KEY → User(_id),
  
  course FOREIGN KEY → Course(_id),
  
  isPaid,
  
  paymentMethod ENUM('MOMO','VNPAY','STRIPE','FREE'),
  
  paymentId,
  
  paidAt,
  
  createdAt,
  
  updatedAt,
  
  UNIQUE(student, course)
  
)

7. Lesson
Lesson (

  _id PRIMARY KEY,
  
  title,
  
  description,
  
  course FOREIGN KEY → Course(_id),
  
  instructor FOREIGN KEY → User(_id),
  
  contentType ENUM('video','document'),
  
  contentUrl,
  
  createdAt
  
)

9. Assignment
Assignment (

  _id PRIMARY KEY,
  
  title,
  
  course FOREIGN KEY → Course(_id),
  
  instructor FOREIGN KEY → User(_id),
  
  description,
  
  dueDate,
  
  createdAt
  
)

11. Submission
Submission (

  _id PRIMARY KEY,
  
  assignment FOREIGN KEY → Assignment(_id),
  
  student FOREIGN KEY → User(_id),
  
  fileUrl,
  
  fileName,
  
  fileType,
  
  score (0-100),
  
  feedback,
  
  createdAt,
  
  updatedAt,
  
  UNIQUE(assignment, student)
)

13. Test
Test (

  _id PRIMARY KEY,
  
  title,
  
  course FOREIGN KEY → Course(_id),
  
  instructor FOREIGN KEY → User(_id),
  
  questions JSON,
  
  totalMarks,
  
  dueDate,
  
  createdAt,
  
  updatedAt
  
)

15. TestSubmission
TestSubmission (

  _id PRIMARY KEY,
  
  test FOREIGN KEY → Test(_id),
  
  student FOREIGN KEY → User(_id),
  
  answers JSON,
  
  score,
  
  createdAt,
  
  updatedAt,
  
  UNIQUE(test, student)
  
)

17. Class
Class (

  _id PRIMARY KEY,
  
  title,
  
  course FOREIGN KEY → Course(_id),
  
  instructor FOREIGN KEY → User(_id),
  
  students ARRAY(User._id),
  
  startDate,
  
  endDate,
  
  createdAt
  
)

19. Certificate
Certificate (

  _id PRIMARY KEY,
  
  student FOREIGN KEY → User(_id),
  
  course FOREIGN KEY → Course(_id),
  
  certificateUrl,
  
  grade,
  
  issuedAt,
  
  createdAt,
  
  updatedAt,
  
  UNIQUE(student, course)
  
)

🔗 III. QUAN HỆ DỮ LIỆU (ERD LOGIC)

User (1) — (N) Course

User (1) — (N) Enrollment

Course (1) — (N) Lesson

Course (1) — (N) Assignment

Course (1) — (N) Test

Assignment (1) — (N) Submission

Test (1) — (N) TestSubmission

User (N) — (N) Course (qua Enrollment)

⚙️ IV. CHỨC NĂNG HỆ THỐNG

1. Authentication
Đăng ký (Register)

Đăng nhập (Login)

Xác thực JWT

3. Quản lý User (ADMIN)
Xem danh sách user

Xóa user

Cập nhật role

5. Quản lý Course
Public:

Xem danh sách course

Xem chi tiết

Instructor/Admin:

Tạo course

Cập nhật course

Xóa course

7. Thanh toán & Enrollment
Đăng ký khóa học

Thanh toán:

MOMO

VNPAY

STRIPE

FREE

Xác nhận thanh toán

9. Lesson
Instructor:

Tạo lesson (upload file/video)

Sửa / xóa

Student:

Xem lesson theo course

11. Assignment
Instructor:

Tạo / sửa / xóa assignment

Student:

Nộp bài (upload file)

Instructor:

Chấm điểm

Feedback

13. Submission
Xem bài nộp

Xem chi tiết

Xóa bài

Chấm điểm

15. Test
Instructor:

Tạo test

Thêm câu hỏi

Sửa / xóa

Student:

Làm bài test

Submit bài

17. Test Submission
Lưu câu trả lời

Tính điểm

Xem danh sách bài làm

19. Class
Tạo lớp học

Tham gia lớp

Quản lý học viên

21. Certificate
Generate chứng chỉ

Xem chứng chỉ

23. Dashboard & Report
Tổng quan hệ thống

Tiến độ học

Dashboard giảng viên

🔄 V. FLOW HỆ THỐNG

1. Flow tổng thể
User → Course → Enrollment → Lesson → Assignment/Test → Submission → Certificate
2. Flow Student
1. Register → User
2. Login
3. Xem Course
4. Enroll → Enrollment
5. Học Lesson
6. Làm Assignment → Submission
7. Làm Test → TestSubmission
8. Hoàn thành → Certificate
3. Flow Instructor
1. Tạo Course
2. Tạo Lesson
3. Tạo Assignment
4. Tạo Test
5. Chấm bài
6. Xem Dashboard
4. Flow Assignment
Instructor → tạo Assignment
Student → submit → Submission
Instructor → chấm → score + feedback
5. Flow Test
Instructor → tạo Test
Student → làm bài → TestSubmission
System → chấm điểm
6. Flow Certificate
Student hoàn thành course
→ generate Certificate
7. Flow Payment
Student → chọn course
→ thanh toán
→ confirm payment
→ tạo Enrollment
