import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const HUD: React.FC = () => {
  const { 
    players, 
    currentTurnIndex, 
    currentProblem, 
    timeRemaining, 
    updateTimer, 
    phase,
    feedback,
    round
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
      zIndex: 20
    }}>
      {/* Top Health Bars & Round Info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        width: '100%',
        paddingTop: '10px'
      }}>
        {/* Player 1 Health (Blue) */}
        <div style={{ width: '40%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: '#59f', 
            fontWeight: 'bold',
            marginBottom: '5px',
            textShadow: '2px 2px 0 #000'
          }}>
            <span>{players[0]?.name}</span>
            <span>{players[0]?.health}/{players[0]?.maxHealth}</span>
          </div>
          <div style={{ 
            height: '25px', 
            background: '#333', 
            border: '3px solid #222',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(players[0]?.health / players[0]?.maxHealth) * 100}%`, 
              height: '100%', 
              background: 'linear-gradient(to bottom, #48d, #259)',
              transition: 'width 0.3s ease-out'
            }} />
          </div>
        </div>

        {/* Round Indicator */}
        <div style={{ 
          background: 'rgba(0,0,0,0.5)', 
          padding: '5px 15px', 
          borderRadius: '20px', 
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2em',
          marginTop: '-10px',
          border: '2px solid #555'
        }}>
          Round {round}
        </div>

        {/* Player 2 Health (Red) */}
        <div style={{ width: '40%' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: '#f55', 
            fontWeight: 'bold',
            marginBottom: '5px',
            textShadow: '2px 2px 0 #000'
          }}>
            <span>{players[1]?.health}/{players[1]?.maxHealth}</span>
            <span>{players[1]?.name}</span>
          </div>
          <div style={{ 
            height: '25px', 
            background: '#333', 
            border: '3px solid #222',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
             {/* Right align fill for P2 */}
            <div style={{ 
              width: `${(players[1]?.health / players[1]?.maxHealth) * 100}%`, 
              height: '100%', 
              background: 'linear-gradient(to bottom, #f55, #a22)',
              transition: 'width 0.3s ease-out',
              float: 'right'
            }} />
          </div>
        </div>
      </div>

      {/* Center Math Problem */}
      {phase === 'ACTIVE' && currentProblem && (
        <div style={{ 
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)', 
          padding: '20px 40px', 
          borderRadius: '15px',
          color: 'white',
          zIndex: 30,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          border: currentTurnIndex === 0 ? '2px solid #59f' : '2px solid #f55'
        }}>
          <h1 style={{ fontSize: '3.5em', margin: 0 }}>{currentProblem.question} = ?</h1>
        </div>
      )}

      {/* Feedback Message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.2 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: feedback.includes('KO') ? 'gold' : '#f44',
              fontSize: '4em',
              fontWeight: 'bold',
              textShadow: '0 2px 10px black',
              zIndex: 40
            }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fuse Timer Bar */}
      {phase === 'ACTIVE' && (
        <div style={{ 
          width: '100%', 
          height: '20px', 
          background: '#444', 
          borderRadius: '10px', 
          overflow: 'hidden', 
          marginTop: 'auto',
          marginBottom: '450px' 
        }}>
          <div style={{ 
            width: `${(timeRemaining / 30) * 100}%`, 
            height: '100%', 
            background: timeRemaining < 5 ? 'red' : timeRemaining < 10 ? 'yellow' : 'green',
            transition: 'width 0.1s linear'
          }} />
        </div>
      )}
    </div>
  );
};
