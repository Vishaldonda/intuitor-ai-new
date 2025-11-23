import { Rocket, Code, Trophy, TrendingUp } from 'lucide-react';

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="px-8 py-6 flex justify-between items-center border-b border-blue-800/30">
        <div className="flex items-center gap-2">
          <Code className="w-8 h-8 text-cyan-400" />
          <span className="text-2xl font-bold text-white">SkillForge</span>
        </div>
        <button className="px-6 py-2 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 transition-all">
          Sign In
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DSA & Web Dev</span>
            <br />Through Skill-Based Learning
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Level up your coding skills with an interactive learning platform. Track XP, unlock achievements, and master DSA, HTML, CSS & JavaScript.
          </p>
          <button
            onClick={onStart}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
          >
            Start Learning
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-20">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">XP System</h3>
            <p className="text-slate-400 text-sm">Gain experience points as you complete challenges and level up your skills</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Achievements</h3>
            <p className="text-slate-400 text-sm">Unlock badges and achievements as you master different topics</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Live Coding</h3>
            <p className="text-slate-400 text-sm">Practice with interactive code editor and instant feedback</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Roadmap</h3>
            <p className="text-slate-400 text-sm">Follow structured learning paths from basics to advanced</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
