/**
 * Code Editor Component using Monaco Editor
 * For coding challenge questions
 */
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface CodeEditorProps {
  starterCode: string;
  language: string;
  onSubmit: (code: string) => void;
  disabled?: boolean;
}

export default function CodeEditor({
  starterCode,
  language,
  onSubmit,
  disabled = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <div className="space-y-4">
      {/* Editor */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <Play className="w-5 h-5" />
        Run & Submit
      </motion.button>
    </div>
  );
}
