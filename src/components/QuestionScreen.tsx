import { ArrowLeft, Lightbulb, Play, SkipForward, Clock } from 'lucide-react';
import { useState } from 'react';

function QuestionScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your solution here

}`);
  const [showHint, setShowHint] = useState(false);
  const progress = 60;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-8 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => onNavigate('topic')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Topics
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">5:42</span>
            </div>
            <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg">
              <span className="text-cyan-400 font-semibold">+250 XP</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Challenge 3 of 5</span>
            <span className="text-cyan-400 text-sm font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </nav>

      <div className="flex-1 grid lg:grid-cols-2">
        <div className="border-r border-slate-700 p-8 overflow-y-auto bg-slate-900">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm rounded-full">
                Medium
              </span>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm rounded-full">
                Two Pointers
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-6">Two Sum</h1>

            <div className="prose prose-invert">
              <p className="text-slate-300 mb-4">
                Given an array of integers <code className="px-2 py-1 bg-slate-800 rounded text-cyan-400">nums</code> and an integer <code className="px-2 py-1 bg-slate-800 rounded text-cyan-400">target</code>, return indices of the two numbers such that they add up to target.
              </p>

              <p className="text-slate-300 mb-6">
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
              </p>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
                <div className="text-slate-400 text-sm mb-2">Example 1:</div>
                <div className="font-mono text-sm space-y-1">
                  <div><span className="text-slate-500">Input:</span> <span className="text-white">nums = [2,7,11,15], target = 9</span></div>
                  <div><span className="text-slate-500">Output:</span> <span className="text-green-400">[0,1]</span></div>
                  <div className="text-slate-400 text-xs mt-2">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-2">Example 2:</div>
                <div className="font-mono text-sm space-y-1">
                  <div><span className="text-slate-500">Input:</span> <span className="text-white">nums = [3,2,4], target = 6</span></div>
                  <div><span className="text-slate-500">Output:</span> <span className="text-green-400">[1,2]</span></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:border-yellow-500 hover:text-yellow-400 transition-all"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            {showHint && (
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  💡 Try using a hash map to store the numbers you've seen so far. For each number, check if (target - current number) exists in your map.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-slate-950">
          <div className="border-b border-slate-700 px-6 py-3 flex items-center justify-between bg-slate-900">
            <span className="text-slate-400 text-sm font-semibold">Solution</span>
            <select className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded px-3 py-1.5">
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
            </select>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="absolute inset-0 w-full h-full bg-slate-950 text-slate-100 font-mono text-sm p-6 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          <div className="border-t border-slate-700 p-4 bg-slate-900 flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-500 transition-all">
              <Play className="w-4 h-4" />
              Run Code
            </button>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg hover:border-slate-500 transition-all">
                <SkipForward className="w-4 h-4" />
                Skip
              </button>
              <button
                onClick={() => onNavigate('result')}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
