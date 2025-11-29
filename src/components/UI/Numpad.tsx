import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const Numpad: React.FC = () => {
  const { appendInput, deleteInput, submitAnswer, currentInput } = useGameStore();

  const handleTap = (digit: number) => {
    appendInput(digit.toString());
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const buttonStyle = {
    padding: '20px', 
    fontSize: '1.5em', 
    border: 'none', 
    borderRadius: '5px',
    cursor: 'pointer',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '10px', 
      maxWidth: '350px', 
      margin: '0 auto',
      padding: '15px',
      background: 'rgba(30, 30, 30, 0.95)',
      borderRadius: '15px',
      boxShadow: '0 -5px 20px rgba(0,0,0,0.5)'
    }}>
      {/* Input Display Preview */}
      <div style={{ 
        gridColumn: '1 / -1', 
        background: '#000', 
        color: '#0f0', 
        fontFamily: 'monospace', 
        fontSize: '2.5em', 
        textAlign: 'right', 
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '5px',
        minHeight: '60px',
        overflow: 'hidden'
      }}>
        {currentInput || <span style={{color: '#333'}}>_</span>}
      </div>

      {/* 1-9 Keys */}
      {numbers.map((num) => (
        <button 
          key={num} 
          onClick={() => handleTap(num)}
          style={{ ...buttonStyle, background: '#555' }}
        >
          {num}
        </button>
      ))}

      {/* Bottom Row: DEL, 0, FIRE */}
      <button 
        onClick={deleteInput}
        style={{ ...buttonStyle, background: '#844' }}
      >
        DEL
      </button>

      <button 
        onClick={() => handleTap(0)}
        style={{ ...buttonStyle, background: '#555' }}
      >
        0
      </button>
      
      <button 
        onClick={submitAnswer}
        style={{ ...buttonStyle, background: '#484' }}
      >
        FIRE
      </button>
    </div>
  );
};
