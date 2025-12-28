import React, { useState, useEffect, useCallback } from 'react';
import { ROOMS, GAME_TITLE } from './constants';
import { GameState, RoomType, SortingItem, QuizQuestion, DigitalLockConfig } from './types';
import { generateRoomImage, generateHint } from './services/geminiService';
import SortingGame from './components/SortingGame';
import DigitalLock from './components/DigitalLock';
import Quiz from './components/Quiz';
import { Terminal, Cpu, Loader2, Lightbulb, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRoomId: 0,
    unlockedRooms: [0],
    generatedImages: {},
    isLoadingImage: false,
    gameStarted: false,
    gameFinished: false,
  });
  
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const currentRoom = ROOMS[gameState.currentRoomId];

  // Load image for the current room
  const loadRoomImage = useCallback(async (roomId: number) => {
    // If already generated, don't regenerate
    if (gameState.generatedImages[roomId]) return;

    setGameState(prev => ({ ...prev, isLoadingImage: true }));
    const prompt = ROOMS[roomId].imagePrompt;
    
    // Check if API KEY is set
    if (!process.env.API_KEY) {
        console.warn("No API Key found");
    }

    const imageUrl = await generateRoomImage(prompt);
    
    setGameState(prev => ({
      ...prev,
      isLoadingImage: false,
      generatedImages: {
        ...prev.generatedImages,
        [roomId]: imageUrl || 'https://picsum.photos/1200/600?grayscale&blur=2' // Fallback
      }
    }));
  }, [gameState.generatedImages]);

  // Initial game start
  useEffect(() => {
    if (gameState.gameStarted) {
      loadRoomImage(gameState.currentRoomId);
    }
  }, [gameState.gameStarted, gameState.currentRoomId, loadRoomImage]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  };

  const resetGame = () => {
    setGameState({
      currentRoomId: 0,
      unlockedRooms: [0],
      generatedImages: {},
      isLoadingImage: false,
      gameStarted: false,
      gameFinished: false,
    });
    setHint(null);
    setIsLoadingHint(false);
  };

  const handleRoomComplete = () => {
    const nextRoomId = gameState.currentRoomId + 1;
    
    if (nextRoomId >= ROOMS.length) {
      setGameState(prev => ({ ...prev, gameFinished: true }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentRoomId: nextRoomId,
        unlockedRooms: [...prev.unlockedRooms, nextRoomId],
      }));
      setHint(null); // Clear hint for new room
    }
  };

  const requestHint = async () => {
    if (isLoadingHint) return;
    setIsLoadingHint(true);
    const text = await generateHint(currentRoom.description + " Úkol: " + JSON.stringify(currentRoom.puzzleData));
    setHint(text);
    setIsLoadingHint(false);
  };

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>
        
        <div className="z-10 text-center max-w-2xl">
          <div className="mb-6 flex justify-center">
             <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/50 animate-pulse">
                <Terminal className="w-16 h-16 text-cyan-400" />
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-mono tracking-tighter">
            {GAME_TITLE}
          </h1>
          <p className="text-xl text-slate-400 mb-8 font-light border-l-4 border-cyan-500 pl-4 text-left bg-slate-900/50 p-4 rounded-r">
            Poplach v sektoru ZŠ! Školní mainframe byl napaden. <br/>
            Vyžaduje se okamžitý zásah operátora. <br/>
            Jsi připraven vstoupit do systému?
          </p>
          
          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={startGame}
              className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded shadow-[0_0_20px_rgba(8,145,178,0.5)] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span>SPUSTIT DIAGNOSTIKU (START HRY)</span>
            </button>
            <span className="text-xs text-slate-600 font-mono">
              Powered by Google Gemini GenAI
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gameFinished) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#22c55e_0%,transparent_70%)]"></div>
        </div>
        
        <div className="z-10 animate-[scale-in_0.5s_ease-out]">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-6 rounded-full border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
              <CheckCircle2 className="w-20 h-20 text-green-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-green-400 mb-2 font-mono uppercase tracking-widest">
            MISE SPLNĚNA
          </h1>
          <p className="text-xl text-slate-300 mb-6 max-w-lg mx-auto">
            Všechny kritické chyby byly opraveny a školní systém je opět v bezpečí. Dobrá práce, operátore!
          </p>

          <div className="mb-8 p-6 bg-slate-900/80 border-2 border-cyan-500/50 rounded-xl max-w-md mx-auto shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400 font-mono text-sm uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> ZÍSKANÉ TAJNÉ HESLO <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-3xl md:text-4xl font-mono font-bold text-white select-all cursor-copy hover:text-cyan-300 transition-colors">
              9erAmE./a*3Q
            </div>
            <p className="mt-2 text-xs text-slate-500 font-mono italic">Tento kód použij pro nahlášení úspěšného zásahu.</p>
          </div>
          
          <button 
            onClick={resetGame}
            className="group relative px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 rounded transition-all font-mono flex items-center gap-2 mx-auto shadow-[0_0_15px_rgba(30,41,59,0.5)]"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> 
            NOVÁ SIMULACE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
           <Terminal className="w-5 h-5 text-cyan-400" />
           <span className="font-mono font-bold text-cyan-100 hidden sm:inline">{GAME_TITLE}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-xs font-mono text-slate-500">
             SEKTOR: {gameState.currentRoomId + 1}/{ROOMS.length}
           </div>
           <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-cyan-500 transition-all duration-500" 
               style={{ width: `${((gameState.currentRoomId + 1) / ROOMS.length) * 100}%` }}
             ></div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 flex flex-col gap-6">
        
        {/* Visual Layer - Generated by AI */}
        <div className="relative w-full aspect-video md:aspect-[21/9] bg-black rounded-lg overflow-hidden border border-slate-700 shadow-2xl group">
          {gameState.isLoadingImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-cyan-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-mono text-sm animate-pulse uppercase tracking-wider">Navazuji vizuální spojení...</p>
            </div>
          ) : (
            <>
               <img 
                src={gameState.generatedImages[gameState.currentRoomId]} 
                alt="Room visualization" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </>
          )}
          
          <div className="absolute bottom-0 left-0 p-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md font-mono">{currentRoom.title}</h2>
            <p className="text-slate-200 bg-slate-900/80 p-3 rounded backdrop-blur-sm border-l-4 border-cyan-500 text-lg shadow-lg">
              {currentRoom.description}
            </p>
          </div>
        </div>

        {/* Action Layer */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Interaction Zone (2/3 width) */}
          <div className="md:col-span-2 space-y-4">
             {/* Puzzle Component Switcher */}
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 min-h-[300px] flex items-center justify-center">
                {currentRoom.type === RoomType.PUZZLE_QUIZ && (
                  <Quiz data={currentRoom.puzzleData as QuizQuestion} onSolve={handleRoomComplete} />
                )}
                {currentRoom.type === RoomType.PUZZLE_SORT && (
                  <SortingGame items={currentRoom.puzzleData as SortingItem[]} onSolve={handleRoomComplete} />
                )}
                {currentRoom.type === RoomType.PUZZLE_LOCK && (
                  <DigitalLock config={currentRoom.puzzleData as DigitalLockConfig} onSolve={handleRoomComplete} />
                )}
             </div>
          </div>

          {/* AI Assist Zone (1/3 width) */}
          <div className="md:col-span-1">
             <div className="bg-slate-800 rounded-xl p-4 border border-indigo-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-indigo-300">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="font-bold">AI Průvodce</h3>
                </div>
                
                <div className="flex-1 bg-slate-900/50 rounded p-4 mb-4 text-sm text-slate-300 overflow-y-auto font-mono">
                  {isLoadingHint ? (
                     <div className="flex items-center gap-2">
                       <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                       <span className="animate-pulse">Analyzuji data...</span>
                     </div>
                  ) : hint ? (
                    <p className="typing-effect text-indigo-200">{hint}</p>
                  ) : (
                    <p className="text-slate-500 italic">Potřebuješ poradit? Klikni na tlačítko níže a AI ti poskytne nápovědu.</p>
                  )}
                </div>

                <button 
                  onClick={requestHint}
                  disabled={isLoadingHint}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 px-4 rounded transition-all font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 active:translate-y-0.5"
                >
                  {isLoadingHint ? <Loader2 className="animate-spin w-4 h-4"/> : "Žádost o nápovědu"}
                </button>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;