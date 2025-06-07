import React from 'react';
import { Plane } from '@react-three/drei';

interface TerrainProps {
  size?: number;
  color?: string;
}

export const Terrain: React.FC<TerrainProps> = ({
  size = 100,
  color = '#4a7c59'
}) => {
  return (
    <Plane
      args={[size, size]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.2}
      />
    </Plane>
  );
};

export default Terrain; 