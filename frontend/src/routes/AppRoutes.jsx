import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardPage from "../pages/Report/DashboardPage";
import Home from "../pages/Home/HomePage";
import CourseDetailPage from "../pages/Course/CourseDetailPage";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../utils/ProtectedRoute";
import LessonPage from "../pages/Lesson/LessonPage";
import CheckoutPage from "../pages/Payment/CheckoutPage";
import MyCoursesPage from "../pages/Payment/MyCoursesPage";
import AssignmentListPage from "../pages/Assignment/AssignmentListPage";
import SubmitAssignmentPage from "../pages/Assignment/SubmitAssignmentPage";
import TestListPage from "../pages/Test/TestListPage";
import TestDoingPage from "../pages/Test/TestDoingPage";
import TestResultPage from "../pages/Test/TestResultPage";
import CertificatePage from "../pages/Certificate/CertificatePage";
import CourseProgressPage from "../pages/Report/CourseProgressPage";
import SystemOverviewPage from "../pages/Admin/SystemOverviewPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import CreateCoursePage from "../pages/Course/CreateCoursePage";
import ManageCoursePage from "../pages/Course/ManageCoursePage";
import ManageLessonPage from "../pages/Lesson/ManageLessonPage";
import ManageAssignmentPage from "../pages/Assignment/ManageAssignmentPage";
import ManageTestPage from "../pages/Test/ManageTestPage";
import ClassListPage from "../pages/Class/ClassListPage";
import ClassDetailPage from "../pages/Class/ClassDetailPage";
import ManageClassPage from "../pages/Class/ManageClassPage";
import InstructorDashboardPage from "../pages/Report/InstructorDashboardPage";
import StudentDashboardPage from "../pages/Report/StudentDashboardPage";
const AppRoutes = () => {
  return (
    <Routes>

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
<Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
      {/* ================= STUDENT/INSTRUCTOR ================= */}
      {/* MAIN */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="/courses/:id" element={<CourseDetailPage />} />

      <Route
  path="/student-dashboard"
  element={
    <ProtectedRoute roles={["STUDENT"]}>
      <StudentDashboardPage />
    </ProtectedRoute>
  }
/>
{/* CLASS LIST */}
<Route
  path="/classes"
  element={
    <ProtectedRoute role={["STUDENT", "INSTRUCTOR", "ADMIN"]}>
      <ClassListPage />
    </ProtectedRoute>
  }
/>

{/* CLASS DETAIL */}
<Route
  path="/classes/:id"
  element={
    <ProtectedRoute role={["STUDENT", "INSTRUCTOR", "ADMIN"]}>
      <ClassDetailPage />
    </ProtectedRoute>
  }
/>
      {/* CREATE COURSE */}
      <Route
        path="/instructor/create-course"
        element={
          <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
            <CreateCoursePage />
          </ProtectedRoute>
        }
      />

      {/* MANAGE COURSES */}
      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
            <ManageCoursePage />
          </ProtectedRoute>
        }
      />

      {/* MANAGE LESSON */}
      <Route
        path="/instructor/courses/:courseId/lessons"
        element={
          <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
            <ManageLessonPage />
          </ProtectedRoute>
        }
      />

      {/* MANAGE ASSIGNMENT */}
      <Route
        path="/instructor/courses/:courseId/assignments"
        element={
          <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
            <ManageAssignmentPage />
          </ProtectedRoute>
        }
      />

      {/* MANAGE TEST */}
      <Route
        path="/instructor/courses/:courseId/tests"
        element={
          <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
            <ManageTestPage />
          </ProtectedRoute>
        }
      />
{/* MANAGE CLASSES */}
<Route
  path="/instructor/classes"
  element={
    <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
      <ManageClassPage />
    </ProtectedRoute>
  }
/>
      {/* LESSON PAGE */}
      <Route
        path="/courses/:courseId/lessons"
        element={
          <ProtectedRoute role={["ADMIN", "INSTRUCTOR"]}>
            <LessonPage />
          </ProtectedRoute>
        }
      />

      {/* CHECKOUT */}
      <Route
        path="/checkout/:courseId"
        element={
          <ProtectedRoute role="STUDENT">
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course-progress/:courseId"
        element={
          <ProtectedRoute role="ADMIN">
            <CourseProgressPage />
          </ProtectedRoute>
        }
      />

      <Route
  path="/certificates"
  element={
    <ProtectedRoute role="STUDENT">
      <CertificatePage />
    </ProtectedRoute>
  }
/>

      <Route
        path="/my-courses"
        element={
          <ProtectedRoute role="STUDENT">
            <MyCoursesPage />
          </ProtectedRoute>
        }
      />

      {/* ASSIGNMENTS (STUDENT) */}
      <Route path="/courses/:courseId/assignments" element={<AssignmentListPage />} />
      <Route path="/assignments/:assignmentId/submit" element={<SubmitAssignmentPage />} />

      {/* TEST */}
      <Route
        path="/courses/:courseId/tests"
        element={
          <ProtectedRoute role={["ADMIN", "INSTRUCTOR", "STUDENT"]}>
            <TestListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/:testId/do"
        element={
          <ProtectedRoute role="STUDENT">
            <TestDoingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/:testId/results"
        element={
          <ProtectedRoute role={["INSTRUCTOR", "ADMIN"]}>
            <TestResultPage />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route path="/" element={<MainLayout />}>
  <Route index element={<Home />} />

  <Route
    path="admin/dashboard"
    element={
      <ProtectedRoute role="ADMIN">
        <SystemOverviewPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="admin/users"
    element={
      <ProtectedRoute role="ADMIN">
        <UserManagementPage />
      </ProtectedRoute>
    }
  />

</Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<div>404 NOT FOUND</div>} />

    </Routes>
  );
};

export default AppRoutes;