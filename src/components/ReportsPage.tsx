import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useTranslation } from '../hooks/useTranslation';
import { getAuthData, logout, getApiKey, API_BASE, getAdminData } from '../utils/auth';
import SubscriptionCard from './SubscriptionModal';
import { 
  Shield, 
  BarChart3,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  PieChart,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Loader2,
  Eye,
  Search
} from 'lucide-react';
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
interface AttendanceRecord {
  id: number;
  date: string;
  name: string;
  uid: string;
  sign_in_time?: string;
  sign_out_time?: string;
  status: 'present' | 'partial' | 'absent';
  form: string;
}

interface Student {
  id: number;
  name: string;
  uid: string;
  email: string;
  form: string;
  gender: string;
  created_at: string;
}

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface ReportData {
  totalStudents: number;
  totalTeachers: number;
  totalAttendanceRecords: number;
  attendanceRate: number;
  dailyStats: { [key: string]: number };
  formStats: { [key: string]: { present: number; absent: number; total: number } };
  genderStats: { male: number; female: number; other: number };
  monthlyTrends: { month: string; attendance: number }[];
}

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { locale, } = useLocalIntl();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedForm, setSelectedForm] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Chart refs
  const attendanceChartRef = useRef<HTMLCanvasElement>(null);
  const formChartRef = useRef<HTMLCanvasElement>(null);
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstancesRef = useRef<any[]>([]);

  const token = getAuthData('token');
  const apiKey = getApiKey();
  const adminData = getAdminData();
  
  // Extract admin info with fallbacks
  const schoolName = adminData?.schoolname || adminData?.email?.split('@')[1]?.split('.')[0] || 'Synctuario Academy';
  const username = adminData?.username || adminData?.email?.split('@')[0] || 'admin_user';
const subscription = adminData?.subscription_status;


  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [attendanceRes, studentsRes, teachersRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/attendance`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'Accept-Language': locale || 'en'
          }
        }),
        fetch(`${API_BASE}/students`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'Accept-Language': locale || 'en'
          }
        }),
        fetch(`${API_BASE}/teachers/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey || ''
          }
        }),
        fetch(`${API_BASE}/categories`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'Accept-Language': locale || 'en'
          }
        })
      ]);

      const attendanceData = attendanceRes.ok ? await attendanceRes.json() : [];
      const studentsData = studentsRes.ok ? await studentsRes.json() : [];
      const teachersData = teachersRes.ok ? await teachersRes.json() : { teachers: [] };
      const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

      setAttendanceRecords(Array.isArray(attendanceData) ? attendanceData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setTeachers(Array.isArray(teachersData.teachers) ? teachersData.teachers : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      generateReportData(attendanceData, studentsData, teachersData.teachers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReportData = (attendance: AttendanceRecord[], students: Student[], teachers: Teacher[]) => {
    // Filter attendance by date range and form if selected
    let filteredAttendance = attendance;
    
    if (selectedDateRange.startDate) {
      filteredAttendance = filteredAttendance.filter(record => 
        new Date(record.date) >= new Date(selectedDateRange.startDate)
      );
    }
    
    if (selectedDateRange.endDate) {
      filteredAttendance = filteredAttendance.filter(record => 
        new Date(record.date) <= new Date(selectedDateRange.endDate)
      );
    }
    
    if (selectedForm) {
      filteredAttendance = filteredAttendance.filter(record => 
        record.form === selectedForm
      );
    }

    // Calculate basic stats
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalAttendanceRecords = filteredAttendance.length;
    const presentRecords = filteredAttendance.filter(r => r.status === 'present').length;
    const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

    // Daily stats for last 7 days
    const dailyStats: { [key: string]: number } = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    last7Days.forEach(date => {
      const dayRecords = filteredAttendance.filter(r => r.date?.split('T')[0] === date);
      dailyStats[date] = dayRecords.filter(r => r.status === 'present').length;
    });

    // Form/Class stats
    const formStats: { [key: string]: { present: number; absent: number; total: number } } = {};
    categories.forEach(category => {
      const formRecords = filteredAttendance.filter(r => r.form === category.name);
      const present = formRecords.filter(r => r.status === 'present').length;
      const absent = formRecords.filter(r => r.status === 'absent').length;
      formStats[category.name] = {
        present,
        absent,
        total: formRecords.length
      };
    });

    // Gender stats
    const genderStats = {
      male: students.filter(s => s.gender?.toLowerCase() === 'male').length,
      female: students.filter(s => s.gender?.toLowerCase() === 'female').length,
      other: students.filter(s => s.gender?.toLowerCase() === 'other').length
    };

    // Monthly trends (last 6 months)
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthRecords = filteredAttendance.filter(r => r.date?.startsWith(monthStr));
      const presentCount = monthRecords.filter(r => r.status === 'present').length;
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        attendance: presentCount
      };
    }).reverse();

    setReportData({
      totalStudents,
      totalTeachers,
      totalAttendanceRecords,
      attendanceRate,
      dailyStats,
      formStats,
      genderStats,
      monthlyTrends
    });
  };

  const createCharts = async () => {
    if (!reportData) return;

    // Destroy existing charts
    chartInstancesRef.current.forEach(chart => chart.destroy());
    chartInstancesRef.current = [];

    try {
      const Chart = (await import('chart.js/auto')).default;

      // Attendance Rate Pie Chart
      if (attendanceChartRef.current) {
        const ctx = attendanceChartRef.current.getContext('2d');
        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Present', 'Absent'],
              datasets: [{
                data: [
                  reportData.attendanceRate,
                  100 - reportData.attendanceRate
                ],
                backgroundColor: ['#16a34a', '#dc2626'],
                borderWidth: 2,
                borderColor: '#ffffff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#ffffff' }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }
      }

      // Form Stats Bar Chart
      if (formChartRef.current) {
        const ctx = formChartRef.current.getContext('2d');
        if (ctx) {
          const formLabels = Object.keys(reportData.formStats);
          const presentData = formLabels.map(form => reportData.formStats[form].present);
          const absentData = formLabels.map(form => reportData.formStats[form].absent);

          const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: formLabels,
              datasets: [
                {
                  label: 'Present',
                  data: presentData,
                  backgroundColor: '#16a34a',
                  borderColor: '#16a34a',
                  borderWidth: 1
                },
                {
                  label: 'Absent',
                  data: absentData,
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: '#ffffff' }
                }
              },
              scales: {
                x: {
                  ticks: { color: '#ffffff' },
                  grid: { color: '#374151' }
                },
                y: {
                  ticks: { color: '#ffffff' },
                  grid: { color: '#374151' }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }
      }

      // Monthly Trend Line Chart
      if (trendChartRef.current) {
        const ctx = trendChartRef.current.getContext('2d');
        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: reportData.monthlyTrends.map(t => t.month),
              datasets: [{
                label: 'Monthly Attendance',
                data: reportData.monthlyTrends.map(t => t.attendance),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: '#ffffff' }
                }
              },
              scales: {
                x: {
                  ticks: { color: '#ffffff' },
                  grid: { color: '#374151' }
                },
                y: {
                  ticks: { color: '#ffffff' },
                  grid: { color: '#374151' }
                }
              }
            }
          });
          chartInstancesRef.current.push(chart);
        }
      }
    } catch (error) {
      console.error('Error creating charts:', error);
    }
  };

  const downloadReport = async (format: 'pdf' | 'excel') => {
    setIsGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call an API endpoint to generate the report
      const reportData = {
        format,
        dateRange: selectedDateRange,
        form: selectedForm,
        generatedAt: new Date().toISOString()
      };
      
      console.log('Generating report:', reportData);
      alert(`${format.toUpperCase()} report would be downloaded here`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const applyFilters = () => {
    if (attendanceRecords.length > 0) {
      generateReportData(attendanceRecords, students, teachers);
    }
  };

  useEffect(() => {
    const role = getAuthData('role');
    
    if (!token || (role !== 'admin' && role !== 'teacher')) {
      navigate('/admin/login');
      return;
    }

    fetchAllData();

    return () => {
      // Cleanup charts on unmount
      chartInstancesRef.current.forEach(chart => chart.destroy());
    };
  }, [navigate, token]);

  useEffect(() => {
    if (reportData) {
      createCharts();
    }
  }, [reportData]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <BarChart3 className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Loading Reports
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
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
                  onClick={() => navigate('/admin/dashboard')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                      {formatMessage({ id: "attendance.office" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
                
                <button 
                  onClick={() => navigate('/admin/students')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "attendance.home" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
                    <button 
                  onClick={() => navigate('/admin/students')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                  {formatMessage({ id: "attendance.students" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
                
                
                <button 
                  onClick={() => navigate('/admin/attendance')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                     {formatMessage({ id: "attendance.attendance" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                
                
                <button className="relative group px-4 py-2 rounded-lg bg-white/10 transition-all duration-300">
                  <span className="text-blue-400 transition-colors">
                      {formatMessage({ id: "attendance.reports" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                

                {/* Settings */}
                <button onClick={() => navigate('/admin/settings')}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <User className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>

          

                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{formatMessage({ id: "attendance.logout" })}

                  </span>
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <nav className="pb-4 border-t border-white/10 pt-4 space-y-1">
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                 {formatMessage({ id: "schoolManagement.dashboard" })}
              </button>
              <button 
                onClick={() => navigate('/admin/students')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >  {formatMessage({ id: "schoolManagement.schoolManagement" })}
              </button>
                 <button 
                onClick={() => navigate('/admin/students')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >  {formatMessage({ id: "schoolManagement.schoolManagement" })}
              </button>
              <button 
                onClick={() => navigate('/admin/attendance')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
             {formatMessage({ id: "attendance.attendance" })}
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-white/10 text-blue-400">
                 {formatMessage({ id: "schoolManagement.reports" })}
              </button>
                 <button onClick={() => navigate('/admin/settings')}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <User className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                </button>
              
              <div className="pt-2 pb-4 border-t border-white/10">
         

                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span> {formatMessage({ id: "AdminProfile.logout" })}

                  </span>
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
              {formatMessage({ id: "reports.title" })}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {formatMessage({ id: "reports.subtitle" })}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-300"> {formatMessage({ id: "reports.filters.startDate" })}</label>
                  <input
                    type="date"
                    value={selectedDateRange.startDate}
                    onChange={(e) => setSelectedDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-300"> {formatMessage({ id: "reports.filters.endDate" })}</label>
                  <input
                    type="date"
                    value={selectedDateRange.endDate}
                    onChange={(e) => setSelectedDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-300"> {formatMessage({ id: "reports.filters.form" })}</label>
                  <label className="text-sm font-medium text-blue-300">{formatMessage({ id: "reports.filters.formClass" })}</label>
                  <select
                    value={selectedForm}
                    onChange={(e) => setSelectedForm(e.target.value)}
                    className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-48"
                  >
                    <option value=""> {formatMessage({ id: "reports.filters.allForms" })}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={applyFilters}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span> {formatMessage({ id: "reports.filters.apply" })}</span>
                  <span>{formatMessage({ id: "reports.filters.applyFilters" })}</span>
                </button>

                <button
                  onClick={fetchAllData}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl text-white transition-all duration-300 flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span> {formatMessage({ id: "reports.filters.refresh" })}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
   {subscription !== "active" && subscription !== "trial" && <SubscriptionCard />}
        {/* Stats Overview */}
        {reportData && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            {[
              { 
                icon: Users, 
                label: formatMessage({ id: "reports.stats.totalStudents" }), 
                value: reportData.totalStudents.toString(), 
                change: "+12%", 
                color: "from-blue-500 to-cyan-500" 
              },
              { 
                icon: Users, 
                label: formatMessage({ id: "reports.stats.totalTeachers" }), 
                value: reportData.totalTeachers.toString(), 
                change: "+5%", 
                color: "from-green-500 to-emerald-500" 
              },
              { 
                icon: Activity, 
                label: formatMessage({ id: "reports.stats.attendanceRate" }), 
                value: `${reportData.attendanceRate.toFixed(1)}%`, 
                change: "+2.1%", 
                color: "from-purple-500 to-pink-500" 
              },
              { 
                icon: BarChart3, 
                label: formatMessage({ id: "reports.stats.totalRecords" }), 
                value: reportData.totalAttendanceRecords.toString(), 
                change: "+15%", 
                color: "from-orange-500 to-red-500" 
              }
            ].map((stat, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="text-xs text-green-400 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Charts Section */}
        {reportData && (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '600ms' }}>
            {/* Attendance Rate Chart */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                <span>{formatMessage({ id: "reports.charts.attendanceRate" })}</span>
              </h3>
              <div className="h-64 relative">
                <canvas ref={attendanceChartRef} className="max-w-full max-h-full"></canvas>
              </div>
            </div>

            {/* Form Statistics Chart */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <span>{formatMessage({ id: "reports.charts.formStatistics" })}</span>
              </h3>
              <div className="h-64 relative">
                <canvas ref={formChartRef} className="max-w-full max-h-full"></canvas>
              </div>
            </div>

            {/* Monthly Trends Chart */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>{formatMessage({ id: "reports.charts.monthlyTrends" })}</span>
              </h3>
              <div className="h-64 relative">
                <canvas ref={trendChartRef} className="max-w-full max-h-full"></canvas>
              </div>
            </div>
          </section>
        )}

        {/* Download Reports */}
        <section className="animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">{formatMessage({ id: "reports.download.title" })}</h2>
                <p className="text-gray-300">{formatMessage({ id: "reports.download.subtitle" })}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => downloadReport('pdf')}
                  disabled={isGeneratingReport}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center space-x-3"
                >
                  {isGeneratingReport ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  <span>{formatMessage({ id: "reports.download.pdf" })}</span>
                  <span>{formatMessage({ id: "reports.download.downloadPdf" })}</span>
                </button>
                
                <button
                  onClick={() => downloadReport('excel')}
                  disabled={isGeneratingReport}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center space-x-3"
                >
                  {isGeneratingReport ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span>{formatMessage({ id: "reports.download.excel" })}</span>
                  <span>{formatMessage({ id: "reports.download.downloadExcel" })}</span>
                </button>
              </div>

              {isGeneratingReport && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-300"><FormattedMessage id="reports.download.generating" defaultMessage="Generating your report... This may take a few moments." /></p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportsPage;