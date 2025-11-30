import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';

const AssetPlaceholder: React.FC<{ position: [number, number, number], color: string, name: string }> = ({ position, color, name }) => {
  return (
    <group position={position}>
      {/* Castle Base */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 2, 2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Castle Tower */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1.8, 1.5, 6]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Label */}
      <Html position={[0, 4, 0]} center>
        <div style={{ 
          background: 'rgba(0,0,0,0.5)', 
          color: 'white', 
          padding: '2px 8px', 
          borderRadius: '4px',
          fontSize: '0.8em',
          fontFamily: 'sans-serif',
          whiteSpace: 'nowrap'
        }}>
          {name}
        </div>
      </Html>
    </group>
  );
};

const Ground: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#4a4" />
    </mesh>
  );
};

export const Scene: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas camera={{ position: [0, 6, 14], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        
        <Ground />

        {/* Player 1 Castle (Blue) */}
        <AssetPlaceholder position={[-6, 0, 0]} color="#4488ff" name="Player 1 Castle" />

        {/* Player 2 Castle (Red) */}
        <AssetPlaceholder position={[6, 0, 0]} color="#ff4444" name="Player 2 Castle" />

        {/* Environment / Sky */}
        <Environment preset="park" background blur={0.5} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
};
