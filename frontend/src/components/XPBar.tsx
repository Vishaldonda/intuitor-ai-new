/**
 * XP Progress Bar Component
 * Shows user's XP progress towards next level with animations
 */
import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP: number;
  level: number;
}

export default function XPBar({ currentXP, level }: XPBarProps) {
  // Calculate XP required for next level (exponential curve)
  const xpForNextLevel = (level + 1) ** 2 * 100;
  const xpProgress = (currentXP / xpForNextLevel) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-semibold">Level {level}</span>
        <span className="text-cyan-400 text-sm">
          {currentXP} / {xpForNextLevel} XP
        </span>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
