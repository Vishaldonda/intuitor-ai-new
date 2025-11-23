import { ArrowLeft, Trophy, Award, Target, TrendingUp, Code } from 'lucide-react';

function ProfilePage({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const achievements = [
    { name: 'First Steps', description: 'Complete your first challenge', icon: '🎯', unlocked: true },
    { name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', unlocked: true },
    { name: 'Array Master', description: 'Master all array topics', icon: '📊', unlocked: true },
    { name: 'Speed Demon', description: 'Solve 5 problems under 5 minutes', icon: '⚡', unlocked: false },
    { name: 'Code Ninja', description: 'Solve 50 problems', icon: '🥷', unlocked: false },
    { name: 'Perfect Score', description: 'Get 100% on 10 challenges', icon: '💯', unlocked: false },
  ];

  const performanceData = [
    { week: 'W1', xp: 300 },
    { week: 'W2', xp: 450 },
    { week: 'W3', xp: 400 },
    { week: 'W4', xp: 650 },
    { week: 'W5', xp: 550 },
    { week: 'W6', xp: 800 },
  ];

  const maxXP = Math.max(...performanceData.map(d => d.xp));

  const skills = [
    { name: 'Arrays', level: 8, progress: 80, color: 'from-cyan-500 to-blue-600' },
    { name: 'Strings', level: 6, progress: 60, color: 'from-purple-500 to-pink-600' },
    { name: 'Hash Maps', level: 7, progress: 70, color: 'from-green-500 to-emerald-600' },
    { name: 'Recursion', level: 5, progress: 50, color: 'from-orange-500 to-red-600' },
    { name: 'HTML/CSS', level: 9, progress: 90, color: 'from-blue-500 to-purple-600' },
    { name: 'JavaScript', level: 4, progress: 40, color: 'from-yellow-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-8 py-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                12
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Learner Profile</h1>
                <p className="text-slate-400 mb-4">Member since November 2024</p>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                    <div className="text-slate-400 text-xs mb-1">Total XP</div>
                    <div className="text-cyan-400 font-bold text-lg">2,450</div>
                  </div>
                  <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                    <div className="text-slate-400 text-xs mb-1">Level</div>
                    <div className="text-white font-bold text-lg">12</div>
                  </div>
                  <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                    <div className="text-slate-400 text-xs mb-1">Streak</div>
                    <div className="text-orange-400 font-bold text-lg">7 Days</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm mb-2">Next Level</div>
              <div className="text-2xl font-bold text-white mb-3">Level 13</div>
              <div className="w-48">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-400 font-semibold">2,450 / 3,000 XP</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="w-4/5 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Performance Over Time</h2>
            </div>
            <div className="flex items-end justify-between h-48 gap-4">
              {performanceData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative" style={{ height: '160px' }}>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t-lg transition-all duration-500"
                         style={{ height: `${(data.xp / maxXP) * 100}%` }}>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs">{data.week}</div>
                  <div className="text-cyan-400 text-xs font-semibold">{data.xp}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Skills Mastered</h2>
            </div>
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <Code className="w-4 h-4 text-slate-400" />
                      <span className="text-white font-medium">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">Level {skill.level}</span>
                      <span className="text-cyan-400 text-sm font-semibold">{skill.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`bg-slate-900 border ${achievement.unlocked ? 'border-cyan-500/30' : 'border-slate-700'} rounded-xl p-4 text-center ${achievement.unlocked ? '' : 'opacity-40'}`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{achievement.name}</h3>
                <p className="text-slate-400 text-xs mb-3">{achievement.description}</p>
                {achievement.unlocked ? (
                  <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs">
                    <Award className="w-3 h-3" />
                    <span>Unlocked</span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs">Locked</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
