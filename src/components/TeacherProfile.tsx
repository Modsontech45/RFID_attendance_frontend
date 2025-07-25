import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getAuthData,
  logout,
  getAdminData,
  getApiKey,
  API_BASE
} from '../utils/auth';
import {
  Shield,
  User,
  Edit,
  Save,
  Home,
  LogOut,
  Camera,
  FileText,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Bell,
  BarChart3
} from 'lucide-react';
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";


interface TeacherData {
  full_name: string;
  email: string;
  bio: string;
  picture: string;
  created_at: string;
}

const TeacherProfile: React.FC = () => {
  const navigate = useNavigate();
 const { formatMessage } = useIntl();
  const { locale, } = useLocalIntl();

  const [teacherData, setTeacherData] = useState<TeacherData>({
    full_name: '',
    email: '',
    bio: '',
    picture: '',
    created_at: ''
  });

  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    picture: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const token = getAuthData('token');
  const apiKey = getApiKey();
  const adminData = getAdminData();

  const schoolName = adminData?.schoolname || adminData?.email?.split('@')[1]?.split('.')[0] || 'Synctuario Academy';
  const username = adminData?.username || adminData?.email?.split('@')[0] || 'admin_user';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  const handleLogout = () => {
    logout();
  };

  const loadProfile = async () => {
    if (!token) {
      navigate('/teacher/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/teachers/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');

      setTeacherData(data.teacher);
      setEditForm({
        full_name: data.teacher.full_name || '',
        bio: data.teacher.bio || '',
        picture: data.teacher.picture || ''
      });
    } catch (error) {
      setMessage('Failed to load profile');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = (editing: boolean) => {
    setIsEditing(editing);
    if (editing) {
      setEditForm({
        full_name: teacherData.full_name,
        bio: teacherData.bio,
        picture: teacherData.picture
      });
    }
    setMessage('');
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/teachers/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update failed');

      setTeacherData({ ...teacherData, ...editForm });
      setIsEditing(false);
      setMessage('Profile updated successfully');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to save profile');
      setMessageType('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInputChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString() : 'Unknown';

  useEffect(() => {
    const role = getAuthData('role');
    const allowedRoles = ['teacher', 'admin'];

    if (!token || !allowedRoles.includes(role)) {
      navigate('/teacher/login');
      return;
    }

    loadProfile();
  }, [navigate, token, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <User className="w-6 h-6" />
          </div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
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

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/teacher/students')}
                className="relative group px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-gray-300 group-hover:text-white transition-colors flex items-center space-x-2">
                  <Home className="w-4 h-4" />
              
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></div>
              </button>

            

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </button>

            
            
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
              <span className="text-gray-300 text-lg">Loading profile...</span>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {!isLoading && (
           <div className="space-y-8 animate-fade-in">

          {/* Profile Header */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              {/* Profile Picture */}
              <div className="relative inline-block">
                <img
                  src={teacherData.picture || "https://via.placeholder.com/150"}
                  alt="Profile Picture"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500/50 shadow-2xl mx-auto"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {teacherData.full_name || formatMessage({ id: "profile.unnamed" })}
                </h1>

                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span className="text-lg">{teacherData.email}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    <FormattedMessage id="profile.joined" /> {formatDate(teacherData.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Message */}
          {message && (
            <div className={`border rounded-xl p-4 text-center flex items-center justify-center space-x-3 animate-fade-in ${
              messageType === 'success'
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>
                {formatMessage({ id: messageType === 'success' ? "profile.success" : "profile.error" })}
              </span>
            </div>
          )}

          {/* Profile Details */}
          <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  <FormattedMessage id="profile.section.title" />
                </h2>
              </div>

              {!isEditing && (
                <button
                  onClick={() => toggleEdit(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>
                    <FormattedMessage id="profile.edit" />
                  </span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Profile Picture URL */}
              <div className="space-y-2">
                <label className="block font-semibold text-sm text-green-300">
                  <FormattedMessage id="profile.picture" />
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="text"
                      value={editForm.picture}
                      onChange={(e) => handleInputChange('picture', e.target.value)}
                      placeholder={formatMessage({ id: "profile.editform.placeholder.picture" })}
                      className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <p className="text-gray-300 bg-black/30 rounded-xl p-3 border border-white/10">
                    {teacherData.picture || formatMessage({ id: "profile.noPicture" })}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="block font-semibold text-sm text-green-300">
                  <FormattedMessage id="profile.fullname" />
                </label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder={formatMessage({ id: "profile.editform.placeholder.name" })}
                      className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <p className="text-gray-300 bg-black/30 rounded-xl p-3 border border-white/10">
                    {teacherData.full_name || formatMessage({ id: "profile.unnamed" })}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block font-semibold text-sm text-green-300">
                  <FormattedMessage id="profile.bio" />
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-green-400" />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder={formatMessage({ id: "profile.editform.placeholder.bio" })}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none"
                    />
                  </div>
                ) : (
                  <p className="text-gray-300 bg-black/30 rounded-xl p-3 border border-white/10 whitespace-pre-line">
                    {teacherData.bio || formatMessage({ id: "profile.noBio" })}
                  </p>
                )}
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => toggleEdit(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    <FormattedMessage id="profile.cancel" />
                  </button>

                  <button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2 shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          <FormattedMessage id="profile.saving" />
                        </span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>
                          <FormattedMessage id="profile.save" />
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
};

export default TeacherProfile;