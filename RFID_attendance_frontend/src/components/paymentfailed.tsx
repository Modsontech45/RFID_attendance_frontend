import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import {
  Shield,
  CreditCard,
  ArrowLeft,
  XCircle,
  User,
} from 'lucide-react';

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, currentLanguage, changeLanguage, loading } = useTranslation();

  const [paymentDetails, setPaymentDetails] = useState({
    reference: '',
    plan: '',
    amount: '',
    email: ''
  });

  useEffect(() => {
    const reference = searchParams.get('reference') || '';
    const plan = searchParams.get('plan') || '';
    const amount = searchParams.get('amount') || '';
    const email = searchParams.get('email') || '';

    setPaymentDetails({ reference, plan, amount, email });
  }, [searchParams]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleRetry = () => {
    navigate('/pricing');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="text-xl text-gray-300">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white min-h-screen relative overflow-hidden">
      <header className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
              Synctuario
            </span>
          </div>
          <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            disabled={loading}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
          </select>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-lg">
          <div className="bg-black/40 backdrop-blur-md border-2 border-red-500/50 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                ❌ Payment Failed
              </h1>
            </div>

            <div className="flex justify-center">
              <XCircle className="w-16 h-16 text-red-400 animate-pulse" />
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-left space-y-3">
              <h3 className="text-lg font-semibold text-red-300 mb-3">Transaction Info</h3>

              {paymentDetails.plan && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Plan:</span>
                  <span className="text-red-400 font-medium">{paymentDetails.plan}</span>
                </div>
              )}

              {paymentDetails.amount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-red-400 font-medium">GHS {(parseInt(paymentDetails.amount) / 100).toFixed(2)}</span>
                </div>
              )}

              {paymentDetails.reference && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Reference:</span>
                  <span className="text-red-400 font-medium text-sm">{paymentDetails.reference}</span>
                </div>
              )}

              {paymentDetails.email && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-red-400 font-medium text-sm">{paymentDetails.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-red-300 text-lg">
                Oops! Your payment could not be processed.
              </p>
              <p className="text-gray-400">
                Please try again or use a different payment method.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>

              <button
                onClick={handleRetry}
                className="w-full flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 transition-colors py-3 border border-red-500/50 rounded-lg hover:bg-red-500/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentFailed;
