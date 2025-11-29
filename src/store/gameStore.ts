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
  nextRoundProblem: MathProblem | null; // Store the problem for the next player
  currentInput: string;
  timeRemaining: number; // in seconds
  
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
      nextRoundProblem: null, // Reset on new game
    });
  },

  setPhase: (phase) => set({ phase }),

  startTurn: () => {
    const { difficulty, nextRoundProblem, currentTurnIndex } = get();
    
    // Logic:
    // If it's the first player (index 0), generate a NEW problem.
    // If it's subsequent players, use the SAME problem (stored in nextRoundProblem).
    // Wait, "For each round" means Player 1 gets X, Player 2 gets X. Next round, Player 1 gets Y, Player 2 gets Y.
    
    let problem: MathProblem;

    if (currentTurnIndex === 0) {
      // Start of a new round -> Generate new problem
      problem = generateProblem(difficulty);
      // Store it for subsequent players in this round
      set({ nextRoundProblem: problem });
    } else {
      // Subsequent players use the stored problem
      // Fallback to generate if null (shouldn't happen if logic is correct)
      problem = nextRoundProblem || generateProblem(difficulty);
    }

    set({
      phase: 'ACTIVE',
      currentProblem: problem,
      currentInput: '',
      timeRemaining: TURN_DURATION,
    });
  },

  appendInput: (digit) => {
    const { currentInput, phase } = get();
    if (phase !== 'ACTIVE') return;
    if (currentInput.length >= 5) return; // Cap length
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
    const isCorrect = inputVal === currentProblem.answer;
    const config = SCORE_CONFIG[difficulty];
    
    let scoreChange = 0;
    
    if (isCorrect) {
      const timeBonus = config.bonus * (timeRemaining / TURN_DURATION);
      scoreChange = Math.round(config.base + timeBonus);
    } else {
      scoreChange = -config.penalty;
    }

    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentTurnIndex];
    
    // Apply score change, respecting floor of 0
    const newScore = currentPlayer.score + scoreChange;
    currentPlayer.score = Math.max(0, newScore);

    set({
      players: updatedPlayers,
      phase: 'RESOLUTION',
    });
  },

  nextTurn: () => {
    const { players, currentTurnIndex } = get();
    const nextIndex = (currentTurnIndex + 1) % players.length;
    
    // Check for Game Over condition (if we had rounds)
    // For now, just loop
    set({
      currentTurnIndex: nextIndex,
      phase: 'INTERSTITIAL',
      currentInput: '',
      timeRemaining: TURN_DURATION,
    });
  },

  updateTimer: (dt) => {
    const { timeRemaining, phase } = get();
    if (phase !== 'ACTIVE') return;
    
    const newTime = Math.max(0, timeRemaining - dt);
    set({ timeRemaining: newTime });
    
    if (newTime <= 0) {
      get().submitAnswer(); // Timeout acts as submit
    }
  },
}));
