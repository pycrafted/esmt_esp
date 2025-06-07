import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimulationView from '../components/simulation/SimulationView';
import SimulationVisualization from '@/components/simulation/SimulationVisualization';

const Simulation: React.FC = () => {
  return (
    <div className="p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Simulation et Visualisation</h2>
        
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <a href="/simulation/link-budget" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Bilan de Liaison
            </a>
            <a href="/simulation/fresnel" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Zone de Fresnel
            </a>
            <a href="/simulation/diffraction" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Diffraction
            </a>
            <a href="/simulation/visualization" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Visualisation
            </a>
          </div>
        </div>
        
        <Routes>
          <Route path="/link-budget" element={<SimulationView />} />
          <Route path="/fresnel" element={<SimulationView />} />
          <Route path="/diffraction" element={<SimulationView />} />
          <Route path="/visualization" element={<SimulationVisualization />} />
          <Route path="*" element={<SimulationView />} />
        </Routes>
      </div>
    </div>
  );
};

export default Simulation;