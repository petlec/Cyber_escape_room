import React, { useState } from 'react';
import { Lock, Unlock, Delete, Check } from 'lucide-react';
import { DigitalLockConfig } from '../types';

interface DigitalLockProps {
  config: DigitalLockConfig;
  onSolve: () => void;
}

const DigitalLock: React.FC<DigitalLockProps> = ({ config, onSolve }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePress = (char: string) => {
    setError(false);
    if (input.length < 8) {
      setInput(prev => prev + char);
    }
  };

  const handleClear = () => {
    setInput('');
    setError(false);
  };

  const handleSubmit = () => {
    if (input === config.code) {
      setSuccess(true);
      setTimeout(onSolve, 1500);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border-4 border-slate-600 shadow-2xl max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-mono text-cyan-400">DIGITÁLNÍ ZÁMEK</h3>
        {success ? <Unlock className="text-green-500 w-8 h-8" /> : <Lock className="text-red-500 w-8 h-8" />}
      </div>

      <div className={`bg-black font-mono text-3xl p-4 text-right rounded mb-4 h-16 flex items-center justify-end tracking-widest ${error ? 'text-red-500 border border-red-500' : success ? 'text-green-500 border border-green-500' : 'text-cyan-400 border border-slate-700'}`}>
        {error ? 'CHYBA' : success ? 'OTEVŘENO' : input || '_'}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handlePress(num.toString())}
            className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-bold py-3 rounded text-xl transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="bg-red-900/50 hover:bg-red-800 text-red-200 font-bold py-3 rounded flex items-center justify-center transition-colors"
        >
          <Delete className="w-6 h-6" />
        </button>
        <button
          onClick={() => handlePress('0')}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded text-xl transition-colors"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-900/50 hover:bg-green-800 text-green-200 font-bold py-3 rounded flex items-center justify-center transition-colors"
        >
          <Check className="w-6 h-6" />
        </button>
      </div>
      
      <div className="mt-4 text-xs text-slate-400 text-center font-mono">
        Zabezpečení: Flippity.net Protocol v2.0
      </div>
    </div>
  );
};

export default DigitalLock;
