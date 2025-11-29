import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export const Scene: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <gridHelper args={[20, 20]} />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

