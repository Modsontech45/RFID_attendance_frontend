import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { postData, API_BASE } from '../utils/auth';
import { 
  Shield, 
  ArrowLeft, 
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, currentLanguage, changeLanguage, loading } = useTranslation();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | ''>('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    setToken(tokenFromUrl);
    
    if (!tokenFromUrl) {
      setMessage('Invalid reset link. Please check your email or request a new one.');
      setMessageType('error');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('Invalid reset link. Please check your email or request a new one.');
      setMessageType('error');
      return;
    }

    if (!formData.newPassword) {
      setMessage('New password is required');
      setMessageType('error');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await postData(`${API_BASE}/reset/reset-password/${encodeURIComponent(token)}`, {
        newPassword: formData.newPassword
      });

      if (result.message?.toLowerCase().includes("expired")) {
        setMessage('❌ This reset link has expired. Please request a new one.');
        setMessageType('error');
        setTimeout(() => {
          navigate('/admin/forgot-password');
        }, 4000);
        return;
      }

      if (result.message?.toLowerCase().includes("malformed")) {
        setMessage('❌ Invalid reset link. Please check your email or request a new one.');
        setMessageType('error');
        return;
      }

      setMessage(result.message || '');
      setMessageType(result.success ? 'success' : 'warning');

      if (result.success) {
        setTimeout(() => {
          navigate('/admin/reset-success');
        }, 3000);
      }

    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('❌ Server error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/forgot-password');
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

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getMessageStyles = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      default:
        return '';
    }
  };

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
          {/* Reset Form */}
          <div className="bg-green-900/20 backdrop-blur-md border border-green-500/50 p-8 rounded-2xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-400">
                {t('resetPassword.title')}
              </h1>
              <p className="text-green-200 text-sm">
                {t('resetPassword.subtitle')}
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className={`border rounded-lg p-3 text-sm flex items-center space-x-2 ${getMessageStyles()}`}>
                {getMessageIcon()}
                <span>{message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder={t('resetPassword.new_password_placeholder') || 'New Password'}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-green-400/50 rounded-lg bg-black/50 text-white placeholder-green-300/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t('resetPassword.confirm_password_placeholder') || 'Confirm Password'}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-green-400/50 rounded-lg bg-black/50 text-white placeholder-green-300/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>{t('resetPassword.reset_button')}</span>
                )}
              </button>
            </form>

            {/* Go Back Button */}
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full flex items-center justify-center space-x-2 text-white/70 hover:text-white transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Reset Request</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;