import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const Interstitial: React.FC = () => {
  const { players, currentTurnIndex, startTurn } = useGameStore();
  const currentPlayer = players[currentTurnIndex];

  // Enable Enter key to start turn
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        startTurn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startTurn]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#222',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      zIndex: 20
    }}>
      <h1>Pass Device to</h1>
      <h2 style={{ fontSize: '3em', color: 'gold' }}>{currentPlayer?.name}</h2>
      
      <button 
        onClick={startTurn}
        style={{
          marginTop: '50px',
          padding: '20px 40px',
          fontSize: '2em',
          background: '#484',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        READY
      </button>
      <div style={{ marginTop: '15px', color: '#888' }}>
        Press Enter ↵
      </div>
    </div>
  );
};
