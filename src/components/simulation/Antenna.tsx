import React from 'react';
import { Cylinder, Text } from '@react-three/drei';

interface AntennaProps {
  position: [number, number, number];
  gain: number;
  type?: 'tx' | 'rx';
}

export const Antenna: React.FC<AntennaProps> = ({
  position,
  gain,
  type = 'tx'
}) => {
  return (
    <group position={position}>
      {/* Support de l'antenne */}
      <Cylinder
        args={[0.1, 0.1, 2, 8]}
        position={[0, 1, 0]}
      >
        <meshStandardMaterial color="#666666" />
      </Cylinder>

      {/* Antenne */}
      <Cylinder
        args={[0.05, 0.05, 1, 8]}
        position={[0, 2.5, 0]}
      >
        <meshStandardMaterial color="#444444" />
      </Cylinder>

      {/* Texte indiquant le gain */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`${gain} dBi`}
      </Text>

      {/* Indicateur TX/RX */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.2}
        color={type === 'tx' ? '#ff0000' : '#00ff00'}
        anchorX="center"
        anchorY="middle"
      >
        {type.toUpperCase()}
      </Text>
    </group>
  );
};

export default Antenna; 