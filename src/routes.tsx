import HomePage from "./components/HomePage";
import AdminLogin from "./components/AdminLogin";
import TeacherLogin from "./components/TeacherLogin";
import AdminSignup from "./components/AdminSignup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ResetSuccess from "./components/ResetSuccess";
import EmailVerification from "./components/EmailVerification";
import EmailSent from "./components/EmailSent";
import AdminDashboard from "./components/AdminDashboard";
import TeachersList from "./components/TeachersList";
import TeacherProfile from "./components/TeacherProfile";
import AddTeacher from "./components/AddTeacher";
import SchoolManagement from "./components/SchoolManagement";
import StudentsList from "./components/StudentsList";
import Attendance from "./components/Attendance";
import CategoriesManagement from "./components/CategoriesManagement";
import TeacherStudents from "./components/TeacherStudents";
import TeacherAttendance from "./components/TeacherAttendance";
import PricingPage from "./components/PricingPage";
import DocumentationPage from "./components/DocumentationPage";
import ReportsPage from "./components/ReportsPage";
import AdminTeacherProfileView from "./components/AdminTeacherProfileView";
import TimeSettings from "./components/Timesetting";

export const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/docs", element: <DocumentationPage /> },
];

export const adminRoutes = [
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/signup", element: <AdminSignup /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/forgot-password", element: <ForgotPassword /> },
  { path: "/admin/reset-password", element: <ResetPassword /> },
  { path: "/admin/reset-success", element: <ResetSuccess /> },
  { path: "/admin/verify", element: <EmailVerification /> },
  { path: "/admin/email-sent", element: <EmailSent /> },
  { path: "/admin/teachers", element: <TeachersList /> },
  { path: "/admin/teachers/add", element: <AddTeacher /> },
  { path: "/admin/teachers/:id", element: <TeacherProfile /> },
  { path: "/admin/school", element: <SchoolManagement /> },
  { path: "/admin/students", element: <StudentsList /> },
  { path: "/admin/attendance", element: <Attendance /> },
  { path: "/admin/categories", element: <CategoriesManagement /> },
  { path: "/admin/reports", element: <ReportsPage /> },
  { path: "/admin/teacher/:teacherId", element: <AdminTeacherProfileView /> },
  { path: "/admin/time-settings", element: <TimeSettings /> },
];

export const teacherRoutes = [
  { path: "/teacher/login", element: <TeacherLogin /> },
  { path: "/teacher/students", element: <TeacherStudents /> },
  { path: "/teacher/attendance", element: <TeacherAttendance /> },
  { path: "/teacher/profile", element: <TeacherProfile /> },
  { path: "/teacher/reports", element: <ReportsPage /> },
];

// Combine all routes if needed
export const allRoutes = [...publicRoutes, ...adminRoutes, ...teacherRoutes];
