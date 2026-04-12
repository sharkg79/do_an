import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth & Utils
import ProtectedRoute from "../utils/ProtectedRoute";

// Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/HomePage";
import CourseDetailPage from "../pages/Course/CourseDetailPage";

import StudentDashboardPage from "../pages/Report/StudentDashboardPage";
import InstructorOverviewPage from "../pages/Report/InstructorOverviewPage";
import AdminOverviewPage from "../pages/Report/AdminOverviewPage";

import PaymentPage from "../pages/Payment/PaymentPage";
import MyCoursesPage from "../pages/Payment/MyCoursesPage";
import PaymentManagementPage from "../pages/Payment/ManagePaymentPage";

import CertificatePage from "../pages/Certificate/CertificatePage";
import CertificateManagementPage from "../pages/Certificate/CertificateManagementPage";
import CertificateEditPage from "../pages/Certificate/CertificateEditPage";

import ClassListPage from "../pages/Class/ClassListPage";
import ClassDetailPage from "../pages/Class/ClassDetailPage";
import ManageClassPage from "../pages/Class/ManageClassPage";
import CreateClassPage from "../pages/Class/CreateClassPage";

import ManageCoursePage from "../pages/Course/ManageCoursePage";
import CreateCoursePage from "../pages/Course/CreateCoursePage";

import ManageLessonPage from "../pages/Lesson/ManageLessonPage";
import CreateLessonPage from "../pages/Lesson/CreateLessonPage";
import LessonList from "../pages/Lesson/LessonList";
import LessonDetail from "../pages/Lesson/LessonDetail";

import ManageUserPage from "../pages/User/ManageUserPage";
import CreateUserPage from "../pages/User/CreateUserPage";
import UserDetail from "../pages/User/UserDetail";
import ProfilePage from "../pages/User/ProfilePage";

// ===== ASSIGNMENT =====
import ManageAssignmentPage from "../pages/Assignment/ManageAssignmentPage";
import CreateAssignmentPage from "../pages/Assignment/CreateAssignmentPage";
import AssignmentList from "../pages/Assignment/AssignmentList";
import AssignmentDetail from "../pages/Assignment/AssignmentDetail";

// ===== SUBMISSION =====
import ManageSubmissionPage from "../pages/Submission/ManageSubmissionPage";

// ===== TEST =====
import ManageTestPage from "../pages/Test/ManageTestPage";
import CreateTestPage from "../pages/Test/CreateTestPage";
import TestDetail from "../pages/Test/TestDetail";

// ===== TEST SUBMISSION =====
import ManageTestSubmissionPage from "../pages/TestSubmisstion/ManageTestSubmissionPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= AUTH ================= */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* ================= MAIN USER ================= */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="courses/:id" element={<CourseDetailPage />} />

        {/* PROFILE (nếu bạn vẫn dùng ngoài dashboard) */}
        <Route path="profile" element={<ProfilePage />} />

        <Route
          path="student-dashboard"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="classes"
          element={
            <ProtectedRoute role={["STUDENT", "INSTRUCTOR", "ADMIN"]}>
              <ClassListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="classes/:id"
          element={
            <ProtectedRoute role={["STUDENT", "INSTRUCTOR", "ADMIN"]}>
              <ClassDetailPage />
            </ProtectedRoute>
          }
        />

        {/* PAYMENT */}
        <Route path="payment/:classId" element={<PaymentPage />} />

        <Route
          path="my-courses"
          element={
            <ProtectedRoute role="STUDENT">
              <MyCoursesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="certificates"
          element={
            <ProtectedRoute role="STUDENT">
              <CertificatePage />
            </ProtectedRoute>
          }
        />

        {/* LESSON */}
        <Route path="classes/:classId/lessons" element={<LessonList />} />
        <Route path="lessons/:lessonId" element={<LessonDetail />} />

        {/* ASSIGNMENT */}
        <Route path="classes/:classId/assignments" element={<AssignmentList />} />
        <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />

        {/* TEST */}
        <Route path="tests/:testId" element={<TestDetail />} />

        {/* USERS */}
        <Route path="classes/:classId/users" element={<UserDetail />} />
      </Route>

      {/* ================= DASHBOARD ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role={["STUDENT", "INSTRUCTOR", "ADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* PROFILE */}
        <Route
          path="profile"
          element={
            <ProtectedRoute role={["STUDENT", "INSTRUCTOR", "ADMIN"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="admin-overview"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminOverviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="instructor-overview"
          element={
            <ProtectedRoute role="INSTRUCTOR">
              <InstructorOverviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="student-dashboard"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* COURSE */}
        <Route path="courses" element={<ManageCoursePage />} />
        <Route path="create-course" element={<CreateCoursePage />} />
        <Route path="create-course/:id" element={<CreateCoursePage />} />

        {/* CLASS */}
        <Route path="classes" element={<ManageClassPage />} />
        <Route path="courses/:courseId/classes" element={<ManageClassPage />} />
        <Route path="create-class" element={<CreateClassPage />} />
        <Route path="create-class/:id" element={<CreateClassPage />} />

        {/* LESSON */}
        <Route path="lessons" element={<ManageLessonPage />} />
        <Route path="classes/:classId/lessons" element={<ManageLessonPage />} />
        <Route path="create-lesson/:classId" element={<CreateLessonPage />} />
        <Route path="edit-lesson/:id" element={<CreateLessonPage />} />

        {/* ASSIGNMENT */}
        <Route path="assignments" element={<ManageAssignmentPage />} />
        <Route path="classes/:classId/assignments" element={<ManageAssignmentPage />} />
        <Route path="create-assignment/:classId" element={<CreateAssignmentPage />} />

        {/* SUBMISSION */}
        <Route path="submissions" element={<ManageSubmissionPage />} />
        <Route path="assignments/:assignmentId/submissions" element={<ManageSubmissionPage />} />

        {/* TEST */}
        <Route path="tests" element={<ManageTestPage />} />
        <Route path="classes/:classId/tests" element={<ManageTestPage />} />
        <Route path="create-test/:classId" element={<CreateTestPage />} />

        {/* TEST SUBMISSION */}
        <Route path="test-submissions" element={<ManageTestSubmissionPage />} />
        <Route path="tests/:testId/submissions" element={<ManageTestSubmissionPage />} />

        {/* CERTIFICATE */}
        <Route path="certificates" element={<CertificateManagementPage />} />
        <Route path="certificates/edit/:id" element={<CertificateEditPage />} />

        {/* ADMIN */}
        <Route
          path="users"
          element={
            <ProtectedRoute role="ADMIN">
              <ManageUserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="create-user"
          element={
            <ProtectedRoute role="ADMIN">
              <CreateUserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="create-user/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <CreateUserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="payments"
          element={
            <ProtectedRoute role="ADMIN">
              <PaymentManagementPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<div>404 NOT FOUND</div>} />
    </Routes>
  );
};

export default AppRoutes;