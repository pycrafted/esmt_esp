import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Home from '@/pages/Home';
import Simulation from '@/pages/Simulation';
import Documentation from '@/pages/Documentation';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation/*" element={<Simulation />} />
            <Route path="/documentation" element={<Documentation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
