/**
 * Multiple Choice Question Component
 * Displays MCQ with selectable options
 */
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Option {
  id: string;
  text: string;
  is_correct?: boolean;
}

interface MCQQuestionProps {
  question: string;
  options: Option[];
  onSubmit: (selectedId: string) => void;
  disabled?: boolean;
}

export default function MCQQuestion({
  question,
  options,
  onSubmit,
  disabled = false,
}: MCQQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl text-white font-semibold">{question}</h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => !disabled && setSelectedOption(option.id)}
            disabled={disabled}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === option.id
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-slate-700 bg-slate-800 hover:border-slate-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === option.id
                    ? 'border-cyan-500 bg-cyan-500'
                    : 'border-slate-600'
                }`}
              >
                {selectedOption === option.id && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <span className="text-slate-300">{option.text}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedOption || disabled}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Answer
      </button>
    </div>
  );
}
