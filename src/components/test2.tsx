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
  const { t, currentLanguage, changeLanguage, loading } = useTranslation();
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

  // Time settings state
  const [timeSettings, setTimeSettings] = useState<{
    sign_in_start: string;
    sign_in_end: string;
    sign_out_start: string;
    sign_out_end: string;
  } | null>(null);
  const [timeLoading, setTimeLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    sign_in_start: "",
    sign_in_end: "",
    sign_out_start: "",
    sign_out_end: "",
  });
  const [timeError, setTimeError] = useState("");
  const [timeSuccess, setTimeSuccess] = useState("");

  const apiKey = getApiKey() || "YourAPIKeyHere";
  const token = getAuthData("token");
  const adminData = getAdminData();

  // Extract admin info with fallbacks
  const schoolName =
    adminData?.schoolname ||
    adminData?.email?.split("@")[1]?.split(".")[0] ||
    "Synctuario Academy";
  const username =
    adminData?.username || adminData?.email?.split("@")[0] || "admin_user";

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

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

  // Fetch Time Settings on mount or apiKey change
  useEffect(() => {
    if (!apiKey) return;
    setTimeLoading(true);
    setTimeError("");
    fetch(`/api/time-settings?api_key=${apiKey}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load time settings");
        return res.json();
      })
      .then(data => {
        setTimeSettings(data);
        setEditForm({
          sign_in_start: data.sign_in_start,
          sign_in_end: data.sign_in_end,
          sign_out_start: data.sign_out_start,
          sign_out_end: data.sign_out_end,
        });
      })
      .catch(err => setTimeError(err.message || "Error loading time settings"))
      .finally(() => setTimeLoading(false));
  }, [apiKey]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTimeError("");
    setTimeSuccess("");
    try {
      const res = await fetch("/api/time-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, ...editForm }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update time settings");
      }
      setTimeSettings(editForm);
      setTimeSuccess("Time settings updated successfully!");
      setEditModalOpen(false);
    } catch (err: any) {
      setTimeError(err.message || "Error updating time settings");
    }
  };

  const fetchDashboardStats = async () => {
    if (!apiKey || !token) return;

    try {
      const studentsResponse = await fetch(`${API_BASE}/students`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "Accept-Language": currentLanguage,
        },
      });

      const teachersResponse = await fetch(`${API_BASE}/teachers/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
        },
      });

      const attendanceResponse = await fetch(`${API_BASE}/attendance`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "Accept-Language": currentLanguage,
        },
      });

      let totalStudents = 0,
        totalTeachers = 0,
        totalAttendanceToday = 0,
        attendanceRate = 0;

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
        const todayRecords = attendanceRecords.filter(record => record.date.slice(0, 10) === today);
        totalAttendanceToday = todayRecords.length;
        const presentToday = todayRecords.filter(r => r.status === "present").length;
        attendanceRate = totalAttendanceToday ? Math.round((presentToday / totalAttendanceToday) * 100) : 0;
      }

      setDashboardStats({ totalStudents, totalTeachers, totalAttendanceToday, attendanceRate });
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
        { "x-api-key": apiKey, "Accept-Language": currentLanguage }
      );

      if (result.message && !result.error) {
        setCategoryMessage(result.message || "Category created successfully!");
        setCategoryMessageType("success");
        setCategoryName("");
        setTimeout(() => {
          setShowCategoryModal(false);
          setCategoryMessage("");
        }, 1500);
      } else {
        setCategoryMessage(result.error || "Failed to create category.");
        setCategoryMessageType("error");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      const message = error?.data?.message || error?.message || "Server error. Please try again.";
      setCategoryMessage(message);
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
  }, [navigate]);

  if (loading || !isLoaded) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <Shield className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Loading Dashboard
            </div>
            <div className="flex justify-center space-x-1">
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <button className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <button
                    onClick={() => navigate("/admin/school")}
                    className="text-gray-300 group-hover:text-white transition-colors"
                  >
                    School
                  </button>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate("/admin/teachers")}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Staff
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <button
                    onClick={() => navigate("/admin/reports")}
                    className="text-gray-300 group-hover:text-white transition-colors"
                  >
                    Reports
                  </button>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate("/admin/teachers/add")}
                  className="text-gray-300 group-hover:text-white transition-colors"
                >
                  Add Staff
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate("/docs")}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Documentation
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </button>

                {/* Settings */}
                <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                </button>

                {/* Language Selector */}
                <select
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white/20 transition-all duration-300"
                >
                  <option value="en" className="text-gray-900">
                    🇺🇸 {t("home.english")}
                  </option>
                  <option value="fr" className="text-gray-900">
                    🇫🇷 {t("home.french")}
                  </option>
                </select>

                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("adminhomepage.dashboard.menu.logout")}</span>
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen
                ? "max-h-96 opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <nav className="pb-4 border-t border-white/10 pt-4 space-y-2">
              <button
                onClick={() => navigate("/admin/school")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                Organization
              </button>
              <button
                onClick={() => navigate("/admin/teachers")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                Staff
              </button>
              <button
                onClick={() => navigate("/admin/teachers/add")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                Add Staff
              </button>
              <button
                onClick={() => navigate("/admin/reports")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                Reports
              </button>
              <button
                onClick={() => navigate("/docs")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                Documentation
              </button>

              <div className="pt-4 border-t border-white/10">
                <select
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                >
                  <option value="en" className="text-gray-900">
                    🇺🇸 {t("home.english")}
                  </option>
                  <option value="fr" className="text-gray-900">
                    🇫🇷 {t("home.french")}
                  </option>
                </select>

                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("adminhomepage.dashboard.menu.logout")}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>





      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Welcome Section */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Welcome Back
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your institution with powerful tools and real-time insights
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section
          className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          {[
            {
              icon: Users,
              label: "Total Students",
              value: isLoadingStats
                ? "..."
                : dashboardStats.totalStudents.toString(),
              change: "+12%",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: GraduationCap,
              label: "Active Teachers",
              value: isLoadingStats
                ? "..."
                : dashboardStats.totalTeachers.toString(),
              change: "+5%",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: ClipboardList,
              label: "Today's Attendance",
              value: isLoadingStats
                ? "..."
                : `${dashboardStats.attendanceRate}%`,
              change: "+2.1%",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: TrendingUp,
              label: "Attendance Records",
              value: isLoadingStats
                ? "..."
                : dashboardStats.totalAttendanceToday.toString(),
              change: "+1.2%",
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <stat.icon className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-xs text-green-400 flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* API Key Section */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: "400ms" }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {t("adminhomepage.dashboard.api")}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={showApiKey ? apiKey : maskApiKey(apiKey)}
                    readOnly
                    className="flex-grow bg-black/50 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <button
                    onClick={toggleApiKeyVisibility}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {showApiKey
                        ? t("adminhomepage.dashboard.hide")
                        : t("adminhomepage.dashboard.show")}
                    </span>
                  </button>
                  <button
                    onClick={copyApiKey}
                    className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t("adminhomepage.dashboard.copy")}
                    </span>
                  </button>
                </div>

                {copyMessage && (
                  <div className="flex items-center space-x-2 text-green-400 animate-fade-in">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {t("adminhomepage.dashboard.copied")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: "600ms" }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Quick Actions
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t("adminhomepage.dashboard.rule")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-3"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>{t("adminhomepage.dashboard.create")}</span>
            </button>

            <button
              onClick={() => navigate("/admin/categories")}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-3"
            >
              <Building className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>{t("adminhomepage.dashboard.view")}</span>
            </button>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: "800ms" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t("adminhomepage.dashboard.section_title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardList,
                title: t("adminhomepage.dashboard.cards.attendance.title"),
                description: t(
                  "adminhomepage.dashboard.cards.attendance.description"
                ),
                color: "from-blue-500 to-cyan-500",
                delay: "0ms",
              },
              {
                icon: Users,
                title: t("adminhomepage.dashboard.cards.teacher.title"),
                description: t(
                  "adminhomepage.dashboard.cards.teacher.description"
                ),
                color: "from-green-500 to-emerald-500",
                delay: "200ms",
              },
              {
                icon: BarChart3,
                title: t("adminhomepage.dashboard.cards.report.title"),
                description: t(
                  "adminhomepage.dashboard.cards.report.description"
                ),
                color: "from-purple-500 to-pink-500",
                delay: "400ms",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-slide-up cursor-pointer"
                style={{ animationDelay: card.delay }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                >
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                  {card.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <Activity className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 text-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform animate-scale-in">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">New Category</h3>
              <p className="text-gray-400 mt-2">
                Create a new department category
              </p>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={categoryLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex justify-center items-center space-x-3 shadow-lg"
              >
                {categoryLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Category</span>
                  </>
                )}
              </button>

              {categoryMessage && (
                <div
                  className={`text-center p-4 rounded-xl border ${
                    categoryMessageType === "success"
                      ? "bg-green-500/20 border-green-500/50 text-green-300"
                      : "bg-red-500/20 border-red-500/50 text-red-300"
                  } animate-fade-in`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {categoryMessageType === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
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
