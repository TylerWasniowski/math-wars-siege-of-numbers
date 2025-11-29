import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const HUD: React.FC = () => {
  const { 
    players, 
    currentTurnIndex, 
    currentProblem, 
    timeRemaining, 
    updateTimer, 
    phase 
  } = useGameStore();

  useEffect(() => {
    let interval: any;
    if (phase === 'ACTIVE') {
      interval = setInterval(() => {
        updateTimer(0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [phase, updateTimer]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      pointerEvents: 'none', 
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh',
      zIndex: 20 // Increased z-index to sit above Numpad
    }}>
      {/* Top Scoreboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {players.map((p, i) => (
          <div key={p.id} style={{ 
            background: i === currentTurnIndex ? '#448' : '#222', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            border: i === currentTurnIndex ? '2px solid gold' : 'none'
          }}>
            <h3>{p.name}</h3>
            <h1>{p.score}</h1>
          </div>
        ))}
      </div>

      {/* Center Math Problem */}
      {phase === 'ACTIVE' && currentProblem && (
        <div style={{ 
          position: 'absolute',
          top: '20%', // Moved up significantly
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)', 
          padding: '20px 40px', 
          borderRadius: '15px',
          color: 'white',
          zIndex: 30,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          <h1 style={{ fontSize: '3.5em', margin: 0 }}>{currentProblem.question} = ?</h1>
        </div>
      )}

      {/* Fuse Timer Bar */}
      {phase === 'ACTIVE' && (
        <div style={{ 
          width: '100%', 
          height: '20px', 
          background: '#444', 
          borderRadius: '10px', 
          overflow: 'hidden', 
          marginTop: 'auto',
          marginBottom: '450px' // Keep clearance for Numpad
        }}>
          <div style={{ 
            width: `${(timeRemaining / 15) * 100}%`, 
            height: '100%', 
            background: timeRemaining < 5 ? 'red' : timeRemaining < 10 ? 'yellow' : 'green',
            transition: 'width 0.1s linear'
          }} />
        </div>
      )}
    </div>
  );
};
