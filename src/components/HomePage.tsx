import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { sendContactEmail, EmailData } from "../utils/email";
import {
  Shield,
  Users,
  BarChart3,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Lock,
  Smartphone,
  Download,
  UserCheck,
  Building,
  GraduationCap,
  Linkedin,
  Facebook,
  Github,
  Sparkles,
  TrendingUp,
  Calendar,
  FileText,
  Mail,
  Send,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

interface FloatingComment {
  id: number;
  text: string;
  left: number;
  animationDuration: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  
  const [floatingComments, setFloatingComments] = useState<FloatingComment[]>([]);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactMessageType, setContactMessageType] = useState<"success" | "error">("success");
  const floatingCommentsContainerRef = useRef<HTMLDivElement>(null);
  const commentIdRef = useRef(0);

  // Floating comments data
  const getCommentsData = () => {
    return [
      formatMessage({ id: "home.welcomeComments.0", defaultMessage: "✨ Welcome to Synctuario!" }),
      formatMessage({ id: "home.welcomeComments.1", defaultMessage: "🔐 Secure RFID Technology" }),
      formatMessage({ id: "home.welcomeComments.2", defaultMessage: "📊 Real-time Analytics" }),
      formatMessage({ id: "home.welcomeComments.3", defaultMessage: "🚀 Easy Setup & Use" }),
      formatMessage({ id: "home.welcomeComments.4", defaultMessage: "💼 Perfect for Schools & Companies" }),
      formatMessage({ id: "home.welcomeComments.5", defaultMessage: "🎯 99.9% Accuracy Rate" }),
      formatMessage({ id: "home.welcomeComments.6", defaultMessage: "⚡ Lightning Fast Scanning" }),
      formatMessage({ id: "home.welcomeComments.7", defaultMessage: "🌟 Trusted by 500+ Organizations" }),
    ];
  };

  // Handle navigation
  const handleAdminClick = () => {
    navigate("/admin/login");
  };

  const handleTeacherClick = () => {
    navigate("/teacher/login");
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactMessage("");

    try {
      const emailData: EmailData = {
        name: contactForm.name,
        email: contactForm.email,
        subject: "Synctuario Contact - General Inquiry",
        message: contactForm.message,
      };

      const result = await sendContactEmail(emailData);

      if (result.success) {
        setContactMessage(
          formatMessage({
            id: "home.contact.successMessage",
            defaultMessage: "Message sent successfully!",
          }),
        );
        setContactMessageType("success");
        setContactForm({ name: "", email: "", message: "" });
        setTimeout(() => {
          setShowContactModal(false);
          setContactMessage("");
        }, 3000);
      } else {
        setContactMessage(result.message);
        setContactMessageType("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setContactMessage(
        formatMessage({
          id: "home.contact.errorMessage",
          defaultMessage: "Failed to send message. Please try again later.",
        }),
      );
      setContactMessageType("error");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Effects
  useEffect(() => {
    // Create floating comment
    const createFloatingComment = () => {
      if (!floatingCommentsContainerRef.current) return;

      const commentsData = getCommentsData();
      const text = commentsData[Math.floor(Math.random() * commentsData.length)];
      const containerWidth = floatingCommentsContainerRef.current.clientWidth;
      const newComment: FloatingComment = {
        id: commentIdRef.current++,
        text,
        left: Math.random() * (containerWidth - 200),
        animationDuration: 4000 + Math.random() * 3000,
      };

      setFloatingComments((prev) => [...prev, newComment]);

      setTimeout(() => {
        setFloatingComments((prev) => prev.filter((comment) => comment.id !== newComment.id));
      }, 6000);
    };

    const interval = setInterval(createFloatingComment, 2000);
    const adTimer = setTimeout(() => {
      setShowAdPopup(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(adTimer);
    };
  }, [formatMessage]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
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
      <header className="relative z-20 border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                <FormattedMessage id="home.header.title" defaultMessage="Synctuario" />
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/docs")}
                className="text-gray-300 transition-colors hover:text-white"
              >
                <FormattedMessage id="home.header.docs" defaultMessage="Docs" />
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Floating Comments Container */}
      <div
        ref={floatingCommentsContainerRef}
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      >
        {floatingComments.map((comment) => (
          <div
            key={comment.id}
            className="pointer-events-none absolute bottom-1/2 animate-[floatUpFade_var(--duration)_ease-out_forwards] select-none whitespace-nowrap rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 font-medium text-white shadow-lg"
            style={
              {
                left: `${comment.left}px`,
                "--duration": `${comment.animationDuration}ms`,
                animationDuration: `${comment.animationDuration}ms`,
              } as React.CSSProperties
            }
          >
            {comment.text}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-20 px-6 py-12">
        {/* Hero Section */}
        <section className="space-y-8 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-blue-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                <FormattedMessage id="home.hero.subtitle" defaultMessage="Next-Generation Attendance System" />
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                <FormattedMessage id="home.hero.title_part1" defaultMessage="Smart Attendance" />
              </span>
              <br />
              <span className="text-white">
                <FormattedMessage id="home.hero.title_part2" defaultMessage="Made Simple" />
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
              <FormattedMessage id="home.hero.description" defaultMessage="Revolutionary RFID-powered attendance tracking for schools and companies. Experience seamless, real-time monitoring with enterprise-grade security." />
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <button
              onClick={handleAdminClick}
              className="group relative flex transform items-center space-x-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
            >
              <Shield className="h-5 w-5" />
              <span>
                <FormattedMessage id="home.buttons.admin_portal" defaultMessage="Admin Portal" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleTeacherClick}
              className="group relative flex transform items-center space-x-3 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <Users className="h-5 w-5" />
              <span>
                <FormattedMessage id="home.buttons.teacher_portal" defaultMessage="Teacher Portal" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate("/docs")}
              className="group relative flex transform items-center space-x-3 rounded-xl border border-purple-500/30 bg-purple-600/20 px-8 py-4 font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-purple-600/30"
            >
              <FileText className="h-5 w-5" />
              <span>
                <FormattedMessage id="home.buttons.documentation" defaultMessage="Documentation" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                icon: Building,
                label: formatMessage({ id: "home.stats.schools", defaultMessage: "Schools" }),
                value: formatMessage({ id: "home.stats.schools_value", defaultMessage: "500+" }),
              },
              {
                icon: UserCheck,
                label: formatMessage({ id: "home.stats.daily_scans", defaultMessage: "Daily Scans" }),
                value: formatMessage({ id: "home.stats.daily_scans_value", defaultMessage: "50K+" }),
              },
              {
                icon: TrendingUp,
                label: formatMessage({ id: "home.stats.accuracy", defaultMessage: "Accuracy" }),
                value: formatMessage({ id: "home.stats.accuracy_value", defaultMessage: "99.9%" }),
              },
              {
                icon: Award,
                label: formatMessage({ id: "home.stats.uptime", defaultMessage: "Uptime" }),
                value: formatMessage({ id: "home.stats.uptime_value", defaultMessage: "99.99%" }),
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
              >
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-blue-400" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-white">
              <FormattedMessage id="home.features.title" defaultMessage="Why Choose Synctuario for Your School?" />
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-300">
              <FormattedMessage id="home.features.description" defaultMessage="Cutting-edge technology meets intuitive design for the ultimate attendance management experience." />
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: formatMessage({ id: "home.features.items.0.title", defaultMessage: "Lightning Fast" }),
                description: formatMessage({ id: "home.features.items.0.description", defaultMessage: "RFID scanning in milliseconds with ESP32 integration" }),
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Lock,
                title: formatMessage({ id: "home.features.items.1.title", defaultMessage: "Enterprise Security" }),
                description: formatMessage({ id: "home.features.items.1.description", defaultMessage: "Bank-level encryption with unique API keys for each school" }),
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: BarChart3,
                title: formatMessage({ id: "home.features.items.2.title", defaultMessage: "Real-time Analytics" }),
                description: formatMessage({ id: "home.features.items.2.description", defaultMessage: "Live dashboards with detailed reports and insights" }),
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Globe,
                title: formatMessage({ id: "home.features.items.3.title", defaultMessage: "Multi-language" }),
                description: formatMessage({ id: "home.features.items.3.description", defaultMessage: "Full support for English and French interfaces" }),
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Smartphone,
                title: formatMessage({ id: "home.features.items.4.title", defaultMessage: "Mobile Ready" }),
                description: formatMessage({ id: "home.features.items.4.description", defaultMessage: "Access from any device with responsive design" }),
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Download,
                title: formatMessage({ id: "home.features.items.5.title", defaultMessage: "Export Data" }),
                description: formatMessage({ id: "home.features.items.5.description", defaultMessage: "Download attendance records in Excel format" }),
                color: "from-teal-500 to-green-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group transform rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                <div
                  className={`h-12 w-12 bg-gradient-to-r ${feature.color} mb-4 flex items-center justify-center rounded-lg transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-white">
              <FormattedMessage id="home.how_it_works.title" defaultMessage="How It Works" />
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-300">
              <FormattedMessage id="home.how_it_works.description" defaultMessage="Simple setup, powerful results in just three steps." />
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: formatMessage({ id: "home.how_it_works.steps.0.step", defaultMessage: "01" }),
                icon: UserCheck,
                title: formatMessage({ id: "home.how_it_works.steps.0.title", defaultMessage: "Register Students" }),
                description: formatMessage({ id: "home.how_it_works.steps.0.description", defaultMessage: "Add students with unique RFID cards" }),
              },
              {
                step: formatMessage({ id: "home.how_it_works.steps.1.step", defaultMessage: "02" }),
                icon: Smartphone,
                title: formatMessage({ id: "home.how_it_works.steps.1.title", defaultMessage: "Scan & Track" }),
                description: formatMessage({ id: "home.how_it_works.steps.1.description", defaultMessage: "ESP32 readers capture attendance with timestamps" }),
              },
              {
                step: formatMessage({ id: "home.how_it_works.steps.2.step", defaultMessage: "03" }),
                icon: BarChart3,
                title: formatMessage({ id: "home.how_it_works.steps.2.title", defaultMessage: "Monitor & Report" }),
                description: formatMessage({ id: "home.how_it_works.steps.2.description", defaultMessage: "View live data and generate detailed analytics" }),
              },
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600">
                  {step.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-white">
              <FormattedMessage id="home.use_cases.title" defaultMessage="Perfect for Schools" />
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-8 backdrop-blur-sm">
              <GraduationCap className="mb-6 h-12 w-12 text-blue-400" />
              <h3 className="mb-4 text-2xl font-bold text-white">
                <FormattedMessage id="home.use_cases.elementary.title" defaultMessage="Elementary & High Schools" />
              </h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  formatMessage({ id: "home.use_cases.elementary.items.0", defaultMessage: "Student attendance tracking" }),
                  formatMessage({ id: "home.use_cases.elementary.items.1", defaultMessage: "Teacher access management" }),
                  formatMessage({ id: "home.use_cases.elementary.items.2", defaultMessage: "Parent notification system" }),
                  formatMessage({ id: "home.use_cases.elementary.items.3", defaultMessage: "Class-wise reporting" }),
                ].map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-8 backdrop-blur-sm">
              <Building className="mb-6 h-12 w-12 text-green-400" />
              <h3 className="mb-4 text-2xl font-bold text-white">
                <FormattedMessage id="home.use_cases.university.title" defaultMessage="Universities & Colleges" />
              </h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  formatMessage({ id: "home.use_cases.university.items.0", defaultMessage: "Large-scale student tracking" }),
                  formatMessage({ id: "home.use_cases.university.items.1", defaultMessage: "Multi-campus support" }),
                  formatMessage({ id: "home.use_cases.university.items.2", defaultMessage: "Advanced analytics" }),
                  formatMessage({ id: "home.use_cases.university.items.3", defaultMessage: "Integration with LMS" }),
                ].map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="space-y-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-12 text-center backdrop-blur-sm">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">
              <FormattedMessage id="home.cta.title" defaultMessage="Ready to Transform Your School?" />
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              <FormattedMessage id="home.cta.description" defaultMessage="Join hundreds of organizations already using Synctuario for seamless attendance management." />
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/pricing")}
              className="flex transform items-center space-x-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl"
            >
              <Calendar className="h-5 w-5" />
              <span>
                <FormattedMessage id="home.cta.pricing_button" defaultMessage="View Pricing" />
              </span>
            </button>

            <button
              onClick={handleContactClick}
              className="flex items-center space-x-3 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              <FileText className="h-5 w-5" />
              <span>
                <FormattedMessage id="home.cta.contact_button" defaultMessage="Contact Us" />
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            {[
              formatMessage({ id: "home.cta.benefits.0", defaultMessage: "15-day free trial" }),
              formatMessage({ id: "home.cta.benefits.1", defaultMessage: "No setup fees" }),
              formatMessage({ id: "home.cta.benefits.2", defaultMessage: "Cancel anytime" })
            ].map((benefit: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Social Links Popup */}
      {showAdPopup && (
      <div className="animate-fade-in fixed bottom-8 right-8 z-40 max-w-xs rounded-xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
  <div className="space-y-4 text-center">
  
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full overflow-hidden">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV85rp_Srka8ObqhnOnAcPmKnUWOUxdlCZLA&s" // Replace with your image URL
        alt="Modson Tande"
        className="object-cover h-full w-full"
      />
    </div>
    
    {/* Greeting Message */}
    <h3 className="font-semibold text-white">
      Hello, I'm <span className="text-cyan-400">Modson Tande</span>
    </h3>
    
    {/* Connect with Us Section */}
    <h3 className="font-semibold text-white">
      <FormattedMessage id="home.popup.connect_with_us" defaultMessage="Connect With me" />
    </h3>
    
    <div className="flex justify-center space-x-4">
      <a
        href="https://www.linkedin.com/in/modson-tande-4842871b2"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 transition-colors hover:bg-blue-700"
      >
        <Linkedin className="h-5 w-5 text-white" />
      </a>
      <a
        href="https://www.facebook.com/61563245937633/videos/401360552995380"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 transition-colors hover:bg-blue-600"
      >
        <Facebook className="h-5 w-5 text-white" />
      </a>
      <a
        href="https://github.com/Modsontech45"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 transition-colors hover:bg-gray-600"
      >
        <Github className="h-5 w-5 text-white" />
      </a>
    </div>
    
    {/* Close Button */}
    <button
      onClick={() => setShowAdPopup(false)}
      className="text-xs text-gray-400 transition-colors hover:text-white"
    >
      <FormattedMessage id="home.popup.close" defaultMessage="Close" />
    </button>
  </div>
</div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-slate-900 p-8">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
              onClick={() => setShowContactModal(false)}
              aria-label="Close contact form"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="mb-4 text-2xl font-bold text-white">
              <FormattedMessage id="contact.title" defaultMessage="Contact Us" />
            </h2>
            <p className="mb-6 text-gray-400">
              <FormattedMessage
                id="contact.description"
                defaultMessage="Send us a message and we'll get back to you"
              />
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={formatMessage({
                  id: "contact.name_placeholder",
                  defaultMessage: "Your Name",
                })}
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder={formatMessage({
                  id: "contact.email_placeholder",
                  defaultMessage: "Your Email",
                })}
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder={formatMessage({
                  id: "contact.message_placeholder",
                  defaultMessage: "Your Message",
                })}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={5}
                className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={isSubmittingContact}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmittingContact ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <FormattedMessage id="contact.sending" defaultMessage="Sending..." />
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <FormattedMessage id="contact.send_button" defaultMessage="Send Message" />
                  </>
                )}
              </button>
            </form>

            {contactMessage && (
              <div
                className={`mt-4 rounded p-3 ${
                  contactMessageType === "success"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
                role="alert"
              >
                {contactMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;