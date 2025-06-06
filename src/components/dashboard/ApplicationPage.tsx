import React from 'react';

const ApplicationPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Laboratoire d'application graphique</h1>
      <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
        {/* Ajoutez ici vos tests de composants, glossaires, infobulles, etc. */}
        <p className="text-gray-600">Cette page vous permet de tester les composants graphiques de l'application (glossaires, infobulles, formulaires, etc.).</p>
      </div>
    </div>
  );
};

export default ApplicationPage; 