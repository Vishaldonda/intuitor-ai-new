import { ArrowLeft, CheckCircle2, Circle, Lock } from 'lucide-react';

function TopicPage({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const subtopics = [
    { name: 'Array Basics', status: 'completed', xp: 150, level: 1 },
    { name: 'Array Operations', status: 'completed', xp: 200, level: 2 },
    { name: 'Two Pointer Technique', status: 'current', xp: 250, level: 3 },
    { name: 'Sliding Window', status: 'locked', xp: 300, level: 4 },
    { name: 'Array Patterns', status: 'locked', xp: 350, level: 5 },
    { name: 'Advanced Problems', status: 'locked', xp: 400, level: 6 },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'from-green-500 to-emerald-600';
    if (status === 'current') return 'from-cyan-500 to-blue-600';
    return 'from-slate-600 to-slate-700';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5" />;
    if (status === 'current') return <Circle className="w-5 h-5" />;
    return <Lock className="w-4 h-4" />;
  };

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

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg" />
            <div>
              <h1 className="text-4xl font-bold text-white">Arrays</h1>
              <p className="text-slate-400">Master array manipulation and algorithms</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-600 to-slate-700" />

              <div className="space-y-6">
                {subtopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className={`relative pl-20 ${topic.status === 'locked' ? 'opacity-50' : ''}`}
                  >
                    <div className={`absolute left-4 w-8 h-8 rounded-full bg-gradient-to-br ${getStatusColor(topic.status)} flex items-center justify-center text-white shadow-lg`}>
                      {getStatusIcon(topic.status)}
                    </div>

                    <div
                      onClick={() => topic.status !== 'locked' && onNavigate('question')}
                      className={`bg-slate-800 border border-slate-700 rounded-xl p-6 ${topic.status !== 'locked' ? 'hover:border-cyan-500 cursor-pointer' : ''} transition-all`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-semibold text-white">{topic.name}</h3>
                            <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">Level {topic.level}</span>
                          </div>
                          <p className="text-slate-400 text-sm">Complete challenges to earn XP</p>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-bold text-lg">+{topic.xp} XP</div>
                        </div>
                      </div>

                      {topic.status === 'completed' && (
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <div className="flex items-center gap-2 text-green-500 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mastered</span>
                          </div>
                        </div>
                      )}

                      {topic.status === 'current' && (
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm">Progress</span>
                            <span className="text-cyan-400 text-sm">60%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="w-3/5 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Overall Completion</span>
                    <span className="text-cyan-400 font-semibold">35%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="w-1/3 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Topics Mastered</span>
                    <span className="text-white font-semibold">2 / 6</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total XP Earned</span>
                    <span className="text-cyan-400 font-semibold">350 XP</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">XP to Unlock Next</span>
                    <span className="text-orange-400 font-semibold">250 XP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Pro Tip</h3>
              <p className="text-slate-300 text-sm">Master the Two Pointer Technique to unlock advanced array patterns and earn bonus XP!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicPage;
