/**
 * Profile Page - User stats and achievements
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, Flame, TrendingUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { progressAPI } from '../services/api';
import XPBar from '../components/XPBar';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await progressAPI.getUserStats(user!.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
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
      {/* Header */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-8 py-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.level}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.full_name}
              </h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          <XPBar currentXP={user?.xp || 0} level={user?.level || 1} />
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-cyan-400" />
              <h3 className="text-slate-400 text-sm">Total Questions</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.total_attempts}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-slate-400 text-sm">Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.accuracy.toFixed(1)}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-6 h-6 text-orange-400" />
              <h3 className="text-slate-400 text-sm">Streak</h3>
            </div>
            <p className="text-3xl font-bold text-white">{user?.streak} days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-slate-400 text-sm">Total XP</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.total_xp_earned}
            </p>
          </motion.div>
        </div>

        {/* Mistake Breakdown */}
        {stats.mistake_breakdown && Object.keys(stats.mistake_breakdown).length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Mistake Analysis
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.mistake_breakdown).map(
                ([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize">{type}</span>
                    <span className="text-cyan-400 font-semibold">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
