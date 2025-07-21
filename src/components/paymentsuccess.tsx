import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { 
  Shield, 
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Download,
  User
} from 'lucide-react';

const PaymentSuccess: React.FC = () => {
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
    // Extract payment details from URL params
    const reference = searchParams.get('reference') || '';
    const plan = searchParams.get('plan') || '';
    const amount = searchParams.get('amount') || '';
    const email = searchParams.get('email') || '';
    
    setPaymentDetails({ reference, plan, amount, email });
  }, [searchParams]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleDownloadReceipt = () => {
    // Logic to download payment receipt
    console.log('Downloading receipt for:', paymentDetails.reference);
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
                <option value="en" className="text-gray-900">🇺🇸 English</option>
                <option value="fr" className="text-gray-900">🇫🇷 Français</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-lg">
          {/* Payment Success Card */}
          <div className="bg-black/40 backdrop-blur-md border-2 border-green-500/50 p-8 rounded-2xl shadow-2xl text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                🎉 Payment Successful!
              </h1>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-400 animate-pulse" />
            </div>

            {/* Payment Details */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-left space-y-3">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Payment Details</h3>
              
              {paymentDetails.plan && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Plan:</span>
                  <span className="text-green-400 font-medium">{paymentDetails.plan}</span>
                </div>
              )}
              
              {paymentDetails.amount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-green-400 font-medium">GHS {(parseInt(paymentDetails.amount) / 100).toFixed(2)}</span>
                </div>
              )}
              
              {paymentDetails.reference && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Reference:</span>
                  <span className="text-green-400 font-medium text-sm">{paymentDetails.reference}</span>
                </div>
              )}
              
              {paymentDetails.email && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-green-400 font-medium text-sm">{paymentDetails.email}</span>
                </div>
              )}
            </div>

            {/* Success Messages */}
            <div className="space-y-4">
              <p className="text-green-300 text-lg">
                Your subscription has been activated successfully!
              </p>
              <p className="text-gray-400">
                You can now access all features of your selected plan.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBackToDashboard}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>

              <button
                onClick={handleDownloadReceipt}
                className="w-full flex items-center justify-center space-x-2 text-green-400 hover:text-green-300 transition-colors py-3 border border-green-500/50 rounded-lg hover:bg-green-500/10"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>

              <button
                onClick={() => navigate('/pricing')}
                className="w-full flex items-center justify-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Pricing</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <p className="text-blue-300 text-sm">
                A confirmation email has been sent to your registered email address with your subscription details.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;