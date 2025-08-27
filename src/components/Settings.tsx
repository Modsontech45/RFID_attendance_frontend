import React, { useState, useEffect } from "react";
import { getAdminData, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useTerminology } from "../utils/terminology";
import {
  CreditCard,
  User,
  Building,
  GraduationCap,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  Calendar,
  Zap,
  Activity,
  Loader2,
} from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";

const SettingsComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
    const { formatMessage } = useIntl();
   

  const adminData = getAdminData();
  const SchoolName = adminData?.schoolname;
  const Username = adminData?.username || adminData?.email?.split("@")[0] || "admin";
  const plan = adminData?.subscription_plan || "unknown";
  const PlanType = adminData?.subscription_type || "Monthly";
  const subscriptionStatus = adminData?.subscription_status || "trial";
  const terminology = useTerminology(adminData);


  let PlanStartDate = "" //adminData?.subscription_start_date // ||  subscriptionStatus === "trial" ? adminData?.trial_start_date :adminData?.subscription_start_date;
  let PlanEndDate = ""// adminData?.subscription_end_date // || subscriptionStatus === "trial" ? adminData?.trial_end_date :adminData?.subscription_end_date;

  if (subscriptionStatus === "trial"){
    PlanStartDate = adminData?.trial_start_date
    PlanEndDate = adminData?.trial_end_date 

  } else if (subscriptionStatus === "active"){

    PlanEndDate = adminData?.subscription_end_date
    PlanStartDate = adminData?.subscription_start_date
  }
  else if (subscriptionStatus === "expired") {
    PlanStartDate = adminData?.subscription_start_date
    PlanEndDate = adminData?.subscription_end_date
  }


// if daysLeft is negative, set it to 0
  const daysLeft =  Math.ceil((new Date(PlanEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  let resdays = daysLeft;
  if (daysLeft < 0) {
    resdays = 0;
  } 
  const Email = adminData?.email || "admin@centralhigh.edu";
  const datejoin = adminData?.created_at || "2024-01-15";
  let MoneyPaid = 0
  const daypercentage = Math.max((resdays * 100) / 31)
  if (plan === "starter" && subscriptionStatus !== "trial") {
    MoneyPaid = 35;
  } else if (plan === "professional") {
    MoneyPaid = 65;
  } else if (plan === "enterprise") {
    MoneyPaid = 170;
  }
  let Cardbalance  = MoneyPaid * (daypercentage / 100).toFixed(2);

  useEffect(() => {
    const loadSubscriptionData = async () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    };
    loadSubscriptionData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-900/30";
      case "expired":
        return "text-red-400 bg-red-900/30";
      case "trial ":
        return "text-yellow-400 bg-yellow-900/30";
      default:
        return "text-gray-300 bg-gray-700";
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days > 25) return "text-green-400";
    if (days > 15) return "text-yellow-400";
    return "text-red-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e141b] flex items-center justify-center text-white">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          <span className="text-gray-300"> <FormattedMessage
                          id="AdminProfile.loading"
                          defaultMessage="Loading Profile"
                        /></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e141b] text-white">
      {/* Header */}
      <div className="bg-[#1e2a38] border-b border-[#263445] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold"><FormattedMessage
                          id="AdminProfile.title"
                          defaultMessage="Admin Profile"
                        /></h1>
            </div>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="mt-2 inline-block text-blue-400 hover:text-blue-200 transition"
            >
              <span className="ring-1 rounded-md border border-blue-400/50 bg-blue-900/20 px-3 py-1 text-sm backdrop-blur">
             <FormattedMessage
                          id="AdminProfile.back"
                          defaultMessage="Back to Dashboards"
                        />
              </span>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            <span>
                <FormattedMessage
                          id="AdminProfile.logout"
                          defaultMessage="Logout"
                        />
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Info */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e2a38] rounded-lg p-6 border border-[#263445] shadow">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-semibold">
                   <FormattedMessage
                          id="AdminProfile.subscriptionInfo"
                          defaultMessage="Subscription Information"
                        />
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Info label={<FormattedMessage
                          id="AdminProfile.subscriptionPlan"
                          defaultMessage="Subscription Plan"
                        />} icon={<Zap className="h-5 w-5 text-blue-400" />} value={plan} />
                <StatusBadge label="Status" status={subscriptionStatus} />
                <Info label={<FormattedMessage
                          id="AdminProfile.subscriptionPlan"
                          defaultMessage="Subscription Plan"
                        />} icon={<Calendar className="h-5 w-5 text-gray-400" />} value={PlanType} />
                <Info label={<FormattedMessage
                          id="AdminProfile.daysLeft"
                          defaultMessage="Days Left"
                        />} icon={<Clock className="h-5 w-5 text-gray-400" />} value={`${resdays} ${formatMessage({ id: "AdminProfile.days" })}`} className={getDaysLeftColor(resdays)} />
                <Info label={<FormattedMessage
                          id="AdminProfile.joinedOn"
                          defaultMessage="Joined On"
                        />} value={formatDate(datejoin)} />
                <Info label={<FormattedMessage
                          id="AdminProfile.startDate"
                          defaultMessage="Start Date"
                        />} value={formatDate(PlanStartDate)} />
                <Info label={<FormattedMessage
                          id="AdminProfile.endDate"
                          defaultMessage="End Date"
                        />} value={formatDate(PlanEndDate)} />
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span><FormattedMessage
                          id="AdminProfile.Subscriptionprogress"
                          defaultMessage="  Subscription Progress"
                        /></span>
                  <span>{resdays} <FormattedMessage
                          id="AdminProfile.daysremaining"
                          defaultMessage="Days remaining"
                        /></span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      resdays > 20 ? "bg-green-500" : resdays > 10 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.max((resdays / 31) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* School Info */}
            <div className="bg-[#1e2a38] rounded-lg p-6 border border-[#263445] shadow">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold">
                  {terminology.companyInfo}
                </h3>
              </div>
              <Info label={terminology.companyName} icon={<GraduationCap className="h-4 w-4 text-gray-400" />} value={SchoolName} />
              <Info label={<FormattedMessage
                          id="AdminProfile.username"
                          defaultMessage="Admin Username"
                        />} icon={<User className="h-4 w-4 text-gray-400" />} value={Username} />
            </div>

            {/* Card Summary */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#6d28d9] rounded-lg p-6 shadow text-white">
              <div className="flex items-center space-x-3 mb-3">
                <Activity className="h-6 w-6" />
                <h3 className="text-lg font-semibold">
                  <span> <FormattedMessage
                          id="AdminProfile.cardbalance"
                          defaultMessage="Card Balance"
                        />{` $${Cardbalance}`}</span>
                </h3>
              </div>
              <SummaryRow label={<FormattedMessage
                          id="AdminProfile.subscriptionPlan"
                          defaultMessage="Subscription Plan"
                        />} value={plan} />
              <SummaryRow label={<FormattedMessage
                          id="AdminProfile.status"
                          defaultMessage="Status"
                        />} value={subscriptionStatus} />
              <SummaryRow label={<FormattedMessage
                          id="AdminProfile.daysLeft"
                          defaultMessage="Days Left"
                        />} value={`${resdays}`} />
              <SummaryRow label={terminology.companyName} value={SchoolName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({
  label,
  icon,
  value,
  className = "",
}: {
  label: string;
  icon?: React.ReactNode;
  value: string | undefined;
  className?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-400">{label}</label>
    <div className="flex items-center space-x-2">
      {icon}
      <span className={`font-medium ${className}`}>{value}</span>
    </div>
  </div>
);

const StatusBadge = ({ label, status }: { label: string; status: string }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-400">{label}</label>
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      <CheckCircle className="h-4 w-4 mr-1" />
      {status}
    </span>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "text-green-400 bg-green-900/30";
    case "expired":
      return "text-red-400 bg-red-900/30";
    case "pending":
      return "text-yellow-400 bg-yellow-900/30";
    default:
      return "text-gray-300 bg-gray-700";
  }
};

const SummaryRow = ({ label, value }: { label: string; value: string | undefined }) => (
  <div className="flex justify-between text-sm">
    <span className="text-blue-100">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default SettingsComponent;
