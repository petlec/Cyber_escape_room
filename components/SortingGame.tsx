import React, { useState } from 'react';
import { SortingItem } from '../types';
import { MousePointer2, MonitorUp, MonitorDown, CheckCircle, AlertCircle } from 'lucide-react';

interface SortingGameProps {
  items: SortingItem[];
  onSolve: () => void;
}

const SortingGame: React.FC<SortingGameProps> = ({ items, onSolve }) => {
  const [unsortedItems, setUnsortedItems] = useState<SortingItem[]>(items);
  const [inputBin, setInputBin] = useState<SortingItem[]>([]);
  const [outputBin, setOutputBin] = useState<SortingItem[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSort = (item: SortingItem, target: 'INPUT' | 'OUTPUT') => {
    setUnsortedItems(prev => prev.filter(i => i.id !== item.id));
    if (target === 'INPUT') {
      setInputBin(prev => [...prev, item]);
    } else {
      setOutputBin(prev => [...prev, item]);
    }
  };

  const handleRemove = (item: SortingItem, from: 'INPUT' | 'OUTPUT') => {
    if (isComplete) return; // Lock interaction when complete
    
    if (from === 'INPUT') {
      setInputBin(prev => prev.filter(i => i.id !== item.id));
    } else {
      setOutputBin(prev => prev.filter(i => i.id !== item.id));
    }
    setUnsortedItems(prev => [...prev, item]);
    setFeedback(null); // Clear feedback when modifying
  };

  const checkSolution = () => {
    const inputErrors = inputBin.some(i => i.category !== 'INPUT');
    const outputErrors = outputBin.some(i => i.category !== 'OUTPUT');
    
    if (unsortedItems.length > 0) {
      setFeedback("Nejdřív roztřiď všechny položky!");
      return;
    }

    if (!inputErrors && !outputErrors) {
      setIsComplete(true);
      setFeedback("Výborně! Vše je správně.");
      setTimeout(onSolve, 2000);
    } else {
      setFeedback("Něco je špatně. Zkus to znovu.");
    }
  };

  return (
    <div className="bg-slate-800/80 p-6 rounded-xl border border-blue-500/30 w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-blue-300 mb-2 flex items-center justify-center gap-2">
          <MousePointer2 className="w-5 h-5" />
          Třídička Hardware
        </h3>
        <p className="text-sm text-slate-300">Přesuň karty do správných kategorií. Kliknutím na kartu ji vrátíš zpět.</p>
      </div>

      {/* Bins Area */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Input Bin */}
        <div className={`border-2 border-dashed rounded-xl p-4 min-h-[200px] transition-colors ${isComplete ? 'border-green-500 bg-green-900/20' : 'border-indigo-400/50 bg-indigo-900/20'}`}>
          <div className="flex items-center justify-center gap-2 mb-4 text-indigo-300 font-bold uppercase tracking-wider">
            <MonitorDown className="w-6 h-6" /> Vstupní (Input)
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {inputBin.map(item => (
              <button 
                key={item.id} 
                onClick={() => handleRemove(item, 'INPUT')}
                disabled={isComplete}
                className={`bg-indigo-600 text-white px-3 py-1 rounded shadow text-sm transition-colors ${!isComplete && 'hover:bg-red-500 hover:text-white cursor-pointer'}`}
                title={!isComplete ? "Klikni pro vrácení" : ""}
              >
                {item.text}
              </button>
            ))}
          </div>
          {unsortedItems.length > 0 && (
             <div className="mt-8 text-center">
                <p className="text-xs text-indigo-400 mb-2">Klikni pro přidání sem:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {unsortedItems.map(item => (
                    <button
                      key={`btn-in-${item.id}`}
                      onClick={() => handleSort(item, 'INPUT')}
                      className="bg-slate-700 hover:bg-indigo-600 text-slate-200 px-2 py-1 rounded text-xs transition-colors border border-slate-600"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
             </div>
          )}
        </div>

        {/* Output Bin */}
        <div className={`border-2 border-dashed rounded-xl p-4 min-h-[200px] transition-colors ${isComplete ? 'border-green-500 bg-green-900/20' : 'border-pink-400/50 bg-pink-900/20'}`}>
          <div className="flex items-center justify-center gap-2 mb-4 text-pink-300 font-bold uppercase tracking-wider">
            <MonitorUp className="w-6 h-6" /> Výstupní (Output)
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {outputBin.map(item => (
              <button 
                key={item.id} 
                onClick={() => handleRemove(item, 'OUTPUT')}
                disabled={isComplete}
                className={`bg-pink-600 text-white px-3 py-1 rounded shadow text-sm transition-colors ${!isComplete && 'hover:bg-red-500 hover:text-white cursor-pointer'}`}
                title={!isComplete ? "Klikni pro vrácení" : ""}
              >
                {item.text}
              </button>
            ))}
          </div>
          {unsortedItems.length > 0 && (
             <div className="mt-8 text-center">
                <p className="text-xs text-pink-400 mb-2">Klikni pro přidání sem:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {unsortedItems.map(item => (
                    <button
                      key={`btn-out-${item.id}`}
                      onClick={() => handleSort(item, 'OUTPUT')}
                      className="bg-slate-700 hover:bg-pink-600 text-slate-200 px-2 py-1 rounded text-xs transition-colors border border-slate-600"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Control Area */}
      <div className="flex justify-center flex-col items-center">
        {feedback && (
          <div className={`mb-4 flex items-center gap-2 ${isComplete ? 'text-green-400' : 'text-orange-400'}`}>
            {isComplete ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {feedback}
          </div>
        )}
        
        {unsortedItems.length === 0 && !isComplete && (
          <button
            onClick={checkSolution}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded-full shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105"
          >
            Zkontrolovat řešení
          </button>
        )}
      </div>
      
       <div className="mt-4 text-xs text-slate-500 text-center font-mono">
        LearningApps.org Module Simulator v1.0
      </div>
    </div>
  );
};

export default SortingGame;