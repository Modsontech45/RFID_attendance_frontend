import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuthData, logout, getApiKey, API_BASE, getAdminData } from '../utils/auth';
import { 
  Shield, 
  Users,
  LogOut,
  Settings,
  Bell,
  Search,
  Filter,
  Menu,
  User,
  Mail,
  X,
  Phone,
  GraduationCap,
  Hash,
  Loader2,
  RefreshCw,
  TrendingUp,
  Activity,
  BarChart3,
  UserCheck,
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import { useTerminology } from "../utils/terminology";

interface Student {
  id: number;
  name: string;
  uid: string;
  email: string;
  telephone: string;
  form: string;
  gender: 'Male' | 'Female' | 'Other';
  student_id: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

const TeacherStudents: React.FC = () => {
  const navigate = useNavigate();
 const { formatMessage } = useIntl();
  const { locale, } = useLocalIntl();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formFilter, setFormFilter] = useState('');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = getAuthData('token');
  const apiKey = getApiKey();
  const adminData = getAdminData();
  const terminology = useTerminology(adminData);
  
  // Extract admin info with fallbacks
  const schoolName = adminData?.schoolname || adminData?.email?.split('@')[1]?.split('.')[0] || 'Synctuario Academy';
  const username = adminData?.username || adminData?.email?.split('@')[0] || 'admin_user';


  const handleLogout = () => {
    logout();
  };
    const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchStudents = async () => {
    if (!apiKey) {
      setError('You must be logged in.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Accept-Language': locale
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
      setError('');
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('You have no student yet');
      setStudents([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
          'Accept-Language': locale
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Filter students based on search and form filter
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (formFilter) {
      filtered = filtered.filter(student => 
        student.form?.toLowerCase() === formFilter.toLowerCase()
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, formFilter]);

  // Calculate statistics
  const totalStudents = filteredStudents.length;
  const maleCount = filteredStudents.filter(s => s.gender?.toLowerCase() === 'male').length;
  const femaleCount = filteredStudents.filter(s => s.gender?.toLowerCase() === 'female').length;
  const malePercent = totalStudents > 0 ? ((maleCount / totalStudents) * 100).toFixed(1) : '0';
  const femalePercent = totalStudents > 0 ? ((femaleCount / totalStudents) * 100).toFixed(1) : '0';

  // Check authentication on component mount
  useEffect(() => {
    const role = getAuthData('role');
    
    if (!token || role !== 'teacher') {
      navigate('/teacher/login');
      return;
    }

    const initializeData = async () => {
      await Promise.all([fetchStudents(), fetchCategories()]);
      setIsLoading(false);
    };

    initializeData();
  }, [navigate, token]);

  // Show loading state while translations are loading
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="text-xl text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
       <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
       <button className="relative group px-4 py-2 rounded-lg bg-white/10 transition-all duration-300">
                <span className="text-green-400 transition-colors flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{terminology.studentPlural}

                  </span>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
              </button>
              
              <button 
                onClick={() => navigate('/teacher/attendance')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>
                        {formatMessage({ id: "students.navigation.attendance" })}
                  </span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

         

              <button 
                onClick={() => navigate('/docs')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Docs</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <button 
                onClick={() => navigate('/teacher/profile')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{formatMessage({ id: "students.navigation.profile" })}</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <div className="flex items-center space-x-4">
             
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{formatMessage({ id: "students.navigation.logout" })}</span>
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
            <nav className="pb-4 border-t border-white/10 pt-4 space-y-2">
              <button className="relative group px-4 py-2 rounded-lg bg-white/10 transition-all duration-300">
                <span className="text-green-400 transition-colors flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  {formatMessage({ id: "students.navigation.students" })}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
              </button>
              
              <button 
                onClick={() => navigate('/teacher/attendance')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>     {formatMessage({ id: "students.navigation.attendance" })}

                  </span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>


              <button 
                onClick={() => navigate('/docs')}
               className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Docs</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <button 
                onClick={() => navigate('/teacher/profile')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>
                     {formatMessage({ id: "students.navigation.profile" })}
                  </span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

              <div className="flex items-center space-x-4">
             
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>
                    {formatMessage({ id: "students.navigation.logout" })}
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
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent animate-gradient">
              {terminology.student} Directory
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            View and monitor all registered {terminology.studentPlural.toLowerCase()} in your institution
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {[
            { icon: Users, label: `Total ${terminology.studentPlural}`, value: totalStudents.toString(), change: "+12%", color: "from-green-500 to-emerald-500" },
            { icon: UserCheck, label: `Male ${terminology.studentPlural}`, value: `${maleCount} (${malePercent}%)`, change: "+5%", color: "from-blue-500 to-cyan-500" },
            { icon: Activity, label: `Female ${terminology.studentPlural}`, value: `${femaleCount} (${femalePercent}%)`, change: "+2%", color: "from-purple-500 to-pink-500" },
            { icon: BarChart3, label: formatMessage({ id: "students.stats.formsClasses" }), value: categories.length.toString(), change: "+1%", color: "from-orange-500 to-red-500" }
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

        {/* Filters and Search */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="space-y-2">
                
                  <select
                    value={formFilter}
                    onChange={(e) => setFormFilter(e.target.value)}
                    className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 w-48"
                  >
                    <option value="">{formatMessage({ id: "students.filters.allForms" })}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
               
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={formatMessage({ id: "students.filters.searchByName" })}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl text-white transition-all duration-300 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>{formatMessage({ id: "students.filters.export" })}</span>
                </button>

                <button
                  onClick={() => {
                    setError('');
                    setIsLoading(true);
                    fetchStudents().finally(() => setIsLoading(false));
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{formatMessage({ id: "students.filters.refresh" })}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Students Table */}
        <section className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
                <span className="text-gray-300 text-lg">{formatMessage({ id: "students.loading" })}</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
              <button
                onClick={() => {
                  setError('');
                  setIsLoading(true);
                  fetchStudents().finally(() => setIsLoading(false));
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{formatMessage({ id: "students.errors.tryAgain" })}</span>
              </button>
            </div>
          )}

          {/* Students Table */}
          {!isLoading && !error && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-green-800/50 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{formatMessage({ id: "students.table.headers.name" })}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4" />
                          <span>{formatMessage({ id: "students.table.headers.uid" })}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{formatMessage({ id: "students.table.headers.email" })}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{formatMessage({ id: "students.table.headers.telephone" })}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4" />
                          <span>{formatMessage({ id: "students.table.headers.form" })}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{formatMessage({ id: "students.table.headers.gender" })}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredStudents.map((student, index) => (
                      <tr 
                        key={student.id} 
                        className="hover:bg-white/5 transition-colors duration-200 animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                        <td className="px-6 py-4">
                          <code className="bg-black/50 text-green-400 px-2 py-1 rounded text-sm">
                            {student.uid}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{student.email}</td>
                        <td className="px-6 py-4 text-gray-300">{student.telephone}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            {student.form}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            student.gender === 'Male' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : student.gender === 'Female'
                              ? 'bg-pink-500/20 text-pink-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {student.gender || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredStudents.length === 0 && !isLoading && !error && (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{formatMessage({ id: "students.errors.noMembersFound" })}</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherStudents;