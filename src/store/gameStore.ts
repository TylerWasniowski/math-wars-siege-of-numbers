import { create } from 'zustand';
import { generateProblem, type MathProblem, type Difficulty } from '../engine/MathEngine';

export type GamePhase = 'SETUP' | 'INTERSTITIAL' | 'READY' | 'ACTIVE' | 'RESOLUTION' | 'GAME_OVER';

export interface Player {
  id: number;
  name: string;
  score: number;
  isCpu: boolean;
}

interface GameState {
  phase: GamePhase;
  players: Player[];
  currentTurnIndex: number;
  difficulty: Difficulty;
  
  // Turn Data
  currentProblem: MathProblem | null;
  nextRoundProblem: MathProblem | null;
  currentInput: string;
  timeRemaining: number; // in seconds
  feedback: string | null; // Message to display (e.g. "-50", "+200")
  
  // Actions
  initGame: (playerCount: number, difficulty: Difficulty) => void;
  setPhase: (phase: GamePhase) => void;
  startTurn: () => void;
  appendInput: (digit: string) => void;
  deleteInput: () => void;
  submitAnswer: () => void;
  nextTurn: () => void;
  updateTimer: (dt: number) => void;
}

const SCORE_CONFIG = {
  EASY: { base: 100, bonus: 50, penalty: 25 },
  MEDIUM: { base: 200, bonus: 100, penalty: 50 },
  HARD: { base: 400, bonus: 200, penalty: 100 },
};

const TURN_DURATION = 15;

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'SETUP',
  players: [],
  currentTurnIndex: 0,
  difficulty: 'EASY',
  currentProblem: null,
  nextRoundProblem: null,
  currentInput: '',
  timeRemaining: TURN_DURATION,
  feedback: null,

  initGame: (playerCount, difficulty) => {
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      score: 0,
      isCpu: false, // TODO: Add CPU logic later
    }));
    set({
      players,
      difficulty,
      currentTurnIndex: 0,
      phase: 'INTERSTITIAL',
      currentInput: '',
      timeRemaining: TURN_DURATION,
      currentProblem: null,
      nextRoundProblem: null,
      feedback: null,
    });
  },

  setPhase: (phase) => set({ phase }),

  startTurn: () => {
    const { difficulty, nextRoundProblem, currentTurnIndex } = get();
    
    let problem: MathProblem;

    if (currentTurnIndex === 0) {
      problem = generateProblem(difficulty);
      set({ nextRoundProblem: problem });
    } else {
      problem = nextRoundProblem || generateProblem(difficulty);
    }

    set({
      phase: 'ACTIVE',
      currentProblem: problem,
      currentInput: '',
      timeRemaining: TURN_DURATION,
      feedback: null,
    });
  },

  appendInput: (digit) => {
    const { currentInput, phase } = get();
    if (phase !== 'ACTIVE') return;
    if (currentInput.length >= 5) return; 
    set({ currentInput: currentInput + digit });
  },

  deleteInput: () => {
    const { currentInput, phase } = get();
    if (phase !== 'ACTIVE') return;
    set({ currentInput: currentInput.slice(0, -1) });
  },

  submitAnswer: () => {
    const { currentProblem, currentInput, timeRemaining, difficulty, players, currentTurnIndex } = get();
    if (!currentProblem) return;

    const inputVal = parseInt(currentInput, 10);
    // Prevent submitting empty input unless time is up
    if (isNaN(inputVal) && timeRemaining > 0) return;

    const isCorrect = inputVal === currentProblem.answer;
    const config = SCORE_CONFIG[difficulty];
    
    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentTurnIndex];

    // Case 1: Correct Answer
    if (isCorrect) {
      const timeBonus = config.bonus * (timeRemaining / TURN_DURATION);
      const scoreChange = Math.round(config.base + timeBonus);
      
      const newScore = currentPlayer.score + scoreChange;
      currentPlayer.score = Math.max(0, newScore); // Floor at 0

      set({
        players: updatedPlayers,
        phase: 'RESOLUTION',
        currentInput: '',
        feedback: null
      });
      return;
    }

    // Case 2: Timeout (Game Over for turn)
    if (timeRemaining <= 0) {
       const penalty = config.penalty;
       const newScore = currentPlayer.score - penalty;
       currentPlayer.score = Math.max(0, newScore);
       
       set({
         players: updatedPlayers,
         phase: 'RESOLUTION',
         currentInput: '',
         feedback: null
       });
       return;
    }

    // Case 3: Incorrect Answer (Penalty & Continue)
    const penalty = config.penalty;
    const newScore = currentPlayer.score - penalty;
    currentPlayer.score = Math.max(0, newScore);
    
    set({
      players: updatedPlayers,
      feedback: `-${penalty}`,
      currentInput: '' // Clear input to allow retry
    });

    // Clear feedback message after 1.5s
    setTimeout(() => {
      // Only clear if it hasn't changed or we haven't moved phase
      const { feedback, phase } = get();
      if (phase === 'ACTIVE' && feedback === `-${penalty}`) {
        set({ feedback: null });
      }
    }, 1000);
  },

  nextTurn: () => {
    const { players, currentTurnIndex } = get();
    const nextIndex = (currentTurnIndex + 1) % players.length;
    
    set({
      currentTurnIndex: nextIndex,
      phase: 'INTERSTITIAL',
      currentInput: '',
      timeRemaining: TURN_DURATION,
      feedback: null
    });
  },

  updateTimer: (dt) => {
    const { timeRemaining, phase } = get();
    if (phase !== 'ACTIVE') return;
    
    const newTime = Math.max(0, timeRemaining - dt);
    set({ timeRemaining: newTime });
    
    if (newTime <= 0) {
      get().submitAnswer(); 
    }
  },
}));
