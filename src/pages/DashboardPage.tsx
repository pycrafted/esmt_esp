import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Tableau de bord</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">GSM</h3>
            <p className="text-gray-600">Dimensionnement de réseaux GSM</p>
            <a href="/gsm" className="mt-2 inline-block text-blue-600 hover:underline">Accéder →</a>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">UMTS</h3>
            <p className="text-gray-600">Dimensionnement de réseaux UMTS (3G)</p>
            <a href="/umts" className="mt-2 inline-block text-blue-600 hover:underline">Accéder →</a>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Hertzien</h3>
            <p className="text-gray-600">Dimensionnement de liaisons hertziennes</p>
            <a href="/hertzien" className="mt-2 inline-block text-blue-600 hover:underline">Accéder →</a>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Optique</h3>
            <p className="text-gray-600">Dimensionnement de réseaux optiques</p>
            <a href="/optique" className="mt-2 inline-block text-blue-600 hover:underline">Accéder →</a>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Simulation</h3>
            <p className="text-gray-600">Simulation et visualisation de réseaux</p>
            <a href="/simulation" className="mt-2 inline-block text-blue-600 hover:underline">Accéder →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;