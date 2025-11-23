import { Flame, Trophy, Code, Clock } from 'lucide-react';

function Dashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const xp = 2450;
  const level = 12;
  const xpForNextLevel = 3000;
  const xpProgress = (xp / xpForNextLevel) * 100;
  const streak = 7;

  const courses = [
    {
      name: 'Data Structures & Algorithms',
      progress: 65,
      color: 'from-cyan-500 to-blue-600',
      xp: 1200
    },
    {
      name: 'HTML',
      progress: 90,
      color: 'from-orange-500 to-red-600',
      xp: 450
    },
    {
      name: 'CSS',
      progress: 75,
      color: 'from-blue-500 to-purple-600',
      xp: 380
    },
    {
      name: 'JavaScript',
      progress: 40,
      color: 'from-yellow-500 to-orange-600',
      xp: 420
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="w-6 h-6 text-cyan-400" />
          <span className="text-xl font-bold text-white">SkillForge</span>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg hover:border-cyan-500 transition-all"
        >
          <div className="text-right">
            <div className="text-sm text-slate-400">Level {level}</div>
            <div className="text-xs text-cyan-400 font-semibold">{xp} XP</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {level}
          </div>
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Learner!</h2>
                <p className="text-slate-400">Continue your journey to mastery</p>
              </div>
              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-4 py-2 rounded-lg">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-white font-semibold">{streak} Day Streak</span>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-semibold">Level {level} Progress</span>
                <span className="text-cyan-400 text-sm">{xp} / {xpForNextLevel} XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-semibold">Today's Goal</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">Complete 3 challenges to maintain your streak</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-slate-300 text-sm">Complete 1 DSA problem</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 text-xs">2</div>
                <span className="text-slate-400 text-sm">Practice HTML/CSS</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 text-xs">3</div>
                <span className="text-slate-400 text-sm">JavaScript exercise</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('topic')}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Continue Learning
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Your Learning Paths</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('topic')}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">{course.name}</h4>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-400">{course.progress}% Complete</span>
                  <span className="text-cyan-400 font-semibold">{course.xp} XP</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
