import React from 'react';
import { useSimulationStore } from '../../stores/simulationStore';

export const SimulationControls: React.FC = () => {
  const { antennas, addAntenna, updateAntenna, removeAntenna } = useSimulationStore();

  const handleAddAntenna = () => {
    addAntenna({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      type: 'parabolic',
      gain: 20,
      frequency: 2400,
      power: 20
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Contrôles de Simulation</h2>

      {/* Ajout d'antenne */}
      <div className="space-y-4">
        <button
          onClick={handleAddAntenna}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter une Antenne
        </button>
      </div>

      {/* Liste des antennes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Antennes</h3>
        {antennas.map((antenna, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Antenne {index + 1}</span>
              <button
                onClick={() => removeAntenna(index)}
                className="text-red-400 hover:text-red-300"
              >
                Supprimer
              </button>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="block text-sm">Position</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={antenna.position[0]}
                  onChange={(e) =>
                    updateAntenna(index, {
                      position: [Number(e.target.value), antenna.position[1], antenna.position[2]]
                    })
                  }
                  className="bg-gray-600 rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={antenna.position[1]}
                  onChange={(e) =>
                    updateAntenna(index, {
                      position: [antenna.position[0], Number(e.target.value), antenna.position[2]]
                    })
                  }
                  className="bg-gray-600 rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={antenna.position[2]}
                  onChange={(e) =>
                    updateAntenna(index, {
                      position: [antenna.position[0], antenna.position[1], Number(e.target.value)]
                    })
                  }
                  className="bg-gray-600 rounded px-2 py-1"
                />
              </div>
            </div>

            {/* Paramètres */}
            <div className="space-y-2">
              <label className="block text-sm">Gain (dBi)</label>
              <input
                type="number"
                value={antenna.gain}
                onChange={(e) =>
                  updateAntenna(index, { gain: Number(e.target.value) })
                }
                className="w-full bg-gray-600 rounded px-2 py-1"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">Fréquence (MHz)</label>
              <input
                type="number"
                value={antenna.frequency}
                onChange={(e) =>
                  updateAntenna(index, { frequency: Number(e.target.value) })
                }
                className="w-full bg-gray-600 rounded px-2 py-1"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm">Puissance (dBm)</label>
              <input
                type="number"
                value={antenna.power}
                onChange={(e) =>
                  updateAntenna(index, { power: Number(e.target.value) })
                }
                className="w-full bg-gray-600 rounded px-2 py-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationControls; 