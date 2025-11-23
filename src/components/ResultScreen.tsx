import { CheckCircle2, XCircle, Clock, Zap, TrendingUp, ArrowRight } from 'lucide-react';

function ResultScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const isCorrect = true;
  const timeTaken = '5:42';
  const xpEarned = 250;
  const difficulty = 'Medium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          {isCorrect ? (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">Correct Answer!</h1>
              <p className="text-xl text-slate-300">Great job! You solved the problem efficiently.</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">Not Quite Right</h1>
              <p className="text-xl text-slate-300">Don't worry, let's review and try again!</p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{timeTaken}</div>
            <div className="text-slate-400 text-sm">Time Taken</div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{difficulty}</div>
            <div className="text-slate-400 text-sm">Difficulty</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">+{xpEarned} XP</div>
            <div className="text-blue-100 text-sm">Earned</div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Performance Analysis</h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Time Complexity</span>
                <span className="text-green-400 font-semibold">O(n) - Excellent</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Space Complexity</span>
                <span className="text-cyan-400 font-semibold">O(n) - Good</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="w-4/5 h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Code Quality</span>
                <span className="text-purple-400 font-semibold">92/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="w-11/12 h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">💡 Explanation</h2>
          <p className="text-slate-300 mb-4">
            Your solution uses a hash map to store previously seen numbers, allowing you to check in O(1) time if the complement exists. This is an optimal approach with O(n) time complexity and O(n) space complexity.
          </p>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-cyan-400 text-sm font-mono mb-2">Key Insight:</div>
            <p className="text-slate-400 text-sm">
              Instead of using nested loops (O(n²)), storing elements in a hash map as you iterate allows constant-time lookups, reducing the overall complexity to O(n).
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-3">🎯 Suggested Next Step</h3>
          <p className="text-slate-300 text-sm mb-4">
            You're mastering the Two Pointer technique! Try the next challenge: "Three Sum" to level up your skills even further.
          </p>
          <button
            onClick={() => onNavigate('question')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
          >
            Next Challenge
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('topic')}
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-500 transition-all"
          >
            Back to Topics
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
