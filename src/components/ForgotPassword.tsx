import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postData, API_BASE } from "../utils/auth";
import {
  Shield,
  ArrowLeft,
  Loader2,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import LanguageSwitcher from "./LanguageSwitcher";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { locale } = useLocalIntl();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "warning" | ""
  >("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage(formatMessage({ id: "validation.emailRequired", defaultMessage: "Email is required" }));
      setMessageType("error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage(formatMessage({ id: "validation.emailInvalid", defaultMessage: "Please enter a valid email address" }));
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await postData(`${API_BASE}/reset/request-reset`, {
        email,
      });

      setMessage(result.message);
      setMessageType(result.success ? "success" : "warning");

      if (result.success) {
        // Redirect after a short delay
        setTimeout(() => {
          // For now, just show success - you can add a success page later
          setMessage(
            formatMessage({ id: "forgotPassword.resetLinkSent", defaultMessage: "Reset link sent! Check your email and follow the instructions." })
          );
        }, 3000);
      }
    } catch (error) {
      console.error("Reset request error:", error);
      setMessage(
        formatMessage({ id: "forgotPassword.serverError", defaultMessage: "Could not contact server. Check your internet or try again later." })
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/login");
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getMessageStyles = () => {
    switch (messageType) {
      case "success":
        return "bg-green-500/20 border-green-500/50 text-green-300";
      case "warning":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      case "error":
        return "bg-red-500/20 border-red-500/50 text-red-300";
      default:
        return "";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
          {/* Reset Form */}
          <div className="bg-green-900/20 backdrop-blur-md border border-green-500/50 p-8 rounded-2xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-400">
                <FormattedMessage id="forgotPassword.title" defaultMessage="Reset Your Password" />
              </h1>
              <p className="text-green-200 text-sm">
                <FormattedMessage id="forgotPassword.subtitle" />
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`border rounded-lg p-3 text-sm flex items-center space-x-2 ${getMessageStyles()}`}
              >
                {getMessageIcon()}
                <span>{message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={formatMessage({ id: "forgotPassword.emailPlaceholder", defaultMessage: "Your Email" })}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-green-400/50 rounded-lg bg-black/50 text-white placeholder-green-300/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span><FormattedMessage id="forgotPassword.sending" defaultMessage="Sending..." /></span>
                  </>
                ) : (
                  <span>
                    <FormattedMessage id="forgotPassword.sendButton" defaultMessage="Send Reset Link" />
                  </span>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="space-y-3 text-center text-sm">
              <p className="text-green-300">
                <FormattedMessage id="forgotPassword.rememberPassword" defaultMessage="Remember your password?" />{" "}
                <Link
                  to="/admin/login"
                  className="text-green-400 hover:text-green-300 hover:underline transition-colors font-medium"
                >
                  <FormattedMessage id="forgotPassword.backToLogin" defaultMessage="Back to Login" />
                </Link>
              </p>
            </div>

            {/* Go Back Button */}
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full flex items-center justify-center space-x-2 text-white/70 hover:text-white transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                <FormattedMessage id="forgotPassword.backToLogin" defaultMessage="Back to Login" />
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
