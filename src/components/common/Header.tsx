import React, { useState } from 'react';
import Glossaire from './Glossaire';

const Header: React.FC = () => {
  const [showGlossaire, setShowGlossaire] = useState(false);
  return (
    <header className="bg-blue-900 text-white p-4 shadow-md flex items-center justify-between">
      <h1 className="text-2xl font-bold">Outil de Dimensionnement Télécoms</h1>
      <button
        onClick={() => setShowGlossaire(true)}
        className="bg-blue-100 text-blue-900 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-200 ml-4"
      >
        Glossaire
      </button>
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} />
    </header>
  );
};

export default Header; 