/**
 * Level Up Celebration Modal
 * Shows when user levels up with animations
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  rewards: string[];
}

export default function LevelUpModal({
  isOpen,
  onClose,
  newLevel,
  rewards,
}: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500 rounded-2xl p-8 max-w-md w-full mx-4 pointer-events-auto relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Trophy Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white mb-2">
                  Level Up!
                </h2>
                <p className="text-cyan-400 text-xl font-semibold mb-6">
                  You've reached Level {newLevel}
                </p>

                {/* Rewards */}
                {rewards.length > 0 && (
                  <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                    <h3 className="text-white font-semibold mb-3">Rewards:</h3>
                    <div className="space-y-2">
                      {rewards.map((reward, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="text-slate-300"
                        >
                          {reward}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
