import React, { useState, useEffect } from "react";
import { getAuthData, logout, getApiKey, getAdminData } from "../utils/auth";
import { useNavigate } from "react-router-dom";
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
import { Navigate } from "react-router-dom";

interface SubscriptionData {
  plan: string;
  status: string;
  type: string;
  joinDate: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
}

interface AdminData {
  schoolname?: string;
  username?: string;
  email?: string;
  subscription_status?: string;
}
const adminData = getAdminData();
  const SchoolName = adminData?.schoolname 
  const Username = adminData?.username || adminData?.email?.split("@")[0] || "admin";
  const plan = adminData?.subscription_plan || "trial";
  const PlanType = adminData?.subscription_type || "Monthly";
  const subscriptionStatus = adminData?.subscription_status || "active";
  const PlanStartDate = adminData?.subscription_start_date || "2024-01-01";
  const PlanEndDate = adminData?.subscription_end_date || "2025-01-01";
  const daysLeft =  Math.ceil((new Date(PlanEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const Email = adminData?.email || "admin@centralhigh.edu";
   const datejoin = adminData?.created_at || "2024-01-15";
const SettingsComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();




 

  useEffect(() => {
    // Simulate loading subscription data
    const loadSubscriptionData = async () => {
      try {
        setIsLoading(true);
        // In real implementation, fetch from API
        // const token = getAuthData("token");
        // const response = await postData(`${API_BASE}/subscription`, {}, token);
        // setSubscriptionData(response.data);
        
        // Simulate API call delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading subscription data:", error);
        setIsLoading(false);
      }
    };

    loadSubscriptionData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days > 30) return 'text-green-600';
    if (days > 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
               <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>
             <button onClick={() => navigate("/admin/dashboard")}
              className="mt-2 text-blue-600 hover:text-blue-800 transition-colors">
           <span
  className="relative ring-1  transform rounded-2xl border-2 border-blue-700/50 bg-gradient-to-br from-blue-00/20 to-cyan-600/20 mt-8 p-1 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-blue-600/30"
>
  Back to Dashboard
</span>


             </button>

            </div>
           
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Subscription Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Subscription Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Plan */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Subscription Plan
                  </label>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">{plan}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionStatus)}`}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {subscriptionStatus}
                  </span>
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Subscription Type
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900">{PlanType}</span>
                  </div>
                </div>

                {/* Days Left */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Days Left
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className={`text-lg font-semibold ${getDaysLeftColor(daysLeft)}`}>
                      {daysLeft} days
                    </span>
                  </div>
                </div>

                {/* Join Date */}
                <div className="space-y-2">
                 <p>Join our platform on</p>
                  <span className="text-gray-900">{formatDate(datejoin)}</span>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <p>Subscription Start Date</p>
                  <span className="text-gray-900">{formatDate(PlanStartDate)}</span>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <p>Subscription End Date</p>
                  <span className="text-gray-900">{formatDate(PlanEndDate )}</span>
                </div>
              </div>

              {/* Progress Bar for Days Left */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subscription Progress</span>
                  <span>{daysLeft} days remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      daysLeft > 20 ? 'bg-green-500' :
                      daysLeft > 15 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max((daysLeft / 30) * 100, 5)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Sidebar */}
          <div className="space-y-6">
            
            {/* School Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  School Information
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    School Name
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <GraduationCap className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-900 font-medium">{SchoolName}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Admin Username
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-900 font-medium">{Username}</span>
                  </div>
                </div>
              </div>
            </div>

       

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <Activity className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Your Card</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-100">Plan:</span>
                  <span className="font-medium">{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Status:</span>
                  <span className="font-medium">{subscriptionStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Days Left:</span>
                  <span className="font-medium">{ daysLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">School:</span>
                  <span className="font-medium truncate">{SchoolName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;