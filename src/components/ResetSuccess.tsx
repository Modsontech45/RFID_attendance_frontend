import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';
import Icon from "./icon.png";
const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage: t } = useIntl();
  const { locale, setLocale } = useLocalIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false); // for language selector
  const currentLanguage = locale || "en";

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLoading(true);
    setLocale(newLang);
    setTimeout(() => setLoading(false), 300);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
           <div className="flex items-center justify-center mb-6">
            {/* Bigger Logo */}
            <img src={Icon} alt="App Logo" className="h-32 w-32" />
          </div>
          <div className="text-xl text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-primary-dark to-primary-dark text-white min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center mb-0">
            {/* Bigger Logo */}
            <img src={Icon} alt="App Logo" className="h-24 w-24" />
          </div>
            
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={currentLanguage}
                onChange={handleLanguageChange}
                disabled={loading}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en" className="text-gray-900">🇺🇸 {t({ id: 'home.english' })}</option>
                <option value="fr" className="text-gray-900">🇫🇷 {t({ id: 'home.french' })}</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <div className="bg-green-900/20 backdrop-blur-md border border-green-500/50 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-green-400">
                {t({ id: 'resetSuccess.title' })}
              </h1>
              <p className="text-green-200 text-lg">
                {t({ id: 'resetSuccess.message' })}
              </p>
            </div>

            <button
              onClick={handleLoginClick}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <span>{t({ id: 'resetSuccess.loginButton' })}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-300 text-sm">
                {t({ id: 'resetSuccess.additionalInfo' })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetSuccess;
