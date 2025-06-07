import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimulationView from '../components/simulation/SimulationView';

const Simulation: React.FC = () => {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <Routes>
        <Route path="/link-budget" element={<SimulationView />} />
        <Route path="/fresnel" element={<SimulationView />} />
        <Route path="/diffraction" element={<SimulationView />} />
        <Route path="*" element={<SimulationView />} />
      </Routes>
    </div>
  );
};

export default Simulation; 