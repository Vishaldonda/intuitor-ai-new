/**
 * Question Page - Main learning interface
 * Displays questions and handles answer submission
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { questionAPI, evaluationAPI } from '../services/api';
import { useUser } from '../context/UserContext';
import MCQQuestion from '../components/MCQQuestion';
import CodeEditor from '../components/CodeEditor';
import LevelUpModal from '../components/LevelUpModal';

export default function QuestionPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user, updateXP } = useUser();

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [levelUpData, setLevelUpData] = useState<any>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);

  useEffect(() => {
    loadQuestion();
  }, [topicId]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      // Generate adaptive question based on user progress
      const data = await questionAPI.generateAdaptiveQuestion(user!.id, topicId!);
      setQuestion(data);
    } catch (error) {
      console.error('Failed to load question:', error);
      // Redirect to dashboard if question generation fails
      alert('Failed to generate question. Please try again.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (answer: any) => {
    try {
      setSubmitting(true);

      // Prepare submission based on question type
      const submission: any = {
        question_id: question.id,
        user_id: user!.id,
      };

      if (question.question_type === 'mcq' || question.question_type === 'snippet') {
        submission.selected_option_id = answer;
      } else if (question.question_type === 'coding') {
        submission.code_solution = answer;
        submission.language = question.language;
      }

      // Submit for evaluation
      const result = await evaluationAPI.submitAnswer(submission);

      setEvaluation(result.evaluation);
      setShowResult(true);

      // Update XP in context
      updateXP(result.xp_earned);

      // Check for level up
      if (result.level_up) {
        setLevelUpData(result.level_up);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetHint = async () => {
    try {
      const hintData = await evaluationAPI.getHint(question.id, hintIndex);
      setCurrentHint(hintData.hint);
      setHintIndex(hintIndex + 1);
    } catch (error) {
      console.error('Failed to get hint:', error);
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setEvaluation(null);
    setHintIndex(0);
    setCurrentHint(null);
    loadQuestion();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading question...</div>
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

      <div className="max-w-4xl mx-auto px-8 py-10">
        {!showResult ? (
          <>
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm">
                  {question.difficulty}
                </span>
                <span className="text-slate-400 text-sm">
                  {question.question_type.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Question Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {question.question_type === 'mcq' && (
                <MCQQuestion
                  question={question.question_text}
                  options={question.options}
                  onSubmit={handleSubmitAnswer}
                  disabled={submitting}
                />
              )}

              {question.question_type === 'snippet' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-xl text-white font-semibold mb-4">
                      {question.question_text}
                    </h3>
                    <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      <code className="text-cyan-400">{question.code_snippet}</code>
                    </pre>
                  </div>
                  <MCQQuestion
                    question="What does this code output?"
                    options={question.options}
                    onSubmit={handleSubmitAnswer}
                    disabled={submitting}
                  />
                </div>
              )}

              {question.question_type === 'coding' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-xl text-white font-semibold mb-4">
                      {question.question_text}
                    </h3>
                  </div>
                  <CodeEditor
                    starterCode={question.starter_code}
                    language={question.language}
                    onSubmit={handleSubmitAnswer}
                    disabled={submitting}
                  />
                </div>
              )}
            </motion.div>

            {/* Hint Section */}
            <div className="mt-6">
              {currentHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <p className="text-yellow-200">{currentHint}</p>
                  </div>
                </motion.div>
              )}

              {hintIndex < question.hints?.length && !showResult && (
                <button
                  onClick={handleGetHint}
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Get a hint ({question.hints.length - hintIndex} remaining)
                </button>
              )}
            </div>
          </>
        ) : (
          /* Result Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Result Header */}
            <div
              className={`p-6 rounded-xl border-2 ${
                evaluation.is_correct
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-red-500/10 border-red-500'
              }`}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {evaluation.is_correct ? '✅ Correct!' : '❌ Incorrect'}
              </h2>
              <p className="text-slate-300">
                You earned {evaluation.xp_earned} XP
              </p>
            </div>

            {/* Feedback */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">Feedback:</h3>
              <p className="text-slate-300 mb-4">{evaluation.detailed_feedback}</p>

              {evaluation.correct_answer && (
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Correct Answer:</p>
                  <p className="text-cyan-400">{evaluation.correct_answer}</p>
                </div>
              )}
            </div>

            {/* Mistakes Analysis */}
            {evaluation.mistakes?.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">
                  Areas to Improve:
                </h3>
                <div className="space-y-3">
                  {evaluation.mistakes.map((mistake: any, index: number) => (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-orange-400 font-semibold mb-2">
                        {mistake.mistake_type}
                      </p>
                      <p className="text-slate-300 text-sm mb-2">
                        {mistake.description}
                      </p>
                      <p className="text-cyan-400 text-sm">{mistake.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNextQuestion}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Next Question
            </button>
          </motion.div>
        )}
      </div>

      {/* Level Up Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={!!levelUpData}
          onClose={() => setLevelUpData(null)}
          newLevel={levelUpData.new_level}
          rewards={levelUpData.rewards}
        />
      )}
    </div>
  );
}
