import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';
import LanguageSwitcher from "./LanguageSwitcher";

const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { locale, setLocale } = useLocalIntl();

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="text-xl text-gray-300">
            <FormattedMessage id="common.loading" defaultMessage="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen relative overflow-hidden">
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                <FormattedMessage id="app.name" defaultMessage="Synctuario" />
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
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
                <FormattedMessage id="resetSuccess.title" defaultMessage="Password Reset Successful!" />
              </h1>
              <p className="text-green-200 text-lg">
                <FormattedMessage id="resetSuccess.message" defaultMessage="Your password has been updated. You can now log in with your new password." />
              </p>
            </div>

            <button
              onClick={handleLoginClick}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <span><FormattedMessage id="resetSuccess.loginButton" defaultMessage="Login" /></span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-300 text-sm">
                <FormattedMessage id="resetSuccess.additionalInfo" defaultMessage="Keep your new password secure and don't share it with anyone." />
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetSuccess;
