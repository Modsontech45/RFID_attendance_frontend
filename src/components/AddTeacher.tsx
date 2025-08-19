import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAuthData,
  getApiKey,
  postData,
  API_BASE,
  getAdminData,
} from "../utils/auth";
import {
  Shield,
  ArrowLeft,
  Loader2,
  Mail,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  Users,
  Plus,
  Send,
} from "lucide-react";
import { useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
import { useTerminology } from "../utils/terminology";

const AddTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { locale } = useLocalIntl();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isLoaded, setIsLoaded] = useState(false);

  const token = getAuthData("token");
  const apiKey = getApiKey();
  const adminData = getAdminData();
  const terminology = useTerminology(adminData);

  // Extract admin info with fallbacks
  const schoolName =
    adminData?.schoolname ||
    adminData?.email?.split("@")[1]?.split(".")[0] ||
    "Synctuario Academy";
  const username =
    adminData?.username || adminData?.email?.split("@")[0] || "admin_user";

  const handleGoBack = () => {
    navigate("/admin/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Email is required");
      setMessageType("error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await postData(
        `${API_BASE}/teachers/add`,
        {
          email: email.trim(),
        },
        {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
          "Accept-Language": locale || "en",
        }
      );

      if (result.message && !result.error) {
        setMessage(result.message || "Teacher added successfully!");
        setMessageType("success");
        setEmail("");

        // Redirect to teachers list after success
        setTimeout(() => {
          navigate("/admin/teachers");
        }, 2000);
      } else {
        setMessage(result.error || result.message || "Failed to add teacher.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Server error. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const role = getAuthData("role");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    // Add a small delay for smooth loading animation
    setTimeout(() => setIsLoaded(true), 300);
  }, [navigate, token]);

  // Show loading state while translations are loading
  if (isLoading || !isLoaded) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <UserPlus className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Loading Add Teacher
            </div>
            <div className="flex justify-center space-x-1">
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {/* <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>

          
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button> */}

              <button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{formatMessage({ id: "addTeacher.dashboard" })}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Add Teacher Form */}
          <div className="bg-black/40 backdrop-blur-md border-2 border-green-500/50 p-8 rounded-2xl shadow-2xl space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {formatMessage({ id: "addTeacher.title" })}
              </h1>
              <p className="text-green-200 text-sm">
                {formatMessage({ id: "addTeacher.subtitle" })}
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`border rounded-lg p-4 text-sm flex items-center space-x-3 animate-fade-in ${
                  messageType === "success"
                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                    : "bg-red-500/20 border-red-500/50 text-red-300"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-300">
                  {formatMessage({ id: "addTeacher.emailLabel" })}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      formatMessage({ id: "addTeacher.emailPlaceholder" })
                    }
                    required
                    className="w-full pl-12 pr-4 py-4 border border-green-400/50 rounded-xl bg-black/50 text-white placeholder-green-300/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <p className="text-xs text-green-300 mt-1">
                  {formatMessage({ id: "addTeacher.infoText" })}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>
                      {formatMessage({ id: "addTeacher.adding" }) ||
                        "Adding..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>
                      {formatMessage({ id: "addTeacher.submitButton" })}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-300 text-sm">
                <Users className="w-4 h-4" />
                <span>
                  {formatMessage({ id: "addTeacher.infoText" })}
                </span>
              </div>
            </div>

            {/* Go Back Link */}
            <div className="text-center">
              <button
                onClick={handleGoBack}
                className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center space-x-2 mx-auto group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>{formatMessage({ id: "addTeacher.goBack" })}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddTeacher;
