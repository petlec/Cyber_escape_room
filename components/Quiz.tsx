import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { BrainCircuit } from 'lucide-react';

interface QuizProps {
  data: QuizQuestion;
  onSolve: () => void;
}

const Quiz: React.FC<QuizProps> = ({ data, onSolve }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    
    if (index === data.correctIndex) {
      setIsCorrect(true);
      setTimeout(onSolve, 2500);
    } else {
      setIsCorrect(false);
      // Allow retry after delay
      setTimeout(() => {
        setAnswered(false);
        setSelected(null);
      }, 2000);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-cyan-500/30 p-6 rounded-lg max-w-lg mx-auto shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <div className="bg-cyan-900/50 p-2 rounded-full">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white">{data.question}</h3>
      </div>

      <div className="space-y-3">
        {data.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={answered}
            className={`w-full p-4 text-left rounded-lg transition-all border ${
              answered && idx === selected
                ? isCorrect
                  ? 'bg-green-600 border-green-400 text-white'
                  : 'bg-red-600 border-red-400 text-white'
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-cyan-400 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {answered && idx === selected && (
                <span className="font-bold text-sm uppercase tracking-wider">
                  {isCorrect ? 'SPRÁVNĚ' : 'CHYBA'}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {answered && (
        <div className={`mt-6 p-4 rounded bg-slate-900/50 border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
          <p className="text-sm text-slate-300">
            {isCorrect ? data.feedback : "Přístup zamítnut. Nesprávná odpověď. Systém se resetuje..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
