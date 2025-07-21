import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { sendContactEmail, EmailData } from "../utils/email";
import {
  Shield,
  Check,
  Star,
  Users,
  Clock,
  BarChart3,
  Zap,
  Award,
  Globe,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
// import LanguageSwitcher from "./LanguageSwitcher";

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const { formatMessage } = useIntl();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    school: "",
    message: "",
    plan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitType, setSubmitType] = useState<"success" | "error">("success");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const emailData: EmailData = {
        name: contactForm.name,
        email: contactForm.email,
        subject: `Synctuario Contact Form - ${contactForm.plan ? `${contactForm.plan} Plan Inquiry` : "General Inquiry"}`,
        message: contactForm.message,
        school: contactForm.school,
        plan: contactForm.plan,
      };

      const result = await sendContactEmail(emailData);

      if (result.success) {
        setSubmitMessage(result.message);
        setSubmitType("success");
        setContactForm({ name: "", email: "", school: "", message: "", plan: "" });
        setTimeout(() => {
          setShowContactForm(false);
          setSubmitMessage("");
        }, 3000);
      } else {
        setSubmitMessage(result.message);
        setSubmitType("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitMessage("Failed to send message. Please try again later.");
      setSubmitType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelect = (planName: string) => {
    // For Enterprise plan, scroll to contact section
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setContactForm((prev) => ({ ...prev, plan: planName }));
  };

  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
  //       <div className="text-center">
  //         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
  //           <Shield className="h-6 w-6 animate-pulse text-white" />
  //         </div>
  //         <div className="text-xl text-gray-300">Loading...</div>
  //       </div>
  //     </div>
  //   );
  // }

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
                Synctuario
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <a
                // onClick={() => navigate("/")}
                href="/"
                className="text-gray-300 transition-colors hover:text-white"
              >
                <FormattedMessage
                  id="documentation.home"
                  defaultMessage="Choose the plan that fits your school"
                />
              </a>
              <a
                // onClick={() => href("#contact")}
                href="#contact"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Contact
              </a>
              {/* <LanguageSwitcher /> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-20 px-6 py-12">
        {/* Hero Section */}
        <section className="space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                <FormattedMessage
                  id="pricing.title"
                  defaultMessage="Choose the plan that fits your school"
                />
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
              <FormattedMessage
                id="pricing.subtitle"
                defaultMessage="Affordable pricing plans designed to scale with your institution."
              />
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {/* Starter Plan */}
          <div className="transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-white">
                <FormattedMessage id="pricing.starter.title" defaultMessage="Starter" />
              </h3>
              <p className="mb-6 text-gray-400">
                <FormattedMessage
                  id="pricing.starter.subtitle"
                  defaultMessage="Perfect for small schools or pilots"
                />
              </p>
              <div className="mb-2 text-4xl font-bold text-blue-400">
                <FormattedMessage id="pricing.starter.price" defaultMessage="$30" />
              </div>
              <div className="text-gray-400">
                <FormattedMessage id="pricing.starter.period" defaultMessage="month" />
              </div>
            </div>

            <ul className="mb-8 space-y-4">
              {[
                formatMessage({
                  id: "pricing.starter.features.0",
                  defaultMessage: "Basic student management",
                }),
                formatMessage({
                  id: "pricing.starter.features.1",
                  defaultMessage: "Limited attendance tracking",
                }),
                formatMessage({
                  id: "pricing.starter.features.2",
                  defaultMessage: "Basic analytics dashboard",
                }),
                formatMessage({
                  id: "pricing.starter.features.3",
                  defaultMessage: "Email support",
                }),
              ].map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelect("Starter")}
              className="w-full transform rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700"
            >
              <FormattedMessage id="pricing.getStarted" defaultMessage="Get Started" />
            </button>
          </div>

          {/* Professional Plan */}
          <div className="relative transform rounded-2xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600/30">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
              <span className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
                <Star className="h-4 w-4" />
                <span>
                  <FormattedMessage
                    id="pricing.professional.mostPopular"
                    defaultMessage="Most Popular"
                  />
                </span>
              </span>
            </div>

            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-white">
                <FormattedMessage id="pricing.professional.title" defaultMessage="Professional" />
              </h3>
              <p className="mb-6 text-gray-300">
                <FormattedMessage
                  id="pricing.professional.subtitle"
                  defaultMessage="Great for growing institutions"
                />
              </p>
              <div className="mb-2 text-4xl font-bold text-blue-400">
                <FormattedMessage id="pricing.professional.price" defaultMessage="$60" />
              </div>
              <div className="text-gray-400">
                <FormattedMessage id="pricing.professional.period" defaultMessage="month" />
              </div>
            </div>

            <ul className="mb-8 space-y-4">
              {[
                formatMessage({
                  id: "pricing.professional.features.0",
                  defaultMessage: "Advanced student management",
                }),
                formatMessage({
                  id: "pricing.professional.features.1",
                  defaultMessage: "Real-time attendance tracking",
                }),
                formatMessage({
                  id: "pricing.professional.features.2",
                  defaultMessage: "Detailed analytics and reporting",
                }),
                formatMessage({
                  id: "pricing.professional.features.3",
                  defaultMessage: "Priority email support",
                }),
              ].map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelect("Professional")}
              className="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-700"
            >
              <FormattedMessage id="pricing.getStarted" defaultMessage="Get Started" />
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-white">
                <FormattedMessage id="pricing.enterprise.title" defaultMessage="Enterprise" />
              </h3>
              <p className="mb-6 text-gray-400">
                <FormattedMessage
                  id="pricing.enterprise.subtitle"
                  defaultMessage="Best for large or multi-campus setups"
                />
              </p>
              <div className="mb-2 text-4xl font-bold text-blue-400">
                <FormattedMessage id="pricing.enterprise.price" defaultMessage="Custom" />
              </div>
              <div className="text-gray-400">
                <FormattedMessage id="pricing.enterprise.period" defaultMessage="month" />
              </div>
            </div>

            <ul className="mb-8 space-y-4">
              {[
                formatMessage({
                  id: "pricing.enterprise.features.0",
                  defaultMessage: "All professional features",
                }),
                formatMessage({
                  id: "pricing.enterprise.features.1",
                  defaultMessage: "Dedicated account manager",
                }),
                formatMessage({
                  id: "pricing.enterprise.features.2",
                  defaultMessage: "Custom integrations",
                }),
                formatMessage({
                  id: "pricing.enterprise.features.3",
                  defaultMessage: "24/7 support",
                }),
              ].map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelect("Enterprise")}
              className="w-full transform rounded-xl bg-purple-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700"
            >
              <FormattedMessage id="pricing.contactSales" defaultMessage="Contact Sales" />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-white">
              <FormattedMessage id="pricing.allPlansInclude" defaultMessage="All Plans Include" />
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-300">
              <FormattedMessage
                id="pricing.allPlansSubtitle"
                defaultMessage="Every plan includes essential features to run your school efficiently."
              />
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: (
                  <FormattedMessage
                    id="pricing.features.studentManagement.title"
                    defaultMessage="Student Management"
                  />
                ),
                description: (
                  <FormattedMessage
                    id="pricing.features.studentManagement.description"
                    defaultMessage="Manage student profiles, classes, and performance from one dashboard."
                  />
                ),
              },
              {
                icon: Clock,
                title: (
                  <FormattedMessage
                    id="pricing.features.realTimeTracking.title"
                    defaultMessage="Real-Time Tracking"
                  />
                ),
                description: (
                  <FormattedMessage
                    id="pricing.features.realTimeTracking.description"
                    defaultMessage="Instant updates on attendance and student activity."
                  />
                ),
              },
              {
                icon: BarChart3,
                title: (
                  <FormattedMessage
                    id="pricing.features.advancedReports.title"
                    defaultMessage="Advanced Reports"
                  />
                ),
                description: (
                  <FormattedMessage
                    id="pricing.features.advancedReports.description"
                    defaultMessage="Gain insights with automated reports and performance summaries."
                  />
                ),
              },
              {
                icon: Zap,
                title: (
                  <FormattedMessage
                    id="pricing.features.fastSetup.title"
                    defaultMessage="Fast Setup"
                  />
                ),
                description: (
                  <FormattedMessage
                    id="pricing.features.fastSetup.description"
                    defaultMessage="Get your school up and running in no time with our onboarding help."
                  />
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-bold text-white">
              <FormattedMessage id="pricing.contact.title" defaultMessage="Get In Touch" />
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              <FormattedMessage
                id="pricing.contact.subtitle"
                defaultMessage="Reach out to learn more, schedule a demo, or request a custom quote."
              />
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      <FormattedMessage id="pricing.contact.email" defaultMessage="Email Us" />
                    </h3>
                    <p className="text-gray-300">support@synctuario.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      <FormattedMessage id="pricing.contact.phone" defaultMessage="Call Us" />
                    </h3>
                    <p className="text-gray-300">+22893946043</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      <FormattedMessage id="pricing.contact.office" defaultMessage="Our Office" />
                    </h3>
                    <p className="text-gray-300">
                     HEDZRANAWE LOME TOGO
                      <br />
                      AFRIPUL GROUP
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-6 backdrop-blur-sm">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  <FormattedMessage
                    id="pricing.contact.whyChoose"
                    defaultMessage="Why Choose Synctuario?"
                  />
                </h3>
                <ul className="space-y-2 text-gray-300">
                  {[
                    {
                      icon: Award,
                      text: formatMessage({
                        id: "pricing.contact.reasons.0",
                        defaultMessage: "Award-Winning Support",
                      }),
                    },
                    {
                      icon: Globe,
                      text: formatMessage({
                        id: "pricing.contact.reasons.1",
                        defaultMessage: "Global Accessibility",
                      }),
                    },
                    {
                      icon: Shield,
                      text: formatMessage({
                        id: "pricing.contact.reasons.2",
                        defaultMessage: "Enterprise-Grade Security",
                      }),
                    },
                  ].map((reason, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <reason.icon className="h-4 w-4 text-blue-400" />
                      <span>{reason.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              id="contact"
            >
              <h3 className="mb-6 text-2xl font-bold text-white">
                <FormattedMessage
                  id="pricing.contact.getStartedToday"
                  defaultMessage="Get Started Today"
                />
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder={formatMessage({
                      id: "pricing.contact.form.yourName",
                      defaultMessage: "Your Name",
                    })}
                    value={contactForm.name}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder={formatMessage({
                      id: "pricing.contact.form.schoolEmail",
                      defaultMessage: "School Email",
                    })}
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <input
                  type="text"
                  placeholder={formatMessage({
                    id: "pricing.contact.form.schoolName",
                    defaultMessage: "School Name",
                  })}
                  value={contactForm.school}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, school: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={contactForm.plan}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, plan: e.target.value }))}
                  className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {formatMessage({
                      id: "pricing.contact.form.selectPlan",
                      defaultMessage: "Select a Plan (Optional)",
                    })}
                  </option>
                  <option value="Starter">
                    {formatMessage({ id: "pricing.starter.title", defaultMessage: "Starter" })} -{" "}
                    {formatMessage({ id: "pricing.starter.price", defaultMessage: "$35" })}/
                    {formatMessage({ id: "pricing.starter.period", defaultMessage: "month" })}
                  </option>
                  <option value="Professional">
                    {formatMessage({
                      id: "pricing.professional.title",
                      defaultMessage: "Professional",
                    })}{" "}
                    - {formatMessage({ id: "pricing.professional.price", defaultMessage: "$65" })}/
                    {formatMessage({ id: "pricing.professional.period", defaultMessage: "month" })}
                  </option>
                  <option value="Enterprise">
                    {formatMessage({
                      id: "pricing.enterprise.title",
                      defaultMessage: "Enterprise",
                    })}{" "}
                    - {formatMessage({ id: "pricing.enterprise.price", defaultMessage: "$170" })}/
                    {formatMessage({ id: "pricing.enterprise.period", defaultMessage: "month" })}
                  </option>
                </select>

                <textarea
                  placeholder={formatMessage({
                    id: "pricing.contact.form.message",
                    defaultMessage: "Your Message",
                  })}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-700 disabled:scale-100 disabled:from-gray-600 disabled:to-gray-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>
                        <FormattedMessage
                          id="pricing.contact.form.sendMessage"
                          defaultMessage="Send Message"
                        />
                      </span>
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div
                    className={`rounded-lg p-3 text-center ${
                      submitType === "success"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {submitType === "success" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <span>{submitMessage}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PricingPage;
