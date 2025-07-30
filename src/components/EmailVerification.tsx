import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import { API_BASE } from '../utils/auth';
import {
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  ArrowRight
} from 'lucide-react';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { formatMessage } = useIntl();
  const { locale } = useLocalIntl();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        setMessage(formatMessage({ id: 'emailVerification.invalidLink' }));
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/admin/verify/${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
          setMessage(data.message || formatMessage({ id: 'emailVerification.successDefault' }));
        } else {
          setVerificationStatus('error');
          setMessage(data.message || formatMessage({ id: 'emailVerification.tokenExpired' }));
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage(formatMessage({ id: 'emailVerification.serverError' }));
      }
    };

    verifyEmail();
  }, [searchParams, formatMessage]);

  if (isLoading) {
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
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

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
          </div>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-md border-2 border-green-500/50 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {formatMessage({ id: 'emailVerification.title' })}
              </h1>
            </div>

            <div className="space-y-4">
              {verificationStatus === 'loading' && (
                <>
                  <div className="flex justify-center">
                    <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
                  </div>
                  <p className="text-green-300 text-lg">
                    {formatMessage({ id: 'emailVerification.verifying' })}
                  </p>
                </>
              )}

              {verificationStatus === 'success' && (
                <>
                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </div>
                  <p className="text-green-300 text-lg font-semibold">
                    ✅ {message}
                  </p>
                  <button
                    onClick={handleLoginClick}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                  >
                    <span>{formatMessage({ id: 'emailVerification.goToLogin' })}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {verificationStatus === 'error' && (
                <>
                  <div className="flex justify-center">
                    <XCircle className="w-16 h-16 text-red-400" />
                  </div>
                  <p className="text-red-300 text-lg font-semibold">
                    ❌ {message}
                  </p>
                  <button
                    onClick={handleLoginClick}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <span>{formatMessage({ id: 'emailVerification.backToLogin' })}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {verificationStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-green-300 text-sm">
                  {formatMessage({ id: 'emailVerification.successInfo' })}
                </p>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-300 text-sm">
                  {formatMessage({ id: 'emailVerification.errorInfo' })}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailVerification;
