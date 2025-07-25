import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuthData, getApiKey, getAdminData, API_BASE } from '../utils/auth';
import {
  Shield,
  ArrowLeft,
  Users,
  Loader2,
  Search,
  Filter,
  Plus,
  Mail,
  Calendar,
  Eye,
  Edit,
  MoreVertical,
  UserCheck,
  Award,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  Grid,
  List,
  Download,
  RefreshCw
} from 'lucide-react';
import {  useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  bio?: string;
  picture?: string;
  created_at?: string;
  status?: 'active' | 'inactive';
  department?: string;
}

const TeachersList: React.FC = () => {
  const navigate = useNavigate();
const { formatMessage } = useIntl();
const { locale } = useLocalIntl();
 
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoaded, setIsLoaded] = useState(false);

  const token = getAuthData('token');
  const apiKey = getApiKey();
  const adminData = getAdminData();

  // Extract admin info with fallbacks
  const schoolName = adminData?.schoolname || adminData?.email?.split('@')[1]?.split('.')[0] || 'Synctuario Academy';
  const username = adminData?.username || adminData?.email?.split('@')[0] || 'admin_user';

  // const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   changeLanguage(e.target.value);
  // };

  const handleGoHome = () => {
    navigate('/admin/dashboard');
  };

  const handleTeacherClick = (teacherId: number) => {
    navigate(`/admin/teacher/${teacherId}`);
  };

  const handleAddTeacher = () => {
    navigate('/admin/teachers/add');
  };

  useEffect(() => {
    const role = getAuthData('role');

    if (!token || role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    const fetchTeachers = async () => {
      if (!token || !apiKey) {
        setError('You must be logged in as an admin.');
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/teachers/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': apiKey
          }
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Error loading teachers');
          return;
        }

        if (data.teachers && data.teachers.length === 0) {
          setError('No teachers found.');
          return;
        }

        setTeachers(data.teachers || []);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setError('Something went wrong.');
      }
    };

    fetchTeachers().finally(() => {
      setIsLoading(false);
      setTimeout(() => setIsLoaded(true), 300);
    });
  }, [navigate, token, apiKey]);

  const truncateBio = (bio: string, maxLength: number = 100) => {
    if (!bio) return 'No bio available';
    return bio.length > maxLength ? bio.slice(0, maxLength) + '... Read more' : bio;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading|| !isLoaded) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <Users className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Loading Teachers
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
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

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
          
{/*            
              <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button> */}

              {/* Settings */}
              {/* <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button> */}

          
              {/* <select
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-white/20 transition-all duration-300"
              >
                <option value="en" className="text-gray-900">🇺🇸 {t('home.english')}</option>
                <option value="fr" className="text-gray-900">🇫🇷 {t('home.french')}</option>
              </select> */}

              <button
                onClick={handleGoHome}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{formatMessage({ id: "teachersList.goHome" })}</span>
              </button>
            </div>
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
              {formatMessage({ id: "teachersList.yourStaff" })}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {formatMessage({ id: "teachersList.subtitle" })}
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {[
            { icon: Users, label:  formatMessage({ id: "teachersList.stats.totalTeachers" }), value: teachers.length.toString(), change: "+3%", color: "from-green-500 to-emerald-500" },
            { icon: UserCheck, label: formatMessage({ id: "teachersList.stats.activeTeachers" }), value: Math.floor(teachers.length * 0.85).toString(), change: "+5%", color: "from-blue-500 to-cyan-500" },
            { icon: Award, label: formatMessage({ id: "teachersList.stats.TopPerforming" }), value: Math.floor(teachers.length * 0.2).toString(), change: "+12%", color: "from-purple-500 to-pink-500" },
            { icon: Clock, label: formatMessage({ id: "teachersList.stats.avgExperience" }), value: "4.2y", change: "+0.3y", color: "from-orange-500 to-red-500" }
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

        {/* Controls */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={formatMessage({ id: "teachersList.searchTeachers" })}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 w-64"
                  />
                </div>
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl text-white transition-all duration-300 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                
                </button>
              </div>

              {/* View Mode and Actions */}
              <div className="flex items-center space-x-4">
                <div className="flex bg-black/50 rounded-xl p-1 border border-white/20">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl text-white transition-all duration-300 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                
                </button>

                <button
                  onClick={handleAddTeacher}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{formatMessage({ id: "teachersList.addTeacher" })}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Teachers Content */}
        <section className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
                <span className="text-gray-300 text-lg">{t('teachersList.loading')}</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">{formatMessage({ id: "teachersList.errorLoading" })}</h3>
              <p className="text-red-300 mb-6">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  setIsLoading(true);
                  fetchTeachers().finally(() => setIsLoading(false));
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('teachersList.tryAgain')}</span>
              </button>
            </div>
          )}

          {/* Teachers Grid/List */}
          {!isLoading && !error && (
            <div className="space-y-6">
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{formatMessage({ id: "teachersList.noTeachers" })}</h3>
                  <p className="text-gray-400 mb-8">{formatMessage({ id: "teachersList.addTeacher" })}</p>
                  <button
                    onClick={handleAddTeacher}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{formatMessage({ id: "teachersList.addYourFirstTeacher" })}</span>
                  </button>
                </div>
              ) : (
                <div className={`${
                  viewMode === 'grid'
                    ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }`}>
                  {filteredTeachers.map((teacher, index) => (
                    <div
                      key={teacher.id}
                      onClick={() => handleTeacherClick(teacher.id)}
                      className={`group cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-slide-up ${
                        viewMode === 'list' ? 'flex items-center space-x-6' : 'text-center'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Profile Picture */}
                      <div className={`relative ${viewMode === 'list' ? 'flex-shrink-0' : 'mx-auto mb-4'}`}>
                        <img
                          src={teacher.picture || "https://via.placeholder.com/120"}
                          alt={teacher.full_name || `${formatMessage({ id: "teachersList.unnamedTeacher" })}`}
                          className={`${
                            viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20'
                          } rounded-full object-cover border-3 border-green-500/50 group-hover:border-green-400 transition-all duration-300 shadow-lg`}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      {/* Teacher Info */}
                      <div className={`flex-1 ${viewMode === 'list' ? 'text-left' : ''}`}>
                        <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300 mb-2">
                          {teacher.full_name || `${formatMessage({ id: "teachersList.unnamedTeacher" })}`}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-gray-300 justify-center">
                            <Mail className="w-4 h-4 text-green-400" />
                            <span className="text-sm">{teacher.email}</span>
                          </div>

                          {teacher.department && (
                            <div className="flex items-center space-x-2 text-gray-300 justify-center">
                              <Award className="w-4 h-4 text-blue-400" />
                              <span className="text-sm">{teacher.department}</span>
                            </div>
                          )}

                          {teacher.created_at && (
                            <div className="flex items-center space-x-2 text-gray-400 justify-center">
                              <Calendar className="w-4 h-4" />
                              <span className="text-xs">{formatMessage({ id: "teachersList.joined" })}{formatDate(teacher.created_at)}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {truncateBio(teacher.bio || `${formatMessage({ id: "teachersList.nobio" })}`)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTeacherClick(teacher.id);
                            }}
                            className="bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{formatMessage({ id: "teachersList.view" })}</span>
                          </button>

                        
                       
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeachersList;