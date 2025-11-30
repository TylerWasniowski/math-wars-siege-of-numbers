import { create } from 'zustand';
import { generateProblem, type MathProblem, type Difficulty } from '../engine/MathEngine';

export type GamePhase = 'SETUP' | 'INTERSTITIAL' | 'READY' | 'ACTIVE' | 'RESOLUTION' | 'GAME_OVER';

export interface Player {
  id: number;
  name: string;
  health: number;
  maxHealth: number;
  isCpu: boolean;
}

interface GameState {
  phase: GamePhase;
  players: Player[];
  currentTurnIndex: number;
  difficulty: Difficulty;
  round: number;
  
  // Turn Data
  currentProblem: MathProblem | null;
  nextRoundProblem: MathProblem | null;
  currentInput: string;
  timeRemaining: number; // in seconds
  feedback: string | null; 
  
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

const DAMAGE_CONFIG = {
  EASY: { base: 100, bonus: 50, penalty: 50 },
  MEDIUM: { base: 150, bonus: 100, penalty: 100 },
  HARD: { base: 200, bonus: 200, penalty: 150 },
};

const MAX_HEALTH = 1000;
const TURN_DURATION = 30;

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'SETUP',
  players: [],
  currentTurnIndex: 0,
  difficulty: 'EASY',
  round: 1,
  currentProblem: null,
  nextRoundProblem: null,
  currentInput: '',
  timeRemaining: TURN_DURATION,
  feedback: null,

  initGame: (playerCount, difficulty) => {
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      health: MAX_HEALTH,
      maxHealth: MAX_HEALTH,
      isCpu: false, 
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
      round: 1
    });
  },

  setPhase: (phase) => set({ phase }),

  startTurn: () => {
    const { difficulty, nextRoundProblem, currentTurnIndex, players } = get();
    
    // Check for Game Over logic (if any player is dead)
    if (players.some(p => p.health <= 0)) {
      set({ phase: 'GAME_OVER' });
      return;
    }

    let problem: MathProblem;

    if (currentTurnIndex === 0) {
      // New Round starting (since P1 is going)
      // Actually, "Round" usually increments when everyone has gone once.
      // But for fairness logic, we generate new problem for P1.
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
    const { currentProblem, currentInput, timeRemaining, difficulty, players, currentTurnIndex, round } = get();
    if (!currentProblem) return;

    const inputVal = parseInt(currentInput, 10);
    if (isNaN(inputVal) && timeRemaining > 0) return;

    const isCorrect = inputVal === currentProblem.answer;
    const config = DAMAGE_CONFIG[difficulty];
    
    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[currentTurnIndex];
    const opponentIndex = (currentTurnIndex + 1) % players.length; // Simple 2-player logic
    const opponent = updatedPlayers[opponentIndex];

    if (isCorrect) {
      // Deal Damage to Opponent
      const timeBonus = config.bonus * (timeRemaining / TURN_DURATION);
      const damage = Math.round(config.base + timeBonus);
      
      opponent.health = Math.max(0, opponent.health - damage);

      // Check Win Condition immediately
      if (opponent.health <= 0) {
         set({
             players: updatedPlayers,
             phase: 'GAME_OVER',
             feedback: `KO!`,
             currentInput: ''
         });
         return;
      }

      // Determine next turn logic
      const nextIndex = (currentTurnIndex + 1) % players.length;
      let nextRound = round;
      if (nextIndex === 0) {
        nextRound += 1;
      }

      set({
        players: updatedPlayers,
        currentTurnIndex: nextIndex,
        phase: 'INTERSTITIAL',
        currentInput: '',
        feedback: null,
        round: nextRound
      });
      return;
    }

    // Timeout or Penalty Logic
    // Self-Damage
    const penalty = config.penalty;
    currentPlayer.health = Math.max(0, currentPlayer.health - penalty);

    if (currentPlayer.health <= 0) {
         set({
             players: updatedPlayers,
             phase: 'GAME_OVER',
             feedback: `KO!`,
             currentInput: ''
         });
         return;
    }

    if (timeRemaining <= 0) {
       // Timeout forces next turn
       const nextIndex = (currentTurnIndex + 1) % players.length;
       let nextRound = round;
       if (nextIndex === 0) {
         nextRound += 1;
       }

       set({
         players: updatedPlayers,
         currentTurnIndex: nextIndex,
         phase: 'INTERSTITIAL',
         currentInput: '',
         feedback: null,
         round: nextRound
       });
       return;
    }

    // Wrong Answer but time remains -> Feedback loop
    set({
      players: updatedPlayers,
      feedback: `-${penalty} HP`,
      currentInput: '' 
    });

    setTimeout(() => {
      const { feedback, phase } = get();
      if (phase === 'ACTIVE' && feedback === `-${penalty} HP`) {
        set({ feedback: null });
      }
    }, 1000);
  },

  nextTurn: () => {
    // Deprecated manual next turn
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
