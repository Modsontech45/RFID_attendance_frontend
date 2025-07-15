import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { postData, API_BASE, setAuthData } from "../utils/auth";

import { Shield, Eye, EyeOff, ArrowLeft, Loader2, Mail, Lock } from "lucide-react";

import { FormattedMessage, useIntl } from "react-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = formatMessage({ id: "validation.emailRequired" });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = formatMessage({ id: "validation.emailInvalid" });
    }

    if (!formData.password) {
      newErrors.password = formatMessage({ id: "validation.passwordRequired" });
    } else if (formData.password.length < 6) {
      newErrors.password = formatMessage({ id: "validation.passwordLength" });
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
      const result = await postData(`${API_BASE}/admin/login`, formData, {
        "Accept-Language": localStorage.getItem("lang") || "en",
      });

      console.log("Login response:", result);

      if (result.token) {
        console.log("Token found, setting cookies and navigating...");
        setAuthData("token", result.token);
        setAuthData("role", "admin");

        if (result.admin?.api_key) {
          setAuthData("api_key", result.admin.api_key);
        }

        if (result.admin) {
          setAuthData("admin_data", JSON.stringify(result.admin));
        }

        console.log("Auth data set, navigating to dashboard...");
        navigate("/admin/dashboard");
        return;
      }

      console.log("Login failed, no token in response");
      setErrors({
        general: result.message || formatMessage({ id: "login.error.general" }),
      });
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error?.message || error?.data?.message || formatMessage({ id: "login.error.general" });
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-green-600 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                <FormattedMessage id="app.name" defaultMessage="Synctuario" />
              </span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border-2 border-green-600 bg-black p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-400">
                <FormattedMessage id="login.admin.title" defaultMessage="Admin Login" />
              </h1>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="rounded-lg border border-red-600 bg-red-900 p-3 text-sm text-red-300">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={formatMessage({
                    id: "login.admin.emailPlaceholder",
                    defaultMessage: "Email",
                  })}
                  required
                  className={`w-full rounded-lg border bg-black/50 py-3 pl-12 pr-4 text-white placeholder-green-300/70 transition-all focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-600 focus:ring-red-600"
                      : "border-green-600 focus:ring-green-600"
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={formatMessage({
                    id: "login.admin.passwordPlaceholder",
                    defaultMessage: "Password",
                  })}
                  required
                  className={`w-full rounded-lg border bg-black/50 py-3 pl-12 pr-12 text-white placeholder-green-300/70 transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-600 focus:ring-red-600"
                      : "border-green-600 focus:ring-green-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-green-400 transition-colors hover:text-green-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full transform items-center justify-center space-x-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-green-700 disabled:scale-100 disabled:bg-gray-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>
                    <FormattedMessage id="login.admin.loggingIn" defaultMessage="Logging in..." />
                  </span>
                </>
              ) : (
                <span>
                  <FormattedMessage id="login.admin.loginButton" defaultMessage="Login" />
                </span>
              )}
            </button>

            {/* Links */}
            <div className="space-y-3 text-center text-sm">
              <p className="text-white">
                <FormattedMessage
                  id="login.admin.noAccount"
                  defaultMessage="Don't have an account?"
                />{" "}
                <Link
                  to="/admin/signup"
                  className="font-medium text-green-400 transition-colors hover:text-green-300 hover:underline"
                >
                  <FormattedMessage id="login.admin.signupLink" defaultMessage="Sign up" />
                </Link>
              </p>

              <p>
                <Link
                  to="/admin/forgot-password"
                  className="text-green-400 transition-colors hover:text-green-300 hover:underline"
                >
                  <FormattedMessage
                    id="login.admin.forgotPassword"
                    defaultMessage="Forgot password?"
                  />
                </Link>
              </p>
            </div>

            {/* Go Back Button */}
            <button
              type="button"
              onClick={handleGoBack}
              className="flex w-full items-center justify-center space-x-2 py-2 text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>
                <FormattedMessage id="login.admin.back" defaultMessage="Go back" />
              </span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
