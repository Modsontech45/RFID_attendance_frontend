import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { getAuthData, getApiKey, getAdminData, API_BASE } from '../utils/auth';
import { 
  Shield, 
  ArrowLeft, 
  Trash2,
  Loader2,
  Building,
  AlertTriangle,
  Settings,
  Bell,
  Users,
  User,
  TrendingUp,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import Icon from "./icon.png";
interface Category {
  id: number;
  name: string;
}

const CategoriesManagement: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage, changeLanguage, loading } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  const token = getAuthData('token');
  const apiKey = getApiKey();
  const adminData = getAdminData();
  
  // Extract admin info with fallbacks
  const schoolName = adminData?.schoolname || adminData?.email?.split('@')[1]?.split('.')[0] || 'Synctuario Academy';
  const username = adminData?.username || adminData?.email?.split('@')[0] || 'admin_user';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleGoHome = () => {
    navigate('/admin/dashboard');
  };

  const fetchCategories = async () => {
    if (!apiKey) {
      setError('You must be logged in as an admin.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/categories`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Accept-Language': currentLanguage
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
      setError('');
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Remember you have users with this category')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Accept-Language': currentLanguage
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      alert('Category deleted.');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert('Delete failed: ' + error.message);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const role = getAuthData('role');
    
    if (!token || role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchCategories().finally(() => {
      setTimeout(() => setIsLoaded(true), 300);
    });
  }, [navigate, token, currentLanguage]);

  // Show loading state while translations are loading
  if (loading || !isLoaded) {
    return (
      <div className="bg-primary text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            {/* Bigger Logo */}
            <img src={Icon} alt="App Logo" className="h-32 w-32" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold bg-white bg-clip-text text-transparent">
              Loading Categories
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-button-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-button-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-button-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-primary-dark to-primary-dark text-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/30 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                      <div className="flex items-center justify-center mb-0">
            {/* Bigger Logo */}
            <img src={Icon} alt="App Logo" className="h-24 w-24" />
          </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-button-green rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-bold bg-white bg-clip-text text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {/* <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button> */}

              {/* Settings */}
              {/* <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button> */}

              {/* Language Selector */}
              {/* <select 
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-white/20 transition-all duration-300"
              >
                <option value="en" className="text-gray-900">🇺🇸 {t('home.english')}</option>
                <option value="fr" className="text-gray-900">🇫🇷 {t('home.french')}</option>
              </select> */}
              
              <button
                onClick={handleGoHome}
                className="bg-transparent border border-white/20 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Home</span>
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
              <span className="bg-button-green bg-clip-text text-transparent animate-gradient">
                Manage Categories
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Organize your departments and forms with comprehensive category management
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {[
            { icon: Building, label: "Total Categories", value: categories.length.toString(), change: "+2", color: "from-button-green to-blue" },
            { icon: Users, label: "Active Departments", value: categories.length.toString(), change: "+1", color: "from-button-green to-blue" },
            { icon: Activity, label: "In Use", value: Math.floor(categories.length * 0.8).toString(), change: "+3", color: "from-button-green to-blue" },
            { icon: BarChart3, label: "Total Forms", value: categories.length.toString(), change: "+1", color: "from-button-green to-blue" }
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
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Department Categories</h2>
                <p className="text-gray-300">Manage your organizational departments and class forms</p>
              </div>

              <button
                onClick={() => {
                  setError('');
                  setIsLoading(true);
                  fetchCategories();
                }}
                className="bg-button-green hover:bg-button-green/80 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
                <span className="text-gray-300 text-lg">Loading categories...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Categories</h3>
              <p className="text-red-300 mb-6">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  setIsLoading(true);
                  fetchCategories();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Categories Grid */}
          {!isLoading && !error && (
            <div className="space-y-6">
              {categories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-button-green rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                    <Building className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Categories Found</h3>
                  <p className="text-gray-400">Create your first department category to get started</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.map((category, index) => (
                    <div
                      key={category.id}
                      className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-button-green rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-2">
                            {category.name}
                          </h3>
                          <p className="text-gray-400 text-sm">Department Category</p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border border-red-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
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

export default CategoriesManagement;