import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useSimulationStore } from '@/stores/simulationStore';
import { LinkBudgetService } from '@/services/linkBudget';
import { DiffractionService } from '@/services/diffraction';
import Terrain from './Terrain';
import Antenna from './Antenna';
import FresnelZone from './FresnelZone';
import Obstacle from './Obstacle';
import SimulationControls from './SimulationControls';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface ObstacleData {
  id: string;
  position: [number, number, number];
  dimensions: [number, number, number];
  type: 'building' | 'mountain' | 'forest';
  isInFresnelZone?: boolean;
}

interface LinkBudgetResult {
  freeSpaceLoss: number;
  totalLoss: number;
  totalGain: number;
  receivedPower: number;
  systemMargin: number;
  availability: number;
}

interface DiffractionLosses {
  total: number;
  obstacles: Array<{ loss: number }>;
}

interface SimulationFormValues {
  area: string;
  users: string;
  userRate: string;
}

const initialValues: SimulationFormValues = {
  area: '',
  users: '',
  userRate: '',
};

const pedagogicHelp = {
  area: {
    short: "Zone à couvrir (en km²).",
    example: "Ex : 10 km² (petite ville), 50 km² (zone rurale)",
    why: "Permet de calculer la couverture nécessaire et le nombre de sites."
  },
  users: {
    short: "Nombre d'utilisateurs à desservir.",
    example: "Ex : 2000 (petite zone), 10000 (grande ville)",
    why: "Permet de dimensionner la capacité du réseau."
  },
  userRate: {
    short: "Débit voix par utilisateur (en kbps).",
    example: "Ex : 12.2 kbps (standard)",
    why: "Le débit par utilisateur impacte la bande passante nécessaire."
  }
};

const exampleValues: SimulationFormValues = {
  area: '10',
  users: '2000',
  userRate: '12.2',
};

const scenarioPresets: { [key: string]: { values: SimulationFormValues; msg: string } } = {
  urbain: {
    values: { area: '10', users: '2000', userRate: '12.2' },
    msg: "Scénario urbain : zone de 10 km², 2000 utilisateurs, débit standard."
  },
  rural: {
    values: { area: '50', users: '500', userRate: '8' },
    msg: "Scénario rural : grande zone (50 km²), peu d'utilisateurs, débit réduit."
  },
  campus: {
    values: { area: '2', users: '1000', userRate: '16' },
    msg: "Scénario campus : petite zone dense avec besoins élevés."
  }
};

// Liste de termes pour le glossaire
const termesSimulation = [
  { id: 'area', terme: 'Zone à couvrir', definition: "Surface géographique où le service doit être disponible.", unite: 'km²', exemple: 'Une ville de taille moyenne fait environ 50 km².' },
  { id: 'users', terme: 'Utilisateurs', definition: "Nombre total d'utilisateurs à desservir dans la zone.", exemple: '2000 utilisateurs dans une petite ville.' },
  { id: 'userRate', terme: 'Débit par utilisateur', definition: "Bande passante allouée à chaque utilisateur.", unite: 'kbps', exemple: '12.2 kbps pour la voix standard.' },
];

const SimulationView: React.FC = () => {
  const { antennas, frequency } = useSimulationStore();
  const [linkBudget, setLinkBudget] = useState<LinkBudgetResult | null>(null);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [diffractionLosses, setDiffractionLosses] = useState<DiffractionLosses>({ total: 0, obstacles: [] });

  // Calcul de la distance entre les antennes
  const distance = useMemo(() => {
    if (antennas.length !== 2) return 0;
    const [ant1, ant2] = antennas;
    return Math.sqrt(
      Math.pow(ant2.position[0] - ant1.position[0], 2) +
      Math.pow(ant2.position[2] - ant1.position[2], 2)
    );
  }, [antennas]);

  // Calcul du bilan de liaison et des pertes par diffraction
  useEffect(() => {
    if (antennas.length === 2 && distance > 0) {
      const [ant1, ant2] = antennas;

      // Calcul du bilan de liaison
      const budget = LinkBudgetService.calculateLinkBudget({
        frequency,
        distance,
        txPower: 20, // dBm
        txGain: ant1.gain,
        rxGain: ant2.gain,
        txHeight: ant1.position[1],
        rxHeight: ant2.position[1],
        climate: 'temperate',
        reliability: 99.9
      });

      // Calcul des pertes par diffraction
      const diffractionParams = {
        frequency,
        distance,
        txPosition: ant1.position,
        rxPosition: ant2.position,
        obstacles: obstacles.map(obs => ({
          position: obs.position,
          height: obs.dimensions[1],
          width: obs.dimensions[0]
        }))
      };

      const { totalLoss, obstacleLosses } = DiffractionService.calculateTotalDiffractionLoss(diffractionParams);

      // Mise à jour des états
      setLinkBudget(budget);
      setDiffractionLosses({ total: totalLoss, obstacles: obstacleLosses });

      // Mise à jour des obstacles dans la zone de Fresnel
      setObstacles(prev => prev.map(obs => ({
        ...obs,
        isInFresnelZone: DiffractionService.isInFirstFresnelZone(
          {
            position: obs.position,
            height: obs.dimensions[1],
            width: obs.dimensions[0]
          },
          diffractionParams
        )
      })));
    }
  }, [antennas, frequency, obstacles, distance]);

  return (
    <div className="flex h-full">
      {/* Panneau de contrôle */}
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <SimulationControls />
        
        {linkBudget && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Bilan de Liaison</h3>
            <div className="space-y-2">
              <p>Perte en espace libre: {linkBudget.freeSpaceLoss.toFixed(2)} dB</p>
              <p>Perte totale: {linkBudget.totalLoss.toFixed(2)} dB</p>
              <p>Gain total: {linkBudget.totalGain.toFixed(2)} dB</p>
              <p>Puissance reçue: {linkBudget.receivedPower.toFixed(2)} dBm</p>
              <p>Marge système: {linkBudget.systemMargin.toFixed(2)} dB</p>
              <p>Disponibilité: {linkBudget.availability.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {diffractionLosses.total > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pertes par Diffraction</h3>
            <p>Perte totale: {diffractionLosses.total.toFixed(2)} dB</p>
            <div className="mt-2">
              <h4 className="font-medium">Détail par obstacle:</h4>
              {diffractionLosses.obstacles.map((loss, index) => (
                <div key={index} className="text-sm">
                  <p>Obstacle {index + 1}: {loss.loss.toFixed(2)} dB</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zone de visualisation 3D */}
      <div className="w-3/4">
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <Grid
            args={[100, 100]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6f6f6f"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={50}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />

          <Terrain />
          
          {antennas.map((antenna, index) => (
            <Antenna
              key={index}
              position={antenna.position}
              gain={antenna.gain}
              type={antenna.type}
            />
          ))}

          {antennas.length === 2 && distance > 0 && (
            <FresnelZone
              frequency={frequency}
              distance={distance}
              color="#00ff00"
              opacity={0.3}
            />
          )}

          {obstacles.map((obstacle) => (
            <Obstacle
              key={obstacle.id}
              position={obstacle.position}
              dimensions={obstacle.dimensions}
              type={obstacle.type}
              isInFresnelZone={obstacle.isInFresnelZone}
            />
          ))}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default SimulationView;