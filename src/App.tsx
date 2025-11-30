import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { Scene } from './components/Game/Scene';
import { HUD } from './components/UI/HUD';
import { Numpad } from './components/UI/Numpad';
import { Interstitial } from './components/UI/Interstitial';

function App() {
  const { phase, initGame, nextTurn } = useGameStore();

  useEffect(() => {
    console.log('App.tsx: Mounted. Current phase:', phase);
  }, [phase]);

  // Keyboard listener for Next Round
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'RESOLUTION' && e.key === 'Enter') {
        nextTurn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, nextTurn]);

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

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#222' }}>
      <Scene />
      
      {(phase === 'ACTIVE' || phase === 'RESOLUTION') && (
        <>
          <HUD />
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            width: '100%', 
            zIndex: 10, 
            pointerEvents: phase === 'RESOLUTION' ? 'none' : 'auto',
            opacity: phase === 'RESOLUTION' ? 0.5 : 1
          }}>
            <Numpad />
          </div>
          
          {phase === 'RESOLUTION' && (
             <div style={{
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               background: 'rgba(0,0,0,0.8)',
               padding: '30px',
               borderRadius: '15px',
               color: 'white',
               zIndex: 30,
               textAlign: 'center'
             }}>
               <h2>Round Complete!</h2>
               <button 
                 onClick={nextTurn}
                 style={{ padding: '10px 20px', fontSize: '1.2em', marginTop: '10px', cursor: 'pointer' }}
               >
                 Next Round
               </button>
               <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#aaa' }}>
                 Press Enter ↵
               </div>
             </div>
          )}
        </>
      )}

      {phase === 'INTERSTITIAL' && <Interstitial />}
    </div>
  );
}

export default App;
