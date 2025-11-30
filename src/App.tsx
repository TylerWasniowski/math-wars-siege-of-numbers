import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { Scene } from './components/Game/Scene';
import { HUD } from './components/UI/HUD';
import { Numpad } from './components/UI/Numpad';

function App() {
  const { phase, initGame, startTurn, players, currentTurnIndex, setPhase } = useGameStore();

  useEffect(() => {
    console.log('App.tsx: Mounted. Current phase:', phase);
  }, [phase]);

  // Keyboard listener for "Ready" and "Game Over"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (phase === 'INTERSTITIAL') {
          startTurn();
        } else if (phase === 'GAME_OVER') {
          setPhase('SETUP');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, startTurn, setPhase]);

  if (phase === 'SETUP') {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#111', 
        color: 'white' 
      }}>
        <h1>Math Wars: Siege of Numbers</h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button onClick={() => initGame(1, 'EASY')} style={{ padding: '15px' }}>1 Player (Easy)</button>
          <button onClick={() => initGame(2, 'EASY')} style={{ padding: '15px' }}>2 Players (Easy)</button>
          <button onClick={() => initGame(2, 'MEDIUM')} style={{ padding: '15px' }}>2 Players (Medium)</button>
          <button onClick={() => initGame(2, 'HARD')} style={{ padding: '15px' }}>2 Players (Hard)</button>
        </div>
      </div>
    );
  }

  const currentPlayer = players[currentTurnIndex];
  // Find winner: the one with health > 0
  const winner = players.find(p => p.health > 0);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#222' }}>
      <Scene />
      
      {/* HUD and Numpad are visible unless game over */}
      {phase !== 'GAME_OVER' && (
        <div style={{ 
          opacity: phase === 'INTERSTITIAL' ? 0.3 : 1, 
          pointerEvents: phase === 'INTERSTITIAL' ? 'none' : 'auto',
          transition: 'opacity 0.3s'
        }}>
          <HUD />
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            width: '100%', 
            zIndex: 10
          }}>
            <Numpad />
          </div>
        </div>
      )}

      {/* Pass to Player Overlay */}
      {phase === 'INTERSTITIAL' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.85)',
          padding: '40px',
          borderRadius: '15px',
          color: 'white',
          zIndex: 50,
          textAlign: 'center',
          minWidth: '300px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          border: '1px solid #444'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.5em', color: '#aaa' }}>Pass Device to</h2>
          <h1 style={{ fontSize: '3em', margin: '10px 0', color: 'gold' }}>{currentPlayer?.name}</h1>
          
          <button 
            onClick={startTurn}
            style={{ 
              padding: '15px 40px', 
              fontSize: '1.5em', 
              marginTop: '20px', 
              cursor: 'pointer',
              background: '#484',
              color: 'white',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            READY
          </button>
          <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#888' }}>
            Press Enter ↵
          </div>
        </div>
      )}

      {/* GAME OVER Overlay */}
      {phase === 'GAME_OVER' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.9)',
          padding: '50px',
          borderRadius: '20px',
          color: 'white',
          zIndex: 60,
          textAlign: 'center',
          minWidth: '400px',
          boxShadow: '0 15px 50px rgba(0,0,0,1)',
          border: '2px solid gold'
        }}>
          <h1 style={{ fontSize: '4em', margin: '0 0 20px 0', color: 'gold', textShadow: '0 0 20px orange' }}>
            VICTORY!
          </h1>
          <h2 style={{ fontSize: '2em', color: '#fff' }}>
            {winner ? `${winner.name} Wins!` : 'Draw!'}
          </h2>
          
          <button 
            onClick={() => setPhase('SETUP')}
            style={{ 
              padding: '15px 40px', 
              fontSize: '1.5em', 
              marginTop: '30px', 
              cursor: 'pointer',
              background: '#333',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px'
            }}
          >
            MAIN MENU
          </button>
          <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#888' }}>
            Press Enter ↵
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
