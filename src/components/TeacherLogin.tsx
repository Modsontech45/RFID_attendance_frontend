import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postData, API_BASE, setAuthData } from '../utils/auth';
import { 
  Shield, 
  ArrowLeft, 
  Loader2,
  Mail,
  Users
} from 'lucide-react';
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import LanguageSwitcher from "./LanguageSwitcher";

const TeacherLogin: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
   const { locale } = useLocalIntl();
  
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = formatMessage({ id: "validation.emailRequired", defaultMessage: "Email is required" });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = formatMessage({ id: "validation.emailInvalid", defaultMessage: "Email is invalid" });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await postData(`${API_BASE}/teachers/login`, formData, {
        'Accept-Language': locale || 'en'
      });

      if (result.token) {
        setAuthData('token', result.token);
        setAuthData('role', 'teacher');

        if (result.teacher?.api_key) {
          setAuthData('api_key', result.teacher.api_key);
        }

        if (result.admin) {
          setAuthData('admin_data', JSON.stringify(result.admin));
        }

        console.log('Teacher login successful, redirecting to dashboard...');
        navigate('/teacher/students');

      } else {
        setErrors({ general: result.message || formatMessage({ id: "login.teacher.loginFailed", defaultMessage: "Login failed. Please try again." }) });
      }

    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ general: error.message || formatMessage({ id: "login.teacher.unexpectedError", defaultMessage: "An unexpected error occurred." }) });
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="bg-black text-white min-h-screen">

      {/* Header */}
      <header className="bg-black border-b border-green-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                <FormattedMessage id="home.header.title" defaultMessage="Synctuario" />
              </span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-black border-2 border-green-600 p-8 rounded-2xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-400">
                <FormattedMessage id="login.teacherlogin.title" defaultMessage="Staff Login" />
              </h1>
              <p className="text-white text-sm">
                <FormattedMessage id="login.teacherlogin.subtitle" defaultMessage="Enter your email address to access your account" />
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-900 border border-red-600 rounded-lg p-3 text-red-300 text-sm">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={formatMessage({ id: "login.teacherlogin.email_placeholder", defaultMessage: "Email / e-mail" })}
                  required
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg bg-black/50 text-white placeholder-green-300/70 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-600 focus:ring-red-600' 
                      : 'border-green-600 focus:ring-green-600'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span><FormattedMessage id="login.teacherlogin.loading" defaultMessage="Loading..." /></span>
                </>
              ) : (
                <span><FormattedMessage id="login.teacherlogin.login_button" defaultMessage="Login" /></span>
              )}
            </button>

            {/* Info Text */}
            <div className="bg-green-900 border border-green-600 rounded-lg p-4 text-center">
              <p className="text-white text-sm">
                <FormattedMessage id="login.teacherlogin.info_text" defaultMessage="Only registered staff members can access this portal. Contact your administrator if you need assistance." />
              </p>
            </div>

            {/* Go Back Button */}
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span><FormattedMessage id="login.teacher.back" defaultMessage="Back to Home" /></span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TeacherLogin;