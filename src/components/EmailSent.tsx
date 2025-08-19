import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import { 
  Shield, 
  Mail,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import LanguageSwitcher from "./LanguageSwitcher";

const EmailSent: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { locale } = useLocalIntl();
  const [isLoading, setIsLoading] = useState(false);

  const handleBackToSignup = () => {
    navigate('/admin/signup');
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
                <FormattedMessage id="home.header.title" defaultMessage="Synctuario" />
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
          {/* Email Sent Card */}
          <div className="bg-black/40 backdrop-blur-md border-2 border-green-500/50 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                📧 <FormattedMessage id="emailSent.title" defaultMessage="Check your inbox" />
              </h1>
            </div>

            {/* Message */}
            <div className="space-y-4">
              <p className="text-green-300 text-lg">
                <FormattedMessage id="emailSent.message1" defaultMessage="We've sent a verification link to your email." />
              </p>
              <p className="text-green-300 text-lg">
                <FormattedMessage id="emailSent.message2" defaultMessage="Please confirm to continue." />
              </p>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>

            {/* Back Button */}
            <button
              onClick={handleBackToSignup}
              className="w-full flex items-center justify-center space-x-2 text-green-400 hover:text-green-300 transition-colors py-3 border border-green-500/50 rounded-lg hover:bg-green-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span><FormattedMessage id="emailSent.backToSignup" defaultMessage="Back to Signup" /></span>
            </button>

            {/* Additional Info */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-300 text-sm">
                <FormattedMessage id="emailSent.additionalInfo" defaultMessage="Didn't receive the email? Check your spam folder or try signing up again." />
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailSent;
