export enum RoomType {
  INTRO = 'INTRO',
  PUZZLE_QUIZ = 'PUZZLE_QUIZ',
  PUZZLE_LOCK = 'PUZZLE_LOCK',
  PUZZLE_SORT = 'PUZZLE_SORT',
  OUTRO = 'OUTRO'
}

export interface Room {
  id: number;
  title: string;
  description: string;
  imagePrompt: string; // Prompt for AI generation
  type: RoomType;
  clue?: string;
  puzzleData?: any; // Flexible data for different puzzle types
}

export interface GameState {
  currentRoomId: number;
  unlockedRooms: number[];
  generatedImages: Record<number, string>; // Cache generated images
  isLoadingImage: boolean;
  gameStarted: boolean;
  gameFinished: boolean;
}

// Data specific for the Sorting Puzzle (LearningApps mimic)
export interface SortingItem {
  id: string;
  text: string;
  category: 'INPUT' | 'OUTPUT';
}

// Data specific for Quiz
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface DigitalLockConfig {
  code: string;
  hint: string;
}
