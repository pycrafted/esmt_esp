import React,{useState} from 'react';
import SimulationView from '../components/simulation/SimulationView';


const Simulation: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <div className="p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Simulation et Visualisation</h2>
        
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={()=>setIsActive(false)}>Bilan de Liaison</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={()=>setIsActive(true)}>obstacles</button>
          </div>
        </div>
        <SimulationView isActive={isActive} />
      </div>
    </div>
  );
};

export default Simulation;