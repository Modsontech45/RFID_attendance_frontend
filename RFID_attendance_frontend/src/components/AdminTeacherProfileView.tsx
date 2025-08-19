import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthData, API_BASE } from '../utils/auth';
import { Mail, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';

interface TeacherData {
  full_name: string;
  email: string;
  bio: string;
  picture: string;
  created_at: string;
}

const AdminTeacherProfileView: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = getAuthData('token');
  const role = getAuthData('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    const fetchTeacher = async () => {
      try {
        const res = await fetch(`${API_BASE}/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch teacher');
        const data = await res.json();
        setTeacherData(data.teacher);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId, token, role, navigate]);

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString() : 'Unknown';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-semibold">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <p className="text-xl font-bold">Teacher not found</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 inline-flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white px-6 py-12">
      {/* Floating Go Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-lg transition-all text-white shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Home</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white/10 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center space-y-6">
          <img
            src={teacherData.picture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-green-500/50 shadow-lg"
          />
          <div className="inline-flex items-center space-x-2 justify-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {teacherData.full_name || 'Unnamed Teacher'}
            </h1>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>

          <div className="flex justify-center items-center space-x-3 text-gray-300">
            <Mail className="w-5 h-5 text-green-400" />
            <span>{teacherData.email}</span>
          </div>

          <div className="flex justify-center items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(teacherData.created_at)}</span>
          </div>

          <div className="mt-6 bg-black/30 p-4 rounded-lg whitespace-pre-line border border-white/20 text-gray-300 leading-relaxed text-sm sm:text-base">
            {teacherData.bio || 'No bio available.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherProfileView;
