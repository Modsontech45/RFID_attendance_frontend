import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import {  getAdminData } from '../utils/auth';
import axios from "axios";
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

const PaymentForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("starter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handlePayment = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!email || !plan) {
    setError("Please enter a valid email and select a plan.");
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/paystack/initialize",
      {
        email,
        plan,
      }
    );

    if (res.data.authorization_url) {
      window.location.href = res.data.authorization_url;
    } else {
      setError("Failed to initialize payment.");
    }
  } catch (err) {
    console.error(err);
    setError("Something went wrong during payment.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto p-6 bg-black rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Subscribe to a Plan</h2>
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block font-medium ">Email:</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded bg-black text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Choose Plan:</label>
          <select
            className="w-full border px-3 py-2 rounded bg-black text-white"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
};

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
    const adminData = getAdminData();
    const plans = adminData?.subscription_plan
  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setShowPaymentForm(true);
  };

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
                onClick={() => navigate(-1)}
             
                className="text-gray-300 transition-colors hover:text-white"
              >
                <FormattedMessage
                  id="pricing.back"
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
      <main className="relative z-10 mx-auto max-w-7xl space-y-20 px-6 py-12">   
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

      {/* Payment Form Modal/Section */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-green-900 rounded-lg p-6 max-w-md w-full mx-4">
            <button
              onClick={() => setShowPaymentForm(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-700"
            >
              ✕
            </button>
            <PaymentForm />
          </div>
        </div>
      )}

      {/* Original pricing cards design */}
      <section className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
       
        {/* Starter Plan */}
        <div className="transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10">
          <div className="mb-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">
              <FormattedMessage
                id="pricing.starter.title"
                defaultMessage="Basic Plan"
              />
            </h3>
            <p className="mb-6 text-gray-400">
              <FormattedMessage
                id="pricing.starter.subtitle"
                defaultMessage="Perfect for small schools or pilots"
              />
            </p>
            <div className="mb-2 text-4xl font-bold text-blue-400">
              <FormattedMessage
                id="pricing.starter.price"
                defaultMessage="$30"
              />
            </div>
            <div className="text-gray-400">
              <FormattedMessage
                id="pricing.starter.period"
                defaultMessage="month"
              />
            </div>
         <span className="mt-4 inline-block cursor-pointer rounded-full bg-gradient-to-r from-blue-900 via-green-2 to-blue-600 px-6 py-3 text-white font-extrabold shadow-xl ring-4 ring-green-700 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-1 hover:shadow-2xl animate-pulse">
          

                   <FormattedMessage
                id={`${
                  plans === 'enterprise' ||   plans === 'professional' || plans === 'starter'
                    ? 'pricing.starter.freetrialExpired'
                    :'pricing.starter.startfreetrial'
                }`}
                defaultMessage="pricing.starter.startfreetrial"
              />
          </span>

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
            <FormattedMessage
              id={`${
                  plans === 'enterprise' ||   plans === 'professional'
                    ? 'pricing.starter.downgrade'
                    : null
                }`}
                defaultMessage="pricing.starter.startfreetrial"
            />
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
              <FormattedMessage
                id="pricing.professional.title"
                defaultMessage="Professional"
              />
            </h3>
            <p className="mb-6 text-gray-300">
              <FormattedMessage
                id="pricing.professional.subtitle"
                defaultMessage="Great for growing institutions"
              />
            </p>
            <div className="mb-2 text-4xl font-bold text-blue-400">
              <FormattedMessage
                id="pricing.professional.price"
                defaultMessage="$60"
              />
            </div>
            <div className="text-gray-400">
              <FormattedMessage
                id="pricing.professional.period"
                defaultMessage="month"
              />
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
            <FormattedMessage
              id="pricing.getStarted"
              defaultMessage="Get Started"
            />
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="transform rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10">
          <div className="mb-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">
              <FormattedMessage
                id="pricing.enterprise.title"
                defaultMessage="Enterprise"
              />
            </h3>
            <p className="mb-6 text-gray-400">
              <FormattedMessage
                id="pricing.enterprise.subtitle"
                defaultMessage="Best for large or multi-campus setups"
              />
            </p>
            <div className="mb-2 text-4xl font-bold text-blue-400">
              <FormattedMessage
                id="pricing.enterprise.price"
                defaultMessage="Custom"
              />
            </div>
            <div className="text-gray-400">
              <FormattedMessage
                id="pricing.enterprise.period"
                defaultMessage="month"
              />
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
            <FormattedMessage
              id="pricing.contactSales"
              defaultMessage="Contact Sales"
            />
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
      
        </main>   

    </div>
  );
};

export default PricingPage;
