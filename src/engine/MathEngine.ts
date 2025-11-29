export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface MathProblem {
  question: string;
  answer: number;
}

export const generateProblem = (difficulty: Difficulty): MathProblem => {
  let a = 0;
  let b = 0;

  // Basic implementation of difficulty constraints
  switch (difficulty) {
    case 'EASY':
      // Level 1: Recruit (Easy)
      // Ops: +, -
      // Terms: 2 numbers
      // Constraint: Result <= 100
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      return {
        question: `${a} + ${b}`,
        answer: a + b,
      };
    case 'MEDIUM':
      // Level 2: Knight (Medium)
      // Ops: +, -, *
      // Terms: 2-3 numbers
      // Constraint: Result <= 999
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * 9) + 1;
      return {
        question: `${a} * ${b}`,
        answer: a * b,
      };
    case 'HARD':
      // Level 3: Wizard (Hard)
      // Ops: +, -, *, /
      // Terms: 3 numbers
      // Constraint: Result >= 0
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * 5) + 1;
      const c = Math.floor(Math.random() * 10) + 1;
      return {
        question: `${a} * ${b} + ${c}`,
        answer: a * b + c,
      };
    default:
      // Fallback
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      return {
        question: `${a} + ${b}`,
        answer: a + b,
      };
  }
};
