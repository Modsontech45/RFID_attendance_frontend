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
import Layout from "./components/Layout";
import PaymentSuccess from "./components/paymentsuccess";
import PaymentFailed from "./components/paymentfailed";
import VerifyPayment from "./components/verifypayment";


export const publicRoutes = [
  { path: "/", element: <Layout><HomePage /></Layout>  },
  { path: "/pricing", element: <Layout><PricingPage /></Layout> },
  { path: "/docs", element: <Layout><DocumentationPage /></Layout> },
];

export const adminRoutes = [
  { path: "/admin/login", element: <Layout><AdminLogin /></Layout> },
  { path: "/admin/signup", element: <Layout><AdminSignup /></Layout> },
  { path: "/admin/dashboard", element:<Layout><AdminDashboard /></Layout> },
  { path: "/admin/forgot-password", element: <Layout><ForgotPassword /></Layout> },
  { path: "/admin/reset-password", element: <Layout><ResetPassword /></Layout> },
  { path: "/admin/reset-success", element: <Layout><ResetSuccess /></Layout> },
  { path: "/admin/verify", element: <Layout><EmailVerification /></Layout> },
  { path: "/admin/email-sent", element: <Layout><EmailSent /></Layout> },
  { path: "/admin/teachers", element: <Layout><TeachersList /></Layout> },
  { path: "/admin/teachers/add", element: <Layout><AddTeacher /></Layout> },
  { path: "/admin/teachers/:id", element: <Layout><TeacherProfile /></Layout> },
  { path: "/admin/school", element: <Layout><SchoolManagement /></Layout> },
  { path: "/admin/students", element: <Layout><StudentsList /></Layout> },
  { path: "/admin/attendance", element: <Layout><Attendance /></Layout> },
  { path: "/admin/categories", element: <Layout><CategoriesManagement /></Layout> },
  { path: "/admin/reports", element: <Layout><ReportsPage /></Layout> },
  { path: "/admin/teacher/:teacherId", element: <Layout><AdminTeacherProfileView /></Layout> },
  { path: "/admin/time-settings", element: <Layout><TimeSettings /></Layout> },
  {path: "/admin/paymentsucces", element: <PaymentSuccess/>},
  {path: "/admin/paymentfailed", element: <PaymentFailed/>},  
  {path: "/admin/verify-payment", element: <Layout><VerifyPayment /></Layout>},
];

export const teacherRoutes = [
  { path: "/teacher/login", element: <Layout><TeacherLogin /></Layout> },
  { path: "/teacher/students", element: <Layout><TeacherStudents /></Layout> },
  { path: "/teacher/attendance", element: <Layout><TeacherAttendance /></Layout> },
  { path: "/teacher/profile", element: <Layout><TeacherProfile /></Layout> },
  { path: "/teacher/reports", element: <Layout><ReportsPage /></Layout> },
];

// Combine all routes if needed
export const allRoutes = [...publicRoutes, ...adminRoutes, ...teacherRoutes];
