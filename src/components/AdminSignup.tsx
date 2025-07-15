import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Shield,
  UserPlus,
  Building,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { API_BASE, postData } from "../utils/auth";

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState({
    schoolname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.schoolname.trim()) {
      newErrors.schoolname = formatMessage({ id: "validation.schoolNameRequired" });
    }

    if (!formData.username.trim()) {
      newErrors.username = formatMessage({ id: "validation.usernameRequired" });
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = formatMessage({ id: "validation.confirmPasswordRequired" });
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = formatMessage({ id: "validation.passwordsDontMatch" });
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
      const result = await postData(
        `${API_BASE}/admin/signup`,
        {
          schoolname: formData.schoolname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          "Accept-Language": localStorage.getItem("lang") || "en",
        },
      );

      if (result.redirect) {
        navigate("/admin/email-sent");
      } else {
        setErrors({
          general: result.message || formatMessage({ id: "signup.error.general" }),
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      if (error.status === 409) {
        setErrors({
          general: error.message || formatMessage({ id: "signup.error.accountExists" }),
        });
      } else {
        setErrors({
          general: formatMessage({ id: "signup.error.network" }),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/login");
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Signup Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border-2 border-green-600 bg-black p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-green-400">
                <FormattedMessage id="signup.admin.title" defaultMessage="Admin Sign Up" />
              </h1>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="rounded-lg border border-red-600 bg-red-900 p-3 text-sm text-red-300">
                {errors.general}
              </div>
            )}

            {/* School Name Field */}
            <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                <input
                  type="text"
                  name="schoolname"
                  value={formData.schoolname}
                  onChange={handleInputChange}
                  placeholder={formatMessage({
                    id: "signup.admin.schoolPlaceholder",
                    defaultMessage: "School Name",
                  })}
                  required
                  className={`w-full rounded-lg border bg-black/50 py-3 pl-12 pr-4 text-white placeholder-green-300/70 transition-all focus:outline-none focus:ring-2 ${
                    errors.schoolname
                      ? "border-red-600 focus:ring-red-600"
                      : "border-green-600 focus:ring-green-600"
                  }`}
                />
              </div>
              {errors.schoolname && <p className="text-sm text-red-400">{errors.schoolname}</p>}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={formatMessage({
                    id: "signup.admin.usernamePlaceholder",
                    defaultMessage: "Username",
                  })}
                  required
                  className={`w-full rounded-lg border bg-black/50 py-3 pl-12 pr-4 text-white placeholder-green-300/70 transition-all focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-600 focus:ring-red-600"
                      : "border-green-600 focus:ring-green-600"
                  }`}
                />
              </div>
              {errors.username && <p className="text-sm text-red-400">{errors.username}</p>}
            </div>

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
                    id: "signup.admin.emailPlaceholder",
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
                    id: "signup.admin.passwordPlaceholder",
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={formatMessage({
                    id: "signup.admin.confirmPasswordPlaceholder",
                    defaultMessage: "Confirm Password",
                  })}
                  required
                  className={`w-full rounded-lg border bg-black/50 py-3 pl-12 pr-12 text-white placeholder-green-300/70 transition-all focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-600 focus:ring-red-600"
                      : "border-green-600 focus:ring-green-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-green-400 transition-colors hover:text-green-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword}</p>
              )}
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
                    <FormattedMessage
                      id="signup.admin.creatingAccount"
                      defaultMessage="Creating Account..."
                    />
                  </span>
                </>
              ) : (
                <span>
                  <FormattedMessage id="signup.admin.submitButton" defaultMessage="Sign Up" />
                </span>
              )}
            </button>

            {/* Links */}
            <div className="space-y-3 text-center text-sm">
              <p className="text-white">
                <FormattedMessage
                  id="signup.admin.alreadyHaveAccount"
                  defaultMessage="Already have an account?"
                />{" "}
                <Link
                  to="/admin/login"
                  className="font-medium text-green-400 transition-colors hover:text-green-300 hover:underline"
                >
                  <FormattedMessage id="signup.admin.loginLink" defaultMessage="Login" />
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
                <FormattedMessage id="signup.admin.back" defaultMessage="Back to Login" />
              </span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminSignup;
