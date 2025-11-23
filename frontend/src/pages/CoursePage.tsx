/**
 * Course Page - Shows topics within a course
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { courseAPI } from '../services/api';
import { useUser } from '../context/UserContext';

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [course, setCourse] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const data = await courseAPI.getCourse(courseId!);
      setCourse(data.course);
      setTopics(data.topics);
    } catch (error) {
      console.error('Failed to load course:', error);
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
        {/* Course Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">{course.name}</h1>
          <p className="text-slate-300 text-lg mb-6">{course.description}</p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-400">Topics:</span>
              <span className="text-white ml-2">{course.total_topics}</span>
            </div>
            <div>
              <span className="text-slate-400">Estimated Time:</span>
              <span className="text-white ml-2">{course.estimated_hours}h</span>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Topics</h2>
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/question/${topic.id}`)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{topic.description}</p>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                        {topic.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                        ~{topic.estimated_minutes} min
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  {/* TODO: Show completion status */}
                  <CheckCircle className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
