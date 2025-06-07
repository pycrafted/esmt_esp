import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Bienvenue dans l'outil de dimensionnement des liaisons hertziennes
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Simulation
          </h2>
          <p className="text-gray-600 mb-4">
            Accédez à nos outils de simulation pour dimensionner vos liaisons hertziennes :
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                to="/simulation/link-budget"
                className="text-blue-600 hover:text-blue-800"
              >
                • Bilan de Liaison
              </Link>
            </li>
            <li>
              <Link
                to="/simulation/fresnel"
                className="text-blue-600 hover:text-blue-800"
              >
                • Zone de Fresnel
              </Link>
            </li>
            <li>
              <Link
                to="/simulation/diffraction"
                className="text-blue-600 hover:text-blue-800"
              >
                • Diffraction
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Documentation
          </h2>
          <p className="text-gray-600 mb-4">
            Consultez notre documentation pour en savoir plus sur :
          </p>
          <ul className="space-y-2">
            <li>• Théorie des liaisons hertziennes</li>
            <li>• Méthodes de calcul</li>
            <li>• Bonnes pratiques</li>
            <li>• Exemples d'utilisation</li>
          </ul>
          <Link
            to="/documentation"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            Voir la documentation →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 