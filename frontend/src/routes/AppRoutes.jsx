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
import CertificateManagementPage from "../pages/Certificate/CertificateManagementPage";
import Home from "../pages/Home/HomePage";
import CourseDetailPage from "../pages/Course/CourseDetailPage";
import InstructorOverviewPage from "../pages/Report/InstructorOverviewPage";
import CheckoutPage from "../pages/Payment/CheckoutPage";
import MyCoursesPage from "../pages/Payment/MyCoursesPage";
import ManageSubmissionPage from "../pages/Submission/ManageSubmissionPage";
import AssignmentListPage from "../pages/Assignment/AssignmentListPage";
import SubmitAssignmentPage from "../pages/Assignment/SubmitAssignmentPage";
import ManageTestPage from "../pages/Test/ManageTestPage";
import TestListPage from "../pages/TestSubmisstion/TestListPage";
import TestDoingPage from "../pages/TestSubmisstion/TestDoingPage";
import TestResultPage from "../pages/TestSubmisstion/TestResultPage";
import CreateTestPage from "../pages/Test/CreateTestPage";
import CertificatePage from "../pages/Certificate/CertificatePage";
import ManageAssignmentPage from "../pages/Assignment/ManageAssignmentPage";
import CourseProgressPage from "../pages/Report/CourseProgressPage";
import StudentDashboardPage from "../pages/Report/StudentDashboardPage";

import AdminOverviewPage from "../pages/Report/AdminOverviewPage";
import ManageUserPage from "../pages/User/ManageUserPage";

import CreateCoursePage from "../pages/Course/CreateCoursePage";
import ManageCoursePage from "../pages/Course/ManageCoursePage";

import ManageLessonPage from "../pages/Lesson/ManageLessonPage";
import CreateAssignmentPage from "../pages/Assignment/CreateAssignmentPage";
import ManageTestSubmissionPage from "../pages/TestSubmisstion/ManageTestSubmissionPage";
import PaymentManagementPage from "../pages/Payment/ManagePaymentPage";
import ClassListPage from "../pages/Class/ClassListPage";
import ClassDetailPage from "../pages/Class/ClassDetailPage";
import ManageClassPage from "../pages/Class/ManageClassPage";
import CreateClassPage from "../pages/Class/CreateClassPage";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
     

      {/* ================= MAIN USER ================= */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="courses/:id" element={<CourseDetailPage />} />

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

        <Route
          path="checkout/:courseId"
          element={
            <ProtectedRoute role="STUDENT">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

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

        {/* Assignment (student) */}
        <Route
  path="courses/:courseId/assignments"
  element={
    <ProtectedRoute role="STUDENT">
      <AssignmentListPage />
    </ProtectedRoute>
  }
/>

<Route
  path="assignments/:assignmentId/submit"
  element={
    <ProtectedRoute role="STUDENT">
      <SubmitAssignmentPage />
    </ProtectedRoute>
  }
/>

        {/* Test */}
        <Route
          path="courses/:courseId/tests"
          element={
            <ProtectedRoute role={["ADMIN", "INSTRUCTOR", "STUDENT"]}>
              <TestListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="tests/:testId/do"
          element={
            <ProtectedRoute role="STUDENT">
              <TestDoingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="tests/:testId/results"
          element={
            <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
              <TestResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="course-progress/:courseId"
          element={
            <ProtectedRoute role="ADMIN">
              <CourseProgressPage />
            </ProtectedRoute>
          }
        />
      </Route>

    {/* ================= DASHBOARD (ADMIN + INSTRUCTOR) ================= */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  {/* ===== OVERVIEW ===== */}
  <Route
    path="instructor-overview"
    element={
      <ProtectedRoute role="INSTRUCTOR">
        <InstructorOverviewPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="admin-overview"
    element={
      <ProtectedRoute role="ADMIN">
        <AdminOverviewPage />
      </ProtectedRoute>
    }
  />

  {/* ===== COURSE ===== */}
  <Route path="courses" element={<ManageCoursePage />} />
  <Route path="create-course" element={<CreateCoursePage />} />
  <Route path="create-course/:id" element={<CreateCoursePage />} />

  {/* ===== CLASS ===== */}
  <Route path="classes" element={<ManageClassPage />} />
  <Route path="courses/:courseId/classes" element={<ManageClassPage />} />
  <Route path="create-class" element={<CreateClassPage />} />
  <Route path="create-class/:id" element={<CreateClassPage />} />
 

  {/* ===== LESSON ===== */}
  <Route path="classes/:classId/lessons" element={<ManageLessonPage />} />
  <Route path="class/lessons" element={<ManageLessonPage />} />

 / ===== ASSIGNMENT =====
<Route
  path="assignments"
  element={<ManageAssignmentPage />}
/>
<Route
  path="classes/:classId/assignments"
  element={<ManageAssignmentPage />}
/>
<Route
  path="create-assignment/:Id"
  element={<CreateAssignmentPage />}
/>
  {/* ===== SUBMISSION ===== */}
  <Route path="submissions/:assignmentId" element={<ManageSubmissionPage />} />
  {/* ===== TEST ===== */}
  <Route path="tests" element={<ManageTestPage />} />
  <Route path="classes/:classId/tests" element={<ManageTestPage />} />
  <Route path="test-submissions" element={<ManageTestSubmissionPage />} />
  <Route path="create-test" element={<CreateTestPage />}/>
  {/* ===== CERTIFICATE ===== */}
  <Route path="certificates" element={<CertificateManagementPage />} />

  {/* ===== ADMIN ONLY ===== */}
  <Route
    path="users"
    element={
      <ProtectedRoute role="ADMIN">
        <ManageUserPage />
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

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<div>404 NOT FOUND</div>} />

    </Routes>
  );
};

export default AppRoutes;