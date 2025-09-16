import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuthData,
  logout,
  getApiKey,
  API_BASE,
  getAdminData,
} from "../utils/auth";
import SubscriptionCard from "./SubscriptionModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Add this import for Excel functionality
import {
  Shield,
  Users,
  LogOut,
  Menu,
  X,
  Download,
  Filter,
  Settings,
  Bell,
  Search,
  Calendar,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Hash,
  Mail,
  GraduationCap,
  Loader2,
  RefreshCw,
  TrendingUp,
  Activity,
  Eye,
  PieChart,
} from "lucide-react";
import { useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import { useTerminology } from "../utils/terminology";

interface AttendanceRecord {
  id: number;
  date: string;
  name: string;
  uid: string;
  sign_in_time?: string;
  sign_out_time?: string;
  status: "present" | "partial" | "absent";
  form: string;
  punctuality: "on_time" | "late" | "not_checked" | "manual";
}

interface Category {
  id: number;
  name: string;
}

interface AttendanceStats {
  totalStudents: number;
  totalPresent: number;
  totalPartial: number;
  totalAbsent: number;
}

interface FormStats {
  [key: string]: {
    present: number;
    partial: number;
    absent: number;
  };
}

const Attendance: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { locale } = useLocalIntl();

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Filter states
  const [filters, setFilters] = useState({
    form: "",
    date: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  // Chart and table references
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const tableRef = useRef<HTMLTableElement>(null); // Fixed: Should be HTMLTableElement

  const token = getAuthData("token");
  const apiKey = getApiKey();
  const adminData = getAdminData();
  const terminology = useTerminology(adminData);

  // Extract admin info with fallbacks
  const schoolName =
    adminData?.schoolname ||
    adminData?.email?.split("@")[1]?.split(".")[0] ||
    "Synctuario Academy";
  const username =
    adminData?.username || adminData?.email?.split("@")[0] || "admin_user";
  const subscription = adminData?.subscription_status || "inactive";

  const handleLogout = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchAttendanceRecords = async () => {
    if (!apiKey) {
      setError("You must be logged in as an admin.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/attendance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "Accept-Language": locale,
        },
      });

      // Handle expired subscription manually
      if (response.status === 403) {
        const result = await response.json();
        console.log("Subscription expired response:", result);
        if (result.subscriptionExpired && result.redirectTo) {
          alert(result.message || "Subscription expired");
          window.location.href = result.redirectTo;
          return;
        } else {
          throw new Error(result.message || "Access denied");
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAttendanceRecords(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setError("Failed to load data. You have no attendance record.");
      setAttendanceRecords([]);
    }
  };

  const fetchCategories = async () => {
    if (!apiKey) return;

    try {
      const response = await fetch(`${API_BASE}/categories`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "Accept-Language": locale,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const calculateStats = (): AttendanceStats => {
    const totalStudents = filteredRecords?.length || 0;
    const totalPresent =
      filteredRecords?.filter((r) => r.status === "present").length || 0;
    const totalPartial =
      filteredRecords?.filter((r) => r.status === "partial").length || 0;
    const totalAbsent =
      filteredRecords?.filter((r) => r.status === "absent").length || 0;

    return { totalStudents, totalPresent, totalPartial, totalAbsent };
  };

  const calculateFormStats = (): FormStats => {
    const formStats: FormStats = {};

    filteredRecords.forEach((record) => {
      const form = record.form || "Unknown";
      if (!formStats[form]) {
        formStats[form] = { present: 0, partial: 0, absent: 0 };
      }

      if (record.status === "present") {
        formStats[form].present++;
      } else if (record.status === "partial") {
        formStats[form].partial++;
      } else {
        formStats[form].absent++;
      }
    });

    return formStats;
  };

  const createChart = async () => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const stats = calculateStats();

    try {
      const Chart = (await import("chart.js/auto")).default;

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      chartInstanceRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Present", "Partial", "Absent"],
          datasets: [
            {
              data: [stats.totalPresent, stats.totalPartial, stats.totalAbsent],
              backgroundColor: ["#16a34a", "#facc15", "#dc2626"],
              borderWidth: 2,
              borderColor: "#ffffff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                padding: 20,
                font: {
                  size: 14,
                },
                color: "#ffffff",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.parsed;
                  const total = stats.totalStudents;
                  const percentage =
                    total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating chart:", error);
    }
  };

  const applyFilters = () => {
    let filtered = attendanceRecords;

    if (filters.form) {
      filtered = filtered.filter(
        (record) => record.form?.toLowerCase() === filters.form.toLowerCase()
      );
    }

    if (filters.date) {
      filtered = filtered.filter(
        (record) => record.date?.slice(0, 10) === filters.date
      );
    }

    if (filters.name) {
      filtered = filtered.filter((record) =>
        record.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (record) => new Date(record.date) <= new Date(filters.endDate)
      );
    }

    setFilteredRecords(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      // if user is applying ANY filter manually, clear out today's date
      if (key !== "date") {
        return { ...prev, [key]: value, date: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  // Enhanced PDF download function
  const downloadAsPDF = async () => {
    try {
      if (!tableRef.current) {
        console.error("Table reference not found");
        return;
      }

      console.log("Generating PDF...");

      // Create a clean container
      const tempDiv = document.createElement("div");
      tempDiv.style.cssText = `
      position: absolute;
      top: 0;
      left: -9999px;
      background: white;
      padding: 20px;
      width: max-content;
      height: max-content;
      overflow: visible;
      z-index: -1;
    `;

      const tableClone = tableRef.current.cloneNode(true) as HTMLTableElement;

      // Reset table styles - keep it as a table!
      tableClone.style.cssText = `
      background: white;
      color: black;
      border-collapse: collapse;
      width: auto;
      max-width: none;
      max-height: none;
      overflow: visible;
      display: table;
      table-layout: auto;
    `;

      // Clean cell styles
      tableClone.querySelectorAll("th, td").forEach((cell) => {
        const el = cell as HTMLElement;
        el.style.cssText = `
        background: white;
        color: black;
        border: 1px solid #ccc;
        padding: 8px;
        white-space: nowrap;
        overflow: visible;
        text-overflow: clip;
      `;
      });

      // Header styles
      tableClone.querySelectorAll("th").forEach((cell) => {
        const el = cell as HTMLElement;
        el.style.background = "#f0f0f0";
        el.style.fontWeight = "bold";
      });

      tempDiv.appendChild(tableClone);
      document.body.appendChild(tempDiv);

      // Wait for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get actual dimensions
      const tableRect = tableClone.getBoundingClientRect();
      const fullWidth = Math.max(tableClone.scrollWidth, tableRect.width);
      const fullHeight = Math.max(tableClone.scrollHeight, tableRect.height);

      console.log(`Table dimensions: ${fullWidth}x${fullHeight}`);

      // Capture with proper dimensions
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: "white",
        width: fullWidth + 40, // include padding
        height: fullHeight + 40,
        scrollX: 0,
        scrollY: 0,
        windowWidth: fullWidth + 40,
        windowHeight: fullHeight + 40,
        allowTaint: true,
      });

      document.body.removeChild(tempDiv);

      // Generate PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("l", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add pages as needed
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      // Add footer
      pdf.setFontSize(14);
      pdf.text(`${schoolName} - Attendance Report`, 10, pageHeight - 5);

      const fileName = `attendance-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      console.log("PDF generated successfully ✅");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Enhanced Excel download function
  const downloadAsExcel = async () => {
    try {
      console.log("Generating Excel file...");

      if (!tableRef.current) {
        alert("Table reference not found");
        return;
      }

      // ✅ Directly convert the DOM table into a worksheet
      const ws = XLSX.utils.table_to_sheet(tableRef.current, {
        raw: true, // keeps raw values
      });

      // Add column widths (optional)
      const colWidths = [
        { wch: 12 }, // Date
        { wch: 20 }, // Name
        { wch: 15 }, // UID
        { wch: 15 }, // Sign In Time
        { wch: 15 }, // Sign Out Time
        { wch: 10 }, // Status
        { wch: 12 }, // Form
        { wch: 15 }, // Punctuality
      ];
      ws["!cols"] = colWidths;

      // Create a new workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

      // Generate filename with current date
      const fileName = `attendance-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Save Excel file
      XLSX.writeFile(wb, fileName);

      console.log("Excel file generated successfully ✅");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      alert("Error generating Excel file. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "partial":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1";
    switch (status) {
      case "present":
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case "partial":
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case "absent":
        return `${baseClasses} bg-red-500/20 text-red-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "Not signed in";
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Start auto-refresh
  const startAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    const interval = setInterval(fetchAttendanceRecords, 10000); // 10 seconds
    setRefreshInterval(interval);
  };

  // Apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [filters, attendanceRecords]);

  // Create chart when filtered records change
  useEffect(() => {
    if (filteredRecords.length > 0) {
      createChart();
    }
  }, [filteredRecords]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDownloadOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check authentication and fetch data on component mount
  useEffect(() => {
    const role = getAuthData("role");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const initializeData = async () => {
      await Promise.all([fetchAttendanceRecords(), fetchCategories()]);
      const today = new Date().toISOString().split("T")[0];
      setFilters((prev) => ({ ...prev, date: today }));
      setIsLoading(false);
      setTimeout(() => setIsLoaded(true), 300);
      startAutoRefresh();
    };

    initializeData();

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [navigate, token]);

  // Show loading state while translations are loading
  if (isLoading || !isLoaded) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <BarChart3 className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {formatMessage({ id: "attendance.loading.attendance" })}
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

  const stats = calculateStats();
  const formStats = calculateFormStats();

  if (subscription !== "active" && subscription !== "trial") {
    alert(
      `Your subscription has expired. Please renew to access attendance data.${subscription}`
    );
    window.location.href = "/pricing";
    return;
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
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "schoolManagement.dashboard" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate("/admin/school")}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {terminology.companymanagement}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate("/admin/students")}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {terminology.studentPlural}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button className="relative group px-4 py-2 rounded-lg bg-white/10 transition-all duration-300">
                  <span className="text-blue-400 transition-colors">
                    {formatMessage({ id: "attendance.attendance" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                </button>

                <button
                  onClick={() => navigate("/admin/reports")}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "schoolManagement.reports" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{formatMessage({ id: "attendance.logout" })}</span>
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
                onClick={() => navigate("/admin/dashboard")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {formatMessage({ id: "schoolManagement.dashboard" })}
              </button>
              <button
                onClick={() => navigate("/admin/school")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {terminology.companymanagement}
              </button>
              <button
                onClick={() => navigate("/admin/students")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {terminology.studentPlural}
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-white/10 text-blue-400">
                {formatMessage({ id: "attendance.attendance" })}
              </button>
              <button
                onClick={() => navigate("/admin/reports")}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {formatMessage({ id: "schoolManagement.reports" })}
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{formatMessage({ id: "attendance.logout" })}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Page Header */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                [{terminology.workersAnalytics}]
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {terminology.monitorAttendance}
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
              label: `Total `,
              value: stats.totalStudents.toString(),
              change: "+12%",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: CheckCircle,
              label: formatMessage({ id: "attendance.stats.presentToday" }),
              value: stats.totalPresent.toString(),
              change: "+5%",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: Clock,
              label: formatMessage({ id: "attendance.stats.partial" }),
              value: stats.totalPartial.toString(),
              change: "+2%",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: XCircle,
              label: formatMessage({ id: "attendance.stats.absentToday" }),
              value: stats.totalAbsent.toString(),
              change: "-3%",
              color: "from-red-500 to-pink-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-6 h-6 text-white" />
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
        {/* {subscription !== "active" && subscription !== "trial" && <SubscriptionCard />} */}
        {/* Controls */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: "400ms" }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="space-y-2">
                  <select
                    value={filters.form}
                    onChange={(e) => handleFilterChange("form", e.target.value)}
                    className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-48"
                  >
                    <option value="">
                      {" "}
                      {formatMessage({ id: "attendance.allforms" })}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-48"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setError("");
                    setIsLoading(true);
                    fetchAttendanceRecords().finally(() => setIsLoading(false));
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {/* <span>Refresh</span> */}
                </button>
                <div className="relative" ref={dropdownRef} style={{ zIndex: 9999 }}  >
                  <button
                    onClick={() => setShowDownloadOptions((prev) => !prev)}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl text-white transition-all duration-300 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    {/* Uncomment if you want a label */}
                    {/* <span>{formatMessage({ id: "attendance.download" })}</span> */}
                  </button>

                  {showDownloadOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                         <button
                        onClick={downloadAsExcel}
                        className="flex justify-between w-full px-4 py-3 hover:bg-white/10 text-white transition-colors"
                      >
                        <span>
                          {formatMessage({ id: "attendance.downloadAsExcel" })}
                        </span>
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadAsPDF}
                        className="flex justify-between w-full px-4 py-3 hover:bg-white/10 text-white transition-colors"
                      >
                        <span>{formatMessage({ id: "attendance.pdf" })}</span>
                        <FileText className="w-4 h-4" />
                      </button>
                   
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowAdvancedFilter(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>
                    {formatMessage({ id: "attendance.advancedFilters" })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: "600ms" }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {formatMessage({ id: "attendance.summary" })}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Chart */}
              <div className="flex justify-center">
                <div className="w-80 h-80 relative">
                  <canvas
                    ref={chartRef}
                    className="max-w-full max-h-full"
                  ></canvas>
                </div>
              </div>

              {/* Form Statistics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-300 mb-4">
                  {formatMessage({ id: "attendance.statistics" })}
                </h3>
                <div className="space-y-3">
                  {Object.entries(formStats).map(([form, stat]) => (
                    <div
                      key={form}
                      className="bg-black/30 rounded-xl p-4 border border-white/10"
                    >
                      <div className="font-semibold text-white mb-2">
                        {form}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg">
                            {stat.present}
                          </div>
                          <div className="text-gray-400">
                            {formatMessage({ id: "attendance.statsPresent" })}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold text-lg">
                            {stat.partial}
                          </div>
                          <div className="text-gray-400">
                            {formatMessage({ id: "attendance.statsPartial" })}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-400 font-bold text-lg">
                            {stat.absent}
                          </div>
                          <div className="text-gray-400">
                            {formatMessage({ id: "attendance.statsAbsent" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Attendance Table */}
        <section
          className="animate-slide-up"
          style={{ animationDelay: "800ms" }}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                <span className="text-gray-300 text-lg">
                  {formatMessage({
                    id: "attendance.loading.loadingAttendance",
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                {formatMessage({ id: "attendance.loading.error" })}
              </h3>
              <p className="text-red-300 mb-6">{error}</p>
              <button
                onClick={() => {
                  setError("");
                  setIsLoading(true);
                  fetchAttendanceRecords().finally(() => setIsLoading(false));
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>
                  {formatMessage({ id: "attendance.loading.tryAgain" })}
                </span>
              </button>
            </div>
          )}

          {/* Attendance Table */}
          {!isLoading && !error && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table ref={tableRef} className="min-w-full">
                  <thead className="bg-blue-800/50 backdrop-blur-sm">
                    <tr>
                      {[
                        { id: "attendance.table.date", icon: Calendar },
                        { id: "attendance.table.name", icon: User },
                        { id: "attendance.table.uid", icon: Hash },
                        { id: "attendance.table.signInTime", icon: Clock },
                        { id: "attendance.table.signOutTime", icon: Clock },
                        { id: "attendance.table.status", icon: Activity },
                        { id: "attendance.table.form", icon: GraduationCap },
                        { id: "attendance.punctuality", icon: GraduationCap },
                      ].map(({ id, icon: Icon }) => (
                        <th
                          key={id}
                          className="px-6 py-4 text-left text-sm font-semibold text-white"
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{formatMessage({ id })}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {filteredRecords.map((record, index) => (
                      <tr
                        key={record.id}
                        className="hover:bg-white/5 transition-colors duration-200 animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Date */}
                        <td className="px-6 py-4 text-white">
                          {formatDate(record.date)}
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 text-white font-medium">
                          {record.name || "N/A"}
                        </td>

                        {/* UID */}
                        <td className="px-6 py-4">
                          <code className="bg-black/50 text-blue-400 px-2 py-1 rounded text-sm">
                            {record.uid || "N/A"}
                          </code>
                        </td>

                        {/* Sign-in Time */}
                        <td
                          className={`px-6 py-4 ${
                            record.sign_in_time
                              ? "text-green-400"
                              : "text-red-400 font-semibold"
                          }`}
                        >
                          {formatTime(record.sign_in_time)}
                        </td>

                        {/* Sign-out Time */}
                        <td
                          className={`px-6 py-4 ${
                            record.sign_out_time
                              ? "text-green-400"
                              : "text-red-400 font-semibold"
                          }`}
                        >
                          {record.sign_out_time
                            ? formatTime(record.sign_out_time)
                            : "Not signed out"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={getStatusBadge(record.status)}>
                            {getStatusIcon(record.status)}
                            <span className="capitalize">{record.status}</span>
                          </span>
                        </td>

                        {/* Form */}
                        <td className="px-6 py-4">
                          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            {record.form || "Unknown"}
                          </span>
                        </td>

                        {/* Punctuality */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm
              ${
                record.punctuality === "on_time"
                  ? "bg-emerald-600 text-white"
                  : record.punctuality === "late"
                    ? "bg-transparent text-yellow-600 animate-pulse border-2 border-yellow-600"
                    : record.punctuality === "not_checked"
                      ? "bg-transparent text-red-600 animate-bounce"
                      : record.punctuality === "manual"
                        ? "bg-transparent text-white animate-bounce"
                        : "bg-transparent text-gray-500"
              }`}
                          >
                            {record.punctuality === "late"
                              ? formatMessage({ id: "punctuality.late" })
                              : record.punctuality === "on_time"
                                ? formatMessage({ id: "punctuality.on_time" })
                                : record.punctuality === "manual"
                                  ? formatMessage({ id: "punctuality.manual" })
                                  : formatMessage({
                                      id: "punctuality.not_checked",
                                    })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredRecords.length === 0 && !isLoading && !error && (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                      <BarChart3 className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {formatMessage({ id: "attendance.loading.noRecords" })}
                    </h3>
                    <p className="text-gray-400">
                      {formatMessage({ id: "attendance.loading.tryAdjusting" })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Advanced Filter Modal */}
      {showAdvancedFilter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 text-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative transform animate-scale-in">
            <button
              onClick={() => setShowAdvancedFilter(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {formatMessage({ id: "attendance.advancedFilters" })}
              </h3>
              <p className="text-gray-400 mt-2">
                {formatMessage({ id: "attendance.description" })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {formatMessage({ id: "attendance.searchByName" })}
                </label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  placeholder={formatMessage({
                    id: "attendance.searchPlaceholder",
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {formatMessage({ id: "attendance.startDate" })}:
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">
                  {formatMessage({ id: "attendance.endDate" })}:
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowAdvancedFilter(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
              >
                {formatMessage({ id: "attendance.cancel" })}
              </button>

              <button
                onClick={() => {
                  applyFilters();
                  setShowAdvancedFilter(false);
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {formatMessage({ id: "attendance.applyFilters" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
