import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useSimulationStore } from '@/stores/simulationStore';
import Terrain from './Terrain';
import Antenna from './Antenna';
import FresnelZone from './FresnelZone';
import Obstacle from './Obstacle';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface VisualizationFormValues {
  terrainType: string;
  obstacleCount: string;
  viewMode: string;
}

const initialValues: VisualizationFormValues = {
  terrainType: 'flat',
  obstacleCount: '5',
  viewMode: '3d',
};

const pedagogicHelp = {
  terrainType: {
    short: "Type de terrain pour la simulation.",
    example: "Ex : plat, montagneux, urbain",
    why: "Le type de terrain influence la propagation des ondes."
  },
  obstacleCount: {
    short: "Nombre d'obstacles à générer.",
    example: "Ex : 5 (peu d'obstacles), 20 (nombreux obstacles)",
    why: "Les obstacles créent des phénomènes de diffraction et d'atténuation."
  },
  viewMode: {
    short: "Mode de visualisation.",
    example: "Ex : 3D, 2D, carte de couverture",
    why: "Différentes vues permettent d'analyser différents aspects de la propagation."
  }
};

// Liste de termes pour le glossaire
const termesVisualization = [
    { id: 'terrain', terme: 'Terrain', definition: "Surface sur laquelle se propagent les ondes.", exemple: 'Un terrain montagneux crée plus d\'obstacles à la propagation.' },
    { id: 'obstacle', terme: 'Obstacle', definition: "Élément qui perturbe la propagation des ondes.", exemple: 'Un bâtiment entre deux antennes crée une zone d\'ombre.' },
    { id: 'viewMode', terme: 'Mode de visualisation', definition: "Façon de représenter la propagation des ondes.", exemple: 'La vue 3D permet de visualiser le relief et les obstacles.' },
  ];
  

const SimulationVisualization: React.FC = () => {
  const { antennas, frequency } = useSimulationStore();
  const [values, setValues] = useState(initialValues);
  const [showWhy, setShowWhy] = useState<{ [k: string]: boolean }>({});
  const [showGlossaire, setShowGlossaire] = useState(false);
  const [glossaireFocus, setGlossaireFocus] = useState<string | undefined>(undefined);
  const [obstacles, setObstacles] = useState<Array<{id: string, position: [number, number, number], dimensions: [number, number, number], type: string}>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleShowWhy = (field: string) => {
    setShowWhy((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleOpenGlossaire = (id: string) => {
    setGlossaireFocus(id);
    setShowGlossaire(true);
  };

  const generateRandomObstacles = () => {
    const count = parseInt(values.obstacleCount) || 5;
    const newObstacles = [];
    
    const obstacleTypes = ['building', 'mountain', 'forest'];
    
    for (let i = 0; i < count; i++) {
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)] as 'building' | 'mountain' | 'forest';
      newObstacles.push({
        id: `obstacle-${i}`,
        position: [
          (Math.random() - 0.5) * 50,
          Math.random() * 5,
          (Math.random() - 0.5) * 50
        ] as [number, number, number],
        dimensions: [
          Math.random() * 5 + 1,
          Math.random() * 10 + 1,
          Math.random() * 5 + 1
        ] as [number, number, number],
        type
      });
    }
    
    setObstacles(newObstacles);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        {/* Panneau de contrôle */}
        <div className="w-1/3 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Paramètres de visualisation</h3>
          
          <div className="space-y-4">
            {/* Type de terrain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de terrain
                <InfoBulle 
                  content={<div>
                    <p>{pedagogicHelp.terrainType.short}</p>
                    <p className="text-gray-500 mt-1">{pedagogicHelp.terrainType.example}</p>
                    {showWhy.terrainType && <p className="text-gray-600 mt-1">{pedagogicHelp.terrainType.why}</p>}
                    <button 
                      type="button" 
                      onClick={() => handleShowWhy('terrainType')}
                      className="text-blue-600 hover:underline mt-1 text-xs"
                    >
                      {showWhy.terrainType ? "Masquer l'explication" : "Pourquoi ce paramètre ?"}
                    </button>
                  </div>}
                  glossaireId="terrain"
                  onOpenGlossaire={handleOpenGlossaire}
                />
              </label>
              <select
                name="terrainType"
                value={values.terrainType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="flat">Plat</option>
                <option value="hilly">Vallonné</option>
                <option value="mountainous">Montagneux</option>
                <option value="urban">Urbain</option>
              </select>
            </div>
            
            {/* Nombre d'obstacles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre d'obstacles
                <InfoBulle 
                  content={<div>
                    <p>{pedagogicHelp.obstacleCount.short}</p>
                    <p className="text-gray-500 mt-1">{pedagogicHelp.obstacleCount.example}</p>
                    {showWhy.obstacleCount && <p className="text-gray-600 mt-1">{pedagogicHelp.obstacleCount.why}</p>}
                    <button 
                      type="button" 
                      onClick={() => handleShowWhy('obstacleCount')}
                      className="text-blue-600 hover:underline mt-1 text-xs"
                    >
                      {showWhy.obstacleCount ? "Masquer l'explication" : "Pourquoi ce paramètre ?"}
                    </button>
                  </div>}
                  glossaireId="obstacle"
                  onOpenGlossaire={handleOpenGlossaire}
                />
              </label>
              <input
                type="number"
                name="obstacleCount"
                value={values.obstacleCount}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Mode de visualisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode de visualisation
                <InfoBulle 
                  content={<div>
                    <p>{pedagogicHelp.viewMode.short}</p>
                    <p className="text-gray-500 mt-1">{pedagogicHelp.viewMode.example}</p>
                    {showWhy.viewMode && <p className="text-gray-600 mt-1">{pedagogicHelp.viewMode.why}</p>}
                    <button 
                      type="button" 
                      onClick={() => handleShowWhy('viewMode')}
                      className="text-blue-600 hover:underline mt-1 text-xs"
                    >
                      {showWhy.viewMode ? "Masquer l'explication" : "Pourquoi ce paramètre ?"}
                    </button>
                  </div>}
                  glossaireId="viewMode"
                  onOpenGlossaire={handleOpenGlossaire}
                />
              </label>
              <select
                name="viewMode"
                value={values.viewMode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3d">Vue 3D</option>
                <option value="2d">Vue 2D</option>
                <option value="coverage">Carte de couverture</option>
              </select>
            </div>
            
            <button
              onClick={generateRandomObstacles}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Générer des obstacles aléatoires
            </button>
          </div>
          
          {/* Bouton Glossaire */}
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={() => setShowGlossaire(true)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="mr-1">📖</span> Glossaire
            </button>
          </div>
        </div>
        
        {/* Zone de visualisation 3D */}
        <div className="w-2/3 h-[500px] bg-gray-100 rounded-lg ml-4">
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

            <Terrain type={values.terrainType} />
            
            {antennas.map((antenna, index) => (
              <Antenna
                key={index}
                position={antenna.position}
                gain={antenna.gain}
                type={antenna.type}
              />
            ))}

            {antennas.length === 2 && (
              <FresnelZone
                frequency={frequency}
                distance={Math.sqrt(
                  Math.pow(antennas[1].position[0] - antennas[0].position[0], 2) +
                  Math.pow(antennas[1].position[2] - antennas[0].position[2], 2)
                )}
                color="#00ff00"
                opacity={0.3}
              />
            )}

            {obstacles.map((obstacle) => (
              <Obstacle
                key={obstacle.id}
                position={obstacle.position}
                dimensions={obstacle.dimensions}
                type={obstacle.type as 'building' | 'mountain' | 'forest'}
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
      
      {/* Glossaire */}
      <Glossaire
        open={showGlossaire}
        onClose={() => setShowGlossaire(false)}
        focusId={glossaireFocus}
        termes={termesVisualization}
      />
    </div>
  );
};

export default SimulationVisualization;