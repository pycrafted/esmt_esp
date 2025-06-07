import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { LinkBudgetService } from '@/services/linkBudget';
import { Vector3 } from 'three';

interface FresnelZoneProps {
  frequency: number;
  distance: number;
  color?: string;
  opacity?: number;
}

interface Point2D {
  x: number;
  y: number;
}

export const FresnelZone: React.FC<FresnelZoneProps> = ({
  frequency,
  distance,
  color = '#00ff00',
  opacity = 0.3
}) => {
  // Calcul des points de l'ellipsoïde de Fresnel
  const points = useMemo<Point2D[]>(() => 
    LinkBudgetService.calculateFresnelPoints(frequency, distance),
    [frequency, distance]
  );
  
  // Conversion des points 2D en points 3D
  const points3D = useMemo<Vector3[]>(() => 
    points.map((point: Point2D) => new Vector3(point.x, point.y, 0)),
    [points]
  );

  // Points pour la ligne de visée
  const lineOfSightPoints = useMemo<Vector3[]>(() => [
    new Vector3(0, 0, 0),
    new Vector3(distance, 0, 0)
  ], [distance]);

  return (
    <group>
      {/* Ellipsoïde de Fresnel supérieur */}
      <Line
        points={points3D}
        color={color}
        lineWidth={2}
        transparent
        opacity={opacity}
      />
      
      {/* Ligne de visée */}
      <Line
        points={lineOfSightPoints}
        color="#ffffff"
        lineWidth={1}
        dashed
      />

      {/* Points de mesure */}
      {points.map((point: Point2D, index: number) => (
        <mesh key={index} position={[point.x, point.y, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
};

export default FresnelZone; 