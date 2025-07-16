import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { getAuthData, logout, getApiKey, getAdminData } from "../utils/auth";
import { postData, API_BASE } from "../utils/auth";
import {
  Shield,
  Users,
  UserPlus,
  FileText,
  LogOut,
  Menu,
  X,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Building,
  BarChart3,
  GraduationCap,
  ClipboardList,
  Loader2,
  Settings,
  Bell,
  Search,
  Calendar,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Target,
  Zap,
} from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalAttendanceToday: number;
  attendanceRate: number;
}

interface Student {
  id: number;
  name: string;
  uid: string;
  email: string;
  form: string;
  created_at: string;
}

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

interface AttendanceRecord {
  id: number;
  date: string;
  name: string;
  status: "present" | "partial" | "absent";
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { locale } = useLocalIntl();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copyMessage, setCopyMessage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState("");
  const [categoryMessageType, setCategoryMessageType] = useState<"success" | "error">("success");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalAttendanceToday: 0,
    attendanceRate: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const apiKey = getApiKey() || formatMessage({ id: "dashboard.apiKeyPlaceholder" });
  const token = getAuthData("token");
  const adminData = getAdminData();

  const schoolName =
    adminData?.schoolname ||
    adminData?.email?.split("@")[1]?.split(".")[0] ||
    formatMessage({ id: "dashboard.defaultSchoolName" });
  const username =
    adminData?.username ||
    adminData?.email?.split("@")[0] ||
    formatMessage({ id: "dashboard.defaultUsername" });

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopyMessage(true);
      setTimeout(() => setCopyMessage(false), 2000);
    } catch (error) {
      console.error("Failed to copy API key:", error);
    }
  };

  const maskApiKey = (key: string) => {
    return "*".repeat(key.length);
  };

  const fetchDashboardStats = async () => {
    if (!apiKey || !token) return;

    try {
      const [studentsResponse, teachersResponse, attendanceResponse] = await Promise.all([
        fetch(`${API_BASE}/students`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Accept-Language": locale,
          },
        }),
        fetch(`${API_BASE}/teachers/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        }),
        fetch(`${API_BASE}/attendance`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Accept-Language": locale,
          },
        }),
      ]);

      let totalStudents = 0;
      let totalTeachers = 0;
      let totalAttendanceToday = 0;
      let attendanceRate = 0;

      if (studentsResponse.ok) {
        const students: Student[] = await studentsResponse.json();
        totalStudents = students.length;
      }

      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        const teachers: Teacher[] = teachersData.teachers || [];
        totalTeachers = teachers.length;
      }

      if (attendanceResponse.ok) {
        const attendanceRecords: AttendanceRecord[] = await attendanceResponse.json();
        const today = new Date().toISOString().slice(0, 10);

        const todayRecords = attendanceRecords.filter(
          (record) => record.date?.slice(0, 10) === today,
        );

        totalAttendanceToday = todayRecords.length;
        const presentToday = todayRecords.filter((record) => record.status === "present").length;
        attendanceRate =
          totalAttendanceToday > 0 ? Math.round((presentToday / totalAttendanceToday) * 100) : 0;
      }

      setDashboardStats({
        totalStudents,
        totalTeachers,
        totalAttendanceToday,
        attendanceRate,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    setCategoryLoading(true);
    setCategoryMessage("");

    try {
      const result = await postData(
        `${API_BASE}/categories/create`,
        { name: categoryName.trim() },
        { "x-api-key": apiKey, "Accept-Language": locale },
      );

      if (result.message && !result.error) {
        setCategoryMessage(
          formatMessage({
            id: "dashboard.category.success",
            defaultMessage: "Category created successfully!",
          }),
        );
        setCategoryMessageType("success");
        setCategoryName("");
        setTimeout(() => {
          setShowCategoryModal(false);
          setCategoryMessage("");
        }, 1500);
      } else {
        setCategoryMessage(
          result.error ||
            formatMessage({
              id: "dashboard.category.error",
              defaultMessage: "Failed to create category.",
            }),
        );
        setCategoryMessageType("error");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setCategoryMessage(
        formatMessage({
          id: "dashboard.category.serverError",
          defaultMessage: "Server error. Please try again.",
        }),
      );
      setCategoryMessageType("error");
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    const role = getAuthData("role");
    if (!token || role !== "admin") {
      navigate("/admin/login");
    } else {
      setTimeout(() => setIsLoaded(true), 300);
      fetchDashboardStats();
    }
  }, [navigate, token]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl">
            <Shield className="h-8 w-8 animate-bounce text-white" />
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
              <FormattedMessage id="dashboard.loading" defaultMessage="Loading Dashboard" />
            </div>
            <div className="flex justify-center space-x-1">
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 shadow-2xl backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="group flex items-center space-x-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transition-all duration-300 group-hover:scale-110">
                  <Shield className="h-7 w-7 text-white transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-400" />
              </div>
              <div className="space-y-1">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-lg font-bold text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-8 lg:flex">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate("/admin/school")}
                  className="relative rounded-lg px-4 py-2 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="text-gray-300 transition-colors hover:text-white">
                    <FormattedMessage id="dashboard.nav.school" defaultMessage="School" />
                  </span>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>

                <button
                  onClick={() => navigate("/admin/teachers")}
                  className="relative rounded-lg px-4 py-2 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="text-gray-300 transition-colors hover:text-white">
                    <FormattedMessage id="dashboard.nav.staff" defaultMessage="Staff" />
                  </span>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>

                <button
                  onClick={() => navigate("/admin/reports")}
                  className="relative rounded-lg px-4 py-2 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="text-gray-300 transition-colors hover:text-white">
                    <FormattedMessage id="dashboard.nav.reports" defaultMessage="Reports" />
                  </span>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>

                <button
                  onClick={() => navigate("/admin/teachers/add")}
                  className="relative rounded-lg px-4 py-2 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="text-gray-300 transition-colors hover:text-white">
                    <FormattedMessage id="dashboard.nav.addStaff" defaultMessage="Add Staff" />
                  </span>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>

                <button
                  onClick={() => navigate("/docs")}
                  className="relative rounded-lg px-4 py-2 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="text-gray-300 transition-colors hover:text-white">
                    <FormattedMessage id="dashboard.nav.docs" defaultMessage="Documentation" />
                  </span>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
             

                <button className="relative rounded-lg p-2 transition-all duration-300 hover:bg-white/10">
                  <Bell className="h-5 w-5 text-gray-400 transition-colors hover:text-white" />
                  <div className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />
                </button>

                <button className="rounded-lg p-2 transition-all duration-300 hover:bg-white/10">
                  <Settings className="h-5 w-5 text-gray-400 transition-all duration-300 hover:rotate-90 hover:text-white" />
                </button>

                {/* <LanguageSwitcher /> */}

                <button
                  onClick={handleLogout}
                  className="flex transform items-center space-x-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
                >
                  <LogOut className="h-4 w-4" />
                  <span>
                    <FormattedMessage id="dashboard.logout" defaultMessage="Logout" />
                  </span>
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="rounded-lg p-2 transition-all duration-300 hover:bg-white/10 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`overflow-hidden transition-all duration-300 lg:hidden ${
              isMobileMenuOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="space-y-2 border-t border-white/10 pb-4 pt-4">
              <button
                onClick={() => navigate("/admin/school")}
                className="w-full rounded-lg px-4 py-3 text-left text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <FormattedMessage id="dashboard.nav.school" defaultMessage="School" />
              </button>
              <button
                onClick={() => navigate("/admin/teachers")}
                className="w-full rounded-lg px-4 py-3 text-left text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <FormattedMessage id="dashboard.nav.staff" defaultMessage="Staff" />
              </button>
              <button
                onClick={() => navigate("/admin/teachers/add")}
                className="w-full rounded-lg px-4 py-3 text-left text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <FormattedMessage id="dashboard.nav.addStaff" defaultMessage="Add Staff" />
              </button>
              <button
                onClick={() => navigate("/admin/reports")}
                className="w-full rounded-lg px-4 py-3 text-left text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <FormattedMessage id="dashboard.nav.reports" defaultMessage="Reports" />
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="w-full rounded-lg px-4 py-3 text-left text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                <FormattedMessage id="dashboard.nav.docs" defaultMessage="Documentation" />
              </button>

              <div className="border-t border-white/10 pt-4">
                {/* <LanguageSwitcher /> */}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:from-red-600 hover:to-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>
                    <FormattedMessage id="dashboard.logout" defaultMessage="Logout" />
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-12 px-6 py-12">
        {/* Welcome Section */}
        <section className="animate-fade-in space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold md:text-6xl">
              <span className="animate-gradient bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                <FormattedMessage id="dashboard.welcomeTitle" defaultMessage="Welcome Back" />
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              <FormattedMessage
                id="dashboard.welcomeSubtitle"
                defaultMessage="Manage your institution with powerful tools and real-time insights"
              />
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section
          className="animate-slide-up grid grid-cols-2 gap-6 md:grid-cols-4"
          style={{ animationDelay: "200ms" }}
        >
          {[
            {
              icon: Users,
              label: formatMessage({ id: "dashboard.stats.students" }),
              value: isLoadingStats ? "..." : dashboardStats.totalStudents.toString(),
              change: "+12%",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: GraduationCap,
              label: formatMessage({ id: "dashboard.stats.teachers" }),
              value: isLoadingStats ? "..." : dashboardStats.totalTeachers.toString(),
              change: "+5%",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: ClipboardList,
              label: formatMessage({ id: "dashboard.stats.attendance" }),
              value: isLoadingStats ? "..." : `${dashboardStats.attendanceRate}%`,
              change: "+2.1%",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: TrendingUp,
              label: formatMessage({ id: "dashboard.stats.records" }),
              value: isLoadingStats ? "..." : dashboardStats.totalAttendanceToday.toString(),
              change: "+1.2%",
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group transform rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-2xl"
            >
              <div
                className={`h-12 w-12 bg-gradient-to-r ${stat.color} mb-4 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
              >
                {isLoadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <stat.icon className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="flex items-center space-x-1 text-xs text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* API Key Section */}
        <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-8 shadow-2xl backdrop-blur-md">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  <FormattedMessage id="dashboard.apiSection.title" defaultMessage="API Key" />
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={showApiKey ? apiKey : maskApiKey(apiKey)}
                    readOnly
                    className="flex-grow rounded-xl border border-white/20 bg-black/50 px-4 py-3 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={toggleApiKeyVisibility}
                    className="flex transform items-center space-x-2 rounded-xl bg-blue-600 px-4 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="hidden sm:inline">
                      {showApiKey ? (
                        <FormattedMessage id="dashboard.apiSection.hide" defaultMessage="Hide" />
                      ) : (
                        <FormattedMessage id="dashboard.apiSection.show" defaultMessage="Show" />
                      )}
                    </span>
                  </button>
                  <button
                    onClick={copyApiKey}
                    className="flex transform items-center space-x-2 rounded-xl bg-green-600 px-4 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-green-700"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      <FormattedMessage id="dashboard.apiSection.copy" defaultMessage="Copy" />
                    </span>
                  </button>
                </div>

                {copyMessage && (
                  <div className="animate-fade-in flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      <FormattedMessage
                        id="dashboard.apiSection.copied"
                        defaultMessage="Copied to clipboard!"
                      />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="animate-slide-up" style={{ animationDelay: "600ms" }}>
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              <FormattedMessage id="dashboard.quickActions.title" defaultMessage="Quick Actions" />
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              <FormattedMessage
                id="dashboard.quickActions.subtitle"
                defaultMessage="Perform common tasks quickly"
              />
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="group flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-2xl"
            >
              <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              <span>
                <FormattedMessage
                  id="dashboard.quickActions.create"
                  defaultMessage="Create Category"
                />
              </span>
            </button>

            <button
              onClick={() => navigate("/admin/categories")}
              className="group flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl"
            >
              <Building className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span>
                <FormattedMessage
                  id="dashboard.quickActions.view"
                  defaultMessage="View Categories"
                />
              </span>
            </button>

            <button
              onClick={() => navigate("/admin/time-settings")}
              className="group flex transform items-center space-x-3 rounded-2xl bg-gradient-to-r from-green-600 to-lime-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-lime-700 hover:shadow-2xl"
            >
              <Clock className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span>
                <FormattedMessage
                  id="dashboard.quickActions.timeSettings"
                  defaultMessage="Time Settings"
                />
              </span>
            </button>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="animate-slide-up" style={{ animationDelay: "800ms" }}>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              <FormattedMessage id="dashboard.features.title" defaultMessage="Dashboard Features" />
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                title: formatMessage({ id: "dashboard.features.attendance.title" }),
                description: formatMessage({ id: "dashboard.features.attendance.description" }),
                color: "from-blue-500 to-cyan-500",
                delay: "0ms",
              },
              {
                icon: Users,
                title: formatMessage({ id: "dashboard.features.teacher.title" }),
                description: formatMessage({ id: "dashboard.features.teacher.description" }),
                color: "from-green-500 to-emerald-500",
                delay: "200ms",
              },
              {
                icon: BarChart3,
                title: formatMessage({ id: "dashboard.features.report.title" }),
                description: formatMessage({ id: "dashboard.features.report.description" }),
                color: "from-purple-500 to-pink-500",
                delay: "400ms",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="animate-slide-up group transform cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-2xl"
                style={{ animationDelay: card.delay }}
              >
                <div
                  className={`h-16 w-16 bg-gradient-to-r ${card.color} mb-6 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover:rotate-3 group-hover:scale-110`}
                >
                  <card.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent">
                  {card.title}
                </h3>
                <p className="leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                  {card.description}
                </p>
                <div className="mt-6 flex items-center text-blue-400 transition-colors duration-300 group-hover:text-blue-300">
                  <span className="text-sm font-medium">
                    <FormattedMessage
                      id="dashboard.features.learnMore"
                      defaultMessage="Learn more"
                    />
                  </span>
                  <Activity className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="animate-scale-in relative w-full max-w-md transform rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white shadow-2xl">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute right-4 top-4 text-gray-400 transition-all duration-300 hover:rotate-90 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                <FormattedMessage id="dashboard.modal.title" defaultMessage="New Category" />
              </h3>
              <p className="mt-2 text-gray-400">
                <FormattedMessage
                  id="dashboard.modal.subtitle"
                  defaultMessage="Create a new department category"
                />
              </p>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  <FormattedMessage
                    id="dashboard.modal.categoryName"
                    defaultMessage="Category Name"
                  />
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder={formatMessage({
                    id: "dashboard.modal.categoryPlaceholder",
                    defaultMessage: "Enter category name...",
                  })}
                  required
                  className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={categoryLoading}
                className="flex w-full transform items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 disabled:scale-100 disabled:from-gray-600 disabled:to-gray-700"
              >
                {categoryLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>
                      <FormattedMessage
                        id="dashboard.modal.creating"
                        defaultMessage="Creating..."
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>
                      <FormattedMessage
                        id="dashboard.modal.createButton"
                        defaultMessage="Create Category"
                      />
                    </span>
                  </>
                )}
              </button>

              {categoryMessage && (
                <div
                  className={`rounded-xl border p-4 text-center ${
                    categoryMessageType === "success"
                      ? "border-green-500/50 bg-green-500/20 text-green-300"
                      : "border-red-500/50 bg-red-500/20 text-red-300"
                  } animate-fade-in`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {categoryMessageType === "success" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <X className="h-5 w-5" />
                    )}
                    <span>{categoryMessage}</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
