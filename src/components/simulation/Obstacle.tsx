import React from 'react';
import { Box } from '@react-three/drei';

interface ObstacleProps {
  position: [number, number, number];
  dimensions: [number, number, number];
  type: 'building' | 'mountain' | 'forest';
  isInFresnelZone?: boolean;
}

export const Obstacle: React.FC<ObstacleProps> = ({
  position,
  dimensions,
  type,
  isInFresnelZone = false
}) => {
  // Couleurs et matériaux selon le type d'obstacle
  const getMaterial = () => {
    switch (type) {
      case 'building':
        return {
          color: '#666666',
          metalness: 0.8,
          roughness: 0.2
        };
      case 'mountain':
        return {
          color: '#8B4513',
          metalness: 0.2,
          roughness: 0.8
        };
      case 'forest':
        return {
          color: '#228B22',
          metalness: 0.1,
          roughness: 0.9
        };
      default:
        return {
          color: '#666666',
          metalness: 0.5,
          roughness: 0.5
        };
    }
  };

  const material = getMaterial();

  return (
    <group position={position}>
      <Box args={dimensions}>
        <meshStandardMaterial
          {...material}
          transparent={isInFresnelZone}
          opacity={isInFresnelZone ? 0.7 : 1}
        />
      </Box>
      {isInFresnelZone && (
        <mesh position={[0, dimensions[1] / 2, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      )}
    </group>
  );
};

export default Obstacle; 