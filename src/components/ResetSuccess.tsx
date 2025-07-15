import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { 
  Shield, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage, changeLanguage, loading } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  // Show loading state while translations are loading
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="text-xl text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Synctuario
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={currentLanguage}
                onChange={handleLanguageChange}
                disabled={loading}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en" className="text-gray-900">🇺🇸 {t('home.english')}</option>
                <option value="fr" className="text-gray-900">🇫🇷 {t('home.french')}</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          {/* Success Card */}
          <div className="bg-green-900/20 backdrop-blur-md border border-green-500/50 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-green-400">
                {t('resetSuccess.title')}
              </h1>
              <p className="text-green-200 text-lg">
                {t('resetSuccess.message')}
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <span>{t('resetSuccess.loginButton')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Additional Info */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-300 text-sm">
                {t('resetSuccess.additionalInfo')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetSuccess;