import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, logout, getApiKey, API_BASE, getAdminData } from '../utils/auth';
import {
  Shield,
  ArrowLeft,
  Wifi,
  WifiOff,
  Users,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Loader2,
  Building
} from 'lucide-react';
import {  useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";
// import LanguageSwitcher from "./LanguageSwitcher";

interface Device {
  device_uid: string;
  device_name: string;
  last_seen: string;
  created_at: string;
}

interface ScanData {
  uid: string;
  message: string;
  exists: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface RegistrationFormData {
  name: string;
  email: string;
  telephone: string;
  form: string;
  gender: string;
}

const SchoolManagement: React.FC = () => {
  const navigate = useNavigate();
const { formatMessage } = useIntl();
  const { locale } = useLocalIntl();

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deviceUid, setDeviceUid] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [deviceScans, setDeviceScans] = useState<Map<string, ScanData>>(new Map());
  const [showRegistrationForms, setShowRegistrationForms] = useState<Set<string>>(new Set());
  const [pollIntervals, setPollIntervals] = useState<Map<string, NodeJS.Timeout>>(new Map());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
 
  const token = getAuthData('token');
  const apiKey = getApiKey();
  const adminData = getAdminData();

  // Extract admin info with fallbacks
  const schoolName = adminData?.schoolname || adminData?.email?.split('@')[1]?.split('.')[0] || 'Synctuario Academy';
  const username = adminData?.username || adminData?.email?.split('@')[0] || 'admin_user';
   const subscription = adminData?.subscription_status || (
    <button>subscribe</button>
  );

  const handleLogout = () => {
    // Cleanup all polling intervals before logout
    pollIntervals.forEach(interval => clearInterval(interval));
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleGoHome = () => {
    navigate('/admin/dashboard');
  };
  function handleSubscriptionClick() {
  console.log("Subscription is not active — show modal or redirect");
  navigate("/pricing");
}

  useEffect(() => {
    const role = getAuthData('role');

    if (!token || role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchDevices();
    fetchCategories();

    // Add a small delay for smooth loading animation
    setTimeout(() => setIsLoaded(true), 300);

    return () => {
      // Cleanup all polling intervals on unmount
      pollIntervals.forEach(interval => clearInterval(interval));
    };
  }, [navigate, token]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        headers: {
          'x-api-key': apiKey || '',
          'Accept-Language': locale,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_BASE}/devices?api_key=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        setDevices(Array.isArray(data) ? data : []);

        // Start polling for each device
        data.forEach((device: Device) => {
          startPollingDevice(device.device_uid);
        });
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDeviceStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/devices?api_key=${apiKey}`);
      if (response.ok) {
        const data = await response.json();
        setDevices(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  };

  // Update device status every 5 seconds
  useEffect(() => {
    const statusInterval = setInterval(updateDeviceStatus, 5000);
    return () => clearInterval(statusInterval);
  }, []);

  const startPollingDevice = (device_uid: string) => {
    // Clear existing interval if any
    const existingInterval = pollIntervals.get(device_uid);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    const interval = setInterval(() => {
      pollDeviceForScans(device_uid);
    }, 2000);

    setPollIntervals(prev => new Map(prev.set(device_uid, interval)));
  };

  const stopPollingDevice = (device_uid: string) => {
    const interval = pollIntervals.get(device_uid);
    if (interval) {
      clearInterval(interval);
      setPollIntervals(prev => {
        const newMap = new Map(prev);
        newMap.delete(device_uid);
        return newMap;
      });
    }
  };

  const pollDeviceForScans = async (device_uid: string) => {
    try {
      const response = await fetch(`${API_BASE}/scan/queue?device_uid=${device_uid}`);
      if (response.ok) {
        const data = await response.json();
        const scanData = Array.isArray(data) ? data[0] : null;

        if (scanData && scanData.uid) {
          console.log(`Scan detected for device ${device_uid}:`, scanData);

          // Update scan data
          setDeviceScans(prev => new Map(prev.set(device_uid, scanData)));

          // Stop polling temporarily
          stopPollingDevice(device_uid);

          if (!scanData.exists) {
            // Show registration form for new student
            setShowRegistrationForms(prev => new Set(prev.add(device_uid)));
          } else {
            // Existing student - resume polling after delay
            setTimeout(() => {
              setDeviceScans(prev => {
                const newMap = new Map(prev);
                newMap.delete(device_uid);
                return newMap;
              });
              startPollingDevice(device_uid);
            }, 3000);
          }
        }
      }
    } catch (error) {
      console.error(`Error polling device ${device_uid}:`, error);
    }
  };

  const registerDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceUid.trim() || !deviceName.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/devices/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({
          device_uid: deviceUid,
          device_name: deviceName,
          api_key: apiKey
        })
      });

      const data = await response.json();
      setFormMessage(data.message || data.error || 'Unknown error');

      if (response.ok) {
        setShowAddForm(false);
        setDeviceUid('');
        setDeviceName('');
        setFormMessage('');
        fetchDevices();
      }
    } catch (error) {
      console.error('Error registering device:', error);
      setFormMessage('Error registering device');
    }
  };

  const deleteDevice = async (device_uid: string) => {
    if (!confirm(`Are you sure you want to delete device: ${device_uid}?`)) return;

    try {
      const response = await fetch(`${API_BASE}/devices/${device_uid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({ api_key: apiKey })
      });

      if (response.ok) {
        // Stop polling for this device
        stopPollingDevice(device_uid);
        fetchDevices();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete device');
      }
    } catch (error) {
      console.error('Error deleting device:', error);
      alert('Error deleting device');
    }
  };

  const isDeviceOnline = (lastSeen: string): boolean => {
    if (!lastSeen) return false;
    const lastSeenDate = new Date(lastSeen);
    if (isNaN(lastSeenDate.getTime())) return false;

    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - lastSeenDate.getTime()) / 1000);
    return diffSeconds < 30; // Online if seen in last 30 seconds
  };

  const formatTimeAgo = (lastSeen: string): string => {
    if (!lastSeen) return 'Never';

    const lastSeenDate = new Date(lastSeen);
    if (isNaN(lastSeenDate.getTime())) return 'Invalid date';

    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) {
      return `${formatMessage({ id: "schoolManagement.justNow" })}`;
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin === 1 ? '' : 's'}   ${formatMessage({ id: "schoolManagement.ago" })}`;
    } else if (diffHr < 24) {
      return `${diffHr}  ${formatMessage({ id: "schoolManagement.hoursAgo" })}${diffHr === 1 ? '' : 's'}   ${formatMessage({ id: "schoolManagement.ago" })}`;
    } else if (diffDay === 1) {
      return ` ${formatMessage({ id: "schoolManagement.yesterday" })} ${lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return lastSeenDate.toLocaleString();
    }
  };

  const getScanStatus = (device_uid: string) => {
    const scanData = deviceScans.get(device_uid);
    const showForm = showRegistrationForms.has(device_uid);

    if (scanData) {
      if (showForm) {
        return {
          text: ` ${formatMessage({ id: "schoolManagement.newStudentDetected" })}: ${scanData.uid}`,
          className: 'text-orange-400 font-semibold',
          icon: <AlertCircle className="w-4 h-4" />
        };
      } else {
        return {
          text: `${formatMessage({ id: "schoolManagement.scanDetected" })}: ${scanData.uid} | ${scanData.message}`,
          className: 'text-blue-400 font-semibold',
          icon: <CheckCircle className="w-4 h-4" />
        };
      }
    }

    return {
      text: `${formatMessage({ id: "schoolManagement.waitingForScan" })}`,
      className: 'text-yellow-400 font-semibold flex items-center gap-2',
      icon: <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
    };
  };

  // Submit student registration
  const submitStudentRegistration = async (device_uid: string, formData: RegistrationFormData) => {
    try {
      const scanData = deviceScans.get(device_uid);
      if (!scanData) {
        throw new Error('No scan data found');
      }

      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({
          uid: scanData.uid,
          name: formData.name,
          email: formData.email,
          telephone: formData.telephone,
          form: formData.form,
          gender: formData.gender,
          student_id: Math.random().toString(36).substring(2, 10),
          api_key: apiKey
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Hide registration form
        setShowRegistrationForms(prev => {
          const newSet = new Set(prev);
          newSet.delete(device_uid);
          return newSet;
        });

        // Clear scan data
        setDeviceScans(prev => {
          const newMap = new Map(prev);
          newMap.delete(device_uid);
          return newMap;
        });

        // Resume polling after delay
        setTimeout(() => {
          startPollingDevice(device_uid);
         
        }, 2000);
         return { success: true, message: result.message || 'Registration successful!' };

      } else {
        return { success: false, message: result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      return { success: false, message: 'Registration error. Please try again.' };
    }
  };

  // Show loading state while translations are loading
  if (isLoading|| !isLoaded) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
            <Building className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
             {formatMessage({ id: "students.loading.students" })}
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {schoolName}
                </span>
                <div className="text-xs text-gray-400">@{username}</div>
              </div>
            </div>


                  <span
                  onClick={
                   
                      () => handleSubscriptionClick()
                     
                  }
                  className={`px-3 py-1 rounded-full text-white font-medium text-sm cursor-pointer ${
                    subscription === "active"
                      ? "bg-green-800 cursor-default"
                      : "bg-red-800 hover:opacity-80"
                  }`}
                >
                  {subscription === "active"
                    ? formatMessage({ id: "pricing.starter.subscribed" })
                    : subscription === "trial"
                    ? formatMessage({ id: "pricing.starter.freeplan" })
                    : formatMessage({ id: "pricing.starter.subscribeNow" })}
                </span>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "schoolManagement.dashboard" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button className="relative group px-4 py-2 rounded-lg bg-white/10 transition-all duration-300">
                  <span className="text-blue-400 transition-colors">
                    {formatMessage({ id: "schoolManagement.schoolManagement" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                </button>

                <button
                  onClick={() => navigate('/admin/students')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                   {formatMessage({ id: "schoolManagement.students" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate('/admin/attendance')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                     {formatMessage({ id: "schoolManagement.attendance" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate('/admin/reports')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {formatMessage({ id: "schoolManagement.reports" })}
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                  onClick={() => navigate('/docs')}
                  className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Docs
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                {/* <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </button> */}


           
{/* 
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button> */}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-99 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <nav className="pb-4 border-t border-white/10 pt-4 space-y-2">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {formatMessage({ id: "schoolManagement.dashboard" })}
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-white/10 text-blue-400">
                {formatMessage({ id: "schoolManagement.title" })}
              </button>
              <button
                onClick={() => navigate('/admin/students')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {formatMessage({ id: "schoolManagement.students" })}
              </button>
              <button
                onClick={() => navigate('/admin/attendance')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {formatMessage({ id: "schoolManagement.attendance" })}
              </button>
              <button
                onClick={() => navigate('/admin/reports')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                {formatMessage({ id: "schoolManagement.reports" })}
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              >
                Documentation
              </button>

              <div className="pt-4 border-t border-white/10">
            

                {/* <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button> */}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-8">

        {/* Page Header */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              {formatMessage({ id: "schoolManagement.title" })}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {formatMessage({ id: "schoolManagement.subtitle" })}
            </p>
          </div>
        </section>

        {/* Controls */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white"> {formatMessage({ id: "schoolManagement.registeredDevices" })}</h2>
                <p className="text-gray-300"> {formatMessage({ id: "schoolManagement.monitorDevices" })}</p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>{showAddForm ? formatMessage({ id: "schoolManagement.cancel" }) : formatMessage({ id: "schoolManagement.addDevice" })}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Add Device Form */}
        {showAddForm && (
          <section className="animate-slide-up">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg max-w-md mx-auto">
              <form onSubmit={registerDevice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{formatMessage({ id: "schoolManagement.deviceUid" })}</label>
                  <input
                    type="text"
                    value={deviceUid}
                    onChange={(e) => setDeviceUid(e.target.value)}
                    placeholder={formatMessage({ id: "schoolManagement.enterDeviceUid" })}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{formatMessage({ id: "schoolManagement.deviceName" })}</label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder={formatMessage({ id: "schoolManagement.enterDeviceName" })}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                 {formatMessage({ id: "schoolManagement.registerDevice" })}
                </button>
                {formMessage && (
                  <p className={`text-sm mt-2 ${formMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                    {formMessage}
                  </p>
                )}
              </form>
            </div>
          </section>
        )}

        {/* Devices Grid */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                <span className="text-gray-300 text-lg">{formatMessage({ id: "schoolManagement.loadingDevices" })}</span>
              </div>
            </div>
          )}

          {/* Devices Grid */}
          {!isLoading && (
            <div className="space-y-6">
              {devices.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{formatMessage({ id: "schoolManagement.noDevicesRegistered" })}</h3>
                  <p className="text-gray-400">{formatMessage({ id: "schoolManagement.addFirstDevice" })}</p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {devices.map((device, index) => {
                    const isOnline = isDeviceOnline(device.last_seen);
                    const timeAgo = formatTimeAgo(device.last_seen);
                    const scanStatus = getScanStatus(device.device_uid);
                    const showForm = showRegistrationForms.has(device.device_uid);

                    return (
                      <div
                        key={device.device_uid}
                        className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-blue-400 mb-2">{device.device_name}</h3>
                            <p className="text-sm text-gray-400 mb-2">
                              UID: <code className="bg-gray-700 px-2 py-1 rounded text-xs">{device.device_uid}</code>
                            </p>

                            <div className="flex items-center gap-2 mb-2">
                              {isOnline ? (
                                <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
                              ) : (
                                <WifiOff className="w-4 h-4 text-red-400" />
                              )}
                              <span className={`text-sm font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                                {isOnline ? formatMessage({ id: "schoolManagement.online" }) : formatMessage({ id: "schoolManagement.offline" })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className={`text-sm ${isOnline ? 'text-green-300' : 'text-red-300'}`}>
                                {formatMessage({ id: "schoolManagement.lastSeen" })} {timeAgo}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {scanStatus.icon}
                              <span className={scanStatus.className}>
                                {scanStatus.text}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteDevice(device.device_uid)}
                            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors duration-200"
                            title={formatMessage({ id: "schoolManagement.deleteDevice" })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {showForm && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-500/30">
                            <h4 className="text-lg font-semibold text-blue-300 mb-4">{formatMessage({ id: "schoolManagement.registerNewStudent" })}</h4>
                            <StudentRegistrationForm
                              device_uid={device.device_uid}
                              categories={categories}
                              onSubmit={submitStudentRegistration}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

interface StudentRegistrationFormProps {
  device_uid: string;
  categories: Category[];
  onSubmit: (device_uid: string, formData: RegistrationFormData) => Promise<{ success: boolean; message: string }>;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ device_uid, categories, onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    telephone: '',
    form: '',
    gender: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { formatMessage } = useIntl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const result = await onSubmit(device_uid, formData);

    setMessage(result.message);
    setSubmitting(false);

    if (result.success) {
      // Form will be hidden by parent component
      setFormData({
        name: '',
        email: '',
        telephone: '',
        form: '',
        gender: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder={formatMessage({ id: "schoolManagement.studentName" })}
        required
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder={formatMessage({ id: "schoolManagement.emailAddress" })}
        required
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />

      <input
        type="tel"
        name="telephone"
        value={formData.telephone}
        onChange={handleChange}
        placeholder={formatMessage({ id: "schoolManagement.phoneNumber" })}
        required
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />

      <select
        name="form"
        value={formData.form}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        <option value="">{formatMessage({ id: "schoolManagement.selectClass" })}</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        <option value="">{formatMessage({ id: "schoolManagement.selectGender" })}</option>
        <option value="Male">{formatMessage({ id: "schoolManagement.male" })}</option>
        <option value="Female">{formatMessage({ id: "schoolManagement.female" })}</option>
        <option value="Other">{formatMessage({ id: "schoolManagement.other" })}</option>
      </select>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {submitting ? formatMessage({ id: "schoolManagement.registering" }) : formatMessage({ id: "schoolManagement.registerStudent" })}
      </button>

      {message && (
        <p className={`text-sm mt-2 ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default SchoolManagement;