import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useIntl, FormattedMessage } from "react-intl";
import Flag from "react-world-flags";
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
  Phone,
  Check,
  X,
} from "lucide-react";
import { API_BASE, postData } from "../utils/auth";

// Country codes for phone number detection
const COUNTRY_CODES = [
  { code: "+1", country: "US", name: "United States" },
  { code: "+44", country: "GB", name: "United Kingdom" },
  { code: "+33", country: "FR", name: "France" },
  { code: "+49", country: "DE", name: "Germany" },
  { code: "+39", country: "IT", name: "Italy" },
  { code: "+34", country: "ES", name: "Spain" },
  { code: "+31", country: "NL", name: "Netherlands" },
  { code: "+32", country: "BE", name: "Belgium" },
  { code: "+41", country: "CH", name: "Switzerland" },
  { code: "+43", country: "AT", name: "Austria" },
  { code: "+45", country: "DK", name: "Denmark" },
  { code: "+46", country: "SE", name: "Sweden" },
  { code: "+47", country: "NO", name: "Norway" },
  { code: "+358", country: "FI", name: "Finland" },
  { code: "+351", country: "PT", name: "Portugal" },
  { code: "+30", country: "GR", name: "Greece" },
  { code: "+48", country: "PL", name: "Poland" },
  { code: "+420", country: "CZ", name: "Czech Republic" },
  { code: "+36", country: "HU", name: "Hungary" },
  { code: "+40", country: "RO", name: "Romania" },
  { code: "+359", country: "BG", name: "Bulgaria" },
  { code: "+385", country: "HR", name: "Croatia" },
  { code: "+386", country: "SI", name: "Slovenia" },
  { code: "+421", country: "SK", name: "Slovakia" },
  { code: "+370", country: "LT", name: "Lithuania" },
  { code: "+371", country: "LV", name: "Latvia" },
  { code: "+372", country: "EE", name: "Estonia" },
  { code: "+353", country: "IE", name: "Ireland" },
  { code: "+356", country: "MT", name: "Malta" },
  { code: "+357", country: "CY", name: "Cyprus" },
  { code: "+377", country: "MC", name: "Monaco" },
  { code: "+378", country: "SM", name: "San Marino" },
  { code: "+379", country: "VA", name: "Vatican City" },
  { code: "+380", country: "UA", name: "Ukraine" },
  { code: "+381", country: "RS", name: "Serbia" },
  { code: "+382", country: "ME", name: "Montenegro" },
  { code: "+383", country: "XK", name: "Kosovo" },
  { code: "+387", country: "BA", name: "Bosnia and Herzegovina" },
  { code: "+389", country: "MK", name: "North Macedonia" },
  { code: "+90", country: "TR", name: "Turkey" },
  { code: "+7", country: "RU", name: "Russia" },
  { code: "+91", country: "IN", name: "India" },
  { code: "+86", country: "CN", name: "China" },
  { code: "+81", country: "JP", name: "Japan" },
  { code: "+82", country: "KR", name: "South Korea" },
  { code: "+65", country: "SG", name: "Singapore" },
  { code: "+60", country: "MY", name: "Malaysia" },
  { code: "+66", country: "TH", name: "Thailand" },
  { code: "+84", country: "VN", name: "Vietnam" },
  { code: "+63", country: "PH", name: "Philippines" },
  { code: "+62", country: "ID", name: "Indonesia" },
  { code: "+61", country: "AU", name: "Australia" },
  { code: "+64", country: "NZ", name: "New Zealand" },
  { code: "+27", country: "ZA", name: "South Africa" },
  { code: "+234", country: "NG", name: "Nigeria" },
  { code: "+233", country: "GH", name: "Ghana" },
  { code: "+254", country: "KE", name: "Kenya" },
  { code: "+255", country: "TZ", name: "Tanzania" },
  { code: "+256", country: "UG", name: "Uganda" },
  { code: "+250", country: "RW", name: "Rwanda" },
  { code: "+228", country: "TG", name: "Togo" },
  { code: "+229", country: "BJ", name: "Benin" },
  { code: "+225", country: "CI", name: "Ivory Coast" },
  { code: "+226", country: "BF", name: "Burkina Faso" },
  { code: "+227", country: "NE", name: "Niger" },
  { code: "+223", country: "ML", name: "Mali" },
  { code: "+221", country: "SN", name: "Senegal" },
  { code: "+220", country: "GM", name: "Gambia" },
  { code: "+224", country: "GN", name: "Guinea" },
  { code: "+245", country: "GW", name: "Guinea-Bissau" },
  { code: "+238", country: "CV", name: "Cape Verde" },
  { code: "+232", country: "SL", name: "Sierra Leone" },
  { code: "+231", country: "LR", name: "Liberia" },
  { code: "+212", country: "MA", name: "Morocco" },
  { code: "+213", country: "DZ", name: "Algeria" },
  { code: "+216", country: "TN", name: "Tunisia" },
  { code: "+218", country: "LY", name: "Libya" },
  { code: "+20", country: "EG", name: "Egypt" },
  { code: "+249", country: "SD", name: "Sudan" },
  { code: "+251", country: "ET", name: "Ethiopia" },
  { code: "+252", country: "SO", name: "Somalia" },
  { code: "+253", country: "DJ", name: "Djibouti" },
  { code: "+291", country: "ER", name: "Eritrea" },
  { code: "+55", country: "BR", name: "Brazil" },
  { code: "+54", country: "AR", name: "Argentina" },
  { code: "+56", country: "CL", name: "Chile" },
  { code: "+57", country: "CO", name: "Colombia" },
  { code: "+58", country: "VE", name: "Venezuela" },
  { code: "+51", country: "PE", name: "Peru" },
  { code: "+593", country: "EC", name: "Ecuador" },
  { code: "+595", country: "PY", name: "Paraguay" },
  { code: "+598", country: "UY", name: "Uruguay" },
  { code: "+591", country: "BO", name: "Bolivia" },
  { code: "+592", country: "GY", name: "Guyana" },
  { code: "+597", country: "SR", name: "Suriname" },
  { code: "+594", country: "GF", name: "French Guiana" },
  { code: "+52", country: "MX", name: "Mexico" },
  { code: "+502", country: "GT", name: "Guatemala" },
  { code: "+503", country: "SV", name: "El Salvador" },
  { code: "+504", country: "HN", name: "Honduras" },
  { code: "+505", country: "NI", name: "Nicaragua" },
  { code: "+506", country: "CR", name: "Costa Rica" },
  { code: "+507", country: "PA", name: "Panama" },
];

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState({
    schoolname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "",
    telephone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Very Weak",
    color: "text-red-400",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });
  const [detectedCountry, setDetectedCountry] = useState<string>("");

  const detectCountryFromPhone = (phone: string): string => {
    const cleanPhone = phone.replace(/\s+/g, "");
    
    // Sort by length (longest first) to match longer codes first
    const sortedCodes = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
    
    for (const { code, country } of sortedCodes) {
      if (cleanPhone.startsWith(code)) {
        return country;
      }
    }
    return "";
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    let label = "Very Weak";
    let color = "text-red-400";
    
    if (score >= 5) {
      label = "Very Strong";
      color = "text-green-400";
    } else if (score >= 4) {
      label = "Strong";
      color = "text-green-400";
    } else if (score >= 3) {
      label = "Medium";
      color = "text-yellow-400";
    } else if (score >= 2) {
      label = "Weak";
      color = "text-orange-400";
    }

    return { score, label, color, requirements };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Real-time password strength calculation
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Real-time country detection for telephone
    if (name === "telephone") {
      setDetectedCountry(detectCountryFromPhone(value));
    }
    
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

    if (!formData.telephone.trim()) {
      newErrors.telephone = formatMessage({ id: "validation.telephoneRequired" });
    } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.telephone.trim())) {
      newErrors.telephone = formatMessage({ id: "validation.telephoneInvalid" });
    }

    if (!formData.type) {
      newErrors.type = formatMessage({ id: "validation.typeRequired" });
    }

    if (!formData.password) {
      newErrors.password = formatMessage({ id: "validation.passwordRequired" });
    } else if (formData.password.length < 8) {
      newErrors.password = formatMessage({ id: "validation.passwordMinLength" });
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = formatMessage({ id: "validation.passwordStrength" });
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
          telephone: formData.telephone,
          type: formData.type,
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
          <div className="space-y-6 rounded-2xl border-2 border-green-600 bg-black p-8 shadow-2xl">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Name Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                  <input
                    type="text"
                    name="schoolname"
                    value={formData.schoolname}
                    onChange={handleInputChange}
                    placeholder={formatMessage({ id: "signup.admin.organizationPlaceholder", defaultMessage: "Organization Name" })}
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

              {/* Organization Type Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className={`w-full rounded-lg border bg-black/50 py-3 pl-12 pr-4 text-white transition-all focus:outline-none focus:ring-2 ${
                      errors.type
                        ? "border-red-600 focus:ring-red-600"
                        : "border-green-600 focus:ring-green-600"
                    }`}
                  >
                    <option value="">
                      {formatMessage({
                        id: "signup.admin.typePlaceholder",
                        defaultMessage: "Select Organization Type",
                      })}
                    </option>
                    <option value="school">
                      {formatMessage({
                        id: "signup.admin.typeSchool",
                        defaultMessage: "School",
                      })}
                    </option>
                    <option value="company">
                      {formatMessage({
                        id: "signup.admin.typeCompany",
                        defaultMessage: "Company",
                      })}
                    </option>
                  </select>
                </div>
                {errors.type && <p className="text-sm text-red-400">{errors.type}</p>}
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

              {/* Telephone Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-400" />
                  {detectedCountry && (
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 transform flex items-center">
                      <Flag
                        code={detectedCountry}
                        className="w-5 h-4 rounded-sm border border-white/20"
                      />
                    </div>
                  )}
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder={formatMessage({
                      id: "signup.admin.telephonePlaceholder",
                      defaultMessage: "Phone Number",
                    })}
                    required
                    className={`w-full rounded-lg border bg-black/50 py-3 ${detectedCountry ? 'pl-20' : 'pl-12'} pr-4 text-white placeholder-green-300/70 transition-all focus:outline-none focus:ring-2 ${
                      errors.telephone
                        ? "border-red-600 focus:ring-red-600"
                        : "border-green-600 focus:ring-green-600"
                    }`}
                  />
                </div>
                {errors.telephone && <p className="text-sm text-red-400">{errors.telephone}</p>}
                {detectedCountry && (
                  <div className="flex items-center space-x-2 text-xs text-green-300">
                    <Flag code={detectedCountry} className="w-4 h-3 rounded-sm" />
                    <span>
                      {COUNTRY_CODES.find(c => c.country === detectedCountry)?.name || "Unknown Country"}
                    </span>
                  </div>
                )}
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
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Password Strength:</span>
                      <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    
                    {/* Strength Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= 5
                            ? "bg-green-500"
                            : passwordStrength.score >= 4
                            ? "bg-green-400"
                            : passwordStrength.score >= 3
                            ? "bg-yellow-400"
                            : passwordStrength.score >= 2
                            ? "bg-orange-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Requirements Checklist */}
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {[
                        { key: "length", label: formatMessage({ id: "validation.passwordMinChars", defaultMessage: "At least 8 characters" }) },
                        { key: "uppercase", label: formatMessage({ id: "validation.passwordUppercase", defaultMessage: "One uppercase letter (A-Z)" }) },
                        { key: "lowercase", label: formatMessage({ id: "validation.passwordLowercase", defaultMessage: "One lowercase letter (a-z)" }) },
                        { key: "number", label: formatMessage({ id: "validation.passwordNumber", defaultMessage: "One number (0-9)" }) },
                        { key: "special", label: formatMessage({ id: "validation.passwordSpecial", defaultMessage: "One special character (@$!%*?&)" }) },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className={`flex items-center space-x-2 transition-colors duration-200 ${
                            passwordStrength.requirements[key as keyof typeof passwordStrength.requirements]
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordStrength.requirements[key as keyof typeof passwordStrength.requirements] ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
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
                    <FormattedMessage id="signup.admin.createAccount" defaultMessage="Create Account" />
                  </span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400">
                <FormattedMessage
                  id="signup.admin.alreadyHaveAccount"
                  defaultMessage="Already have an account?"
                />{" "}
                <Link
                  to="/admin/login"
                  className="font-semibold text-green-400 transition-colors hover:text-green-300"
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSignup;