/**
 * Progress context for tracking learning progress.
 * Manages topic progress, stats, and learning analytics.
 */
import { createContext, useContext, useState, ReactNode } from 'react';
import { progressAPI } from '../services/api';

interface TopicProgress {
  topic_id: string;
  current_difficulty: string;
  questions_attempted: number;
  questions_correct: number;
  accuracy: number;
  total_xp_earned: number;
  mastery_level: number;
}

interface ProgressContextType {
  topicProgress: Record<string, TopicProgress>;
  loadTopicProgress: (userId: string, topicId: string) => Promise<void>;
  updateProgress: (topicId: string, progress: TopicProgress) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>({});

  const loadTopicProgress = async (userId: string, topicId: string) => {
    try {
      const data = await progressAPI.getTopicProgress(userId, topicId);
      if (data.progress) {
        setTopicProgress((prev) => ({
          ...prev,
          [topicId]: data.progress,
        }));
      }
    } catch (error) {
      console.error('Failed to load topic progress:', error);
    }
  };

  const updateProgress = (topicId: string, progress: TopicProgress) => {
    setTopicProgress((prev) => ({
      ...prev,
      [topicId]: progress,
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        topicProgress,
        loadTopicProgress,
        updateProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
