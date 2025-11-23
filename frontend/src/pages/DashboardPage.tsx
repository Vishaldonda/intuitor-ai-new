/**
 * Dashboard Page - Main hub for user's learning journey
 * Shows progress, courses, and stats
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Flame, Trophy, TrendingUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { courseAPI, progressAPI } from '../services/api';
import XPBar from '../components/XPBar';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [courses, setCourses] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [coursesData, progressData] = await Promise.all([
        courseAPI.getCourses(),
        progressAPI.getUserProgress(user!.id),
      ]);

      setCourses(coursesData);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="w-6 h-6 text-cyan-400" />
          <span className="text-xl font-bold text-white">SkillForge</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg hover:border-cyan-500 transition-all"
          >
            <div className="text-right">
              <div className="text-sm text-slate-400">Level {user?.level}</div>
              <div className="text-xs text-cyan-400 font-semibold">
                {user?.xp} XP
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.level}
            </div>
          </button>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Welcome Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back, {user?.full_name}!
                </h2>
                <p className="text-slate-400">Continue your journey to mastery</p>
              </div>
              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-4 py-2 rounded-lg">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-white font-semibold">
                  {user?.streak} Day Streak
                </span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
              <XPBar currentXP={user?.xp || 0} level={user?.level || 1} />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-semibold">Your Stats</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Total Questions</p>
                <p className="text-2xl font-bold text-white">
                  {userProgress?.total_questions || 0}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Overall Accuracy</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {userProgress?.overall_accuracy?.toFixed(1) || 0}%
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Topics</p>
                <p className="text-2xl font-bold text-white">
                  {userProgress?.topic_progress?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Your Learning Paths</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500 transition-all cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">{course.name}</h4>
                <p className="text-slate-400 text-sm mb-3">
                  {course.total_topics} topics
                </p>
                <button className="w-full py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all">
                  Start Learning
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
