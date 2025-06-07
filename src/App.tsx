import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Simulation from '@/pages/Simulation';
import Documentation from '@/pages/Documentation';
import DashboardPage from './pages/DashboardPage';
import GSMPage from './pages/GSMPage';
import HertzienPage from './pages/HertzienPage';
import OptiquePage from './pages/OptiquePage';
import UMTSPage from './pages/UMTSPage';


const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Outil de Dimensionnement Télécoms</h1>
        </header>
        <div className="flex flex-1 overflow-hidden">
          {/* Menu latéral */}
          <div className="w-1/6 bg-blue-800 text-white p-4">
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="block p-2 hover:bg-blue-700 rounded flex items-center">
                  <span className="mr-2">📊</span> Dashboard
                </a>
              </li>
              <li>
                <a href="/gsm" className="block p-2 hover:bg-blue-700 rounded flex items-center">
                  <span className="mr-2">📱</span> GSM
                </a>
              </li>
              <li>
                <a href="/umts" className="block p-2 hover:bg-blue-700 rounded flex items-center">
                  <span className="mr-2">📡</span> UMTS
                </a>
              </li>
              <li>
                <a href="/hertzien" className="block p-2 hover:bg-blue-700 rounded flex items-center">
                  <span className="mr-2">🔌</span> Hertzien
                </a>
              </li>
              <li>
                <a href="/optique" className="block p-2 hover:bg-blue-700 rounded flex items-center">
                  <span className="mr-2">💡</span> Optique
                </a>
              </li>
              <li>
                <a href="/simulation" className="block p-2 hover:bg-blue-700 rounded flex items-center">
                  <span className="mr-2">🖥️</span> Simulation
                </a>
              </li>
            </ul>
          </div>
          {/* Contenu principal */}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/gsm" element={<GSMPage />} />
              <Route path="/umts" element={<UMTSPage />} />
              <Route path="/hertzien" element={<HertzienPage />} />
              <Route path="/optique" element={<OptiquePage />} />
              <Route path="/simulation/*" element={<Simulation />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
