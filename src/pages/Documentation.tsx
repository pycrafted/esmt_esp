import React, { useState } from 'react';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('theorie');

  const sections = {
    theorie: {
      title: 'Théorie des liaisons hertziennes',
      icon: '📡',
      content: (
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            Une liaison hertzienne est un système de transmission de données sans fil
            utilisant des ondes radio. Elle est composée de deux antennes paraboliques
            qui communiquent entre elles en ligne de visée.
          </p>
          <div className="bg-blue-50 p-6 rounded-xl mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Paramètres clés</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">1</span>
                Fréquence de fonctionnement
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">2</span>
                Distance entre les antennes
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">3</span>
                Gain des antennes
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">4</span>
                Puissance d'émission
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">5</span>
                Obstacles sur le trajet
              </li>
            </ul>
          </div>
        </div>
      )
    },
    methodes: {
      title: 'Méthodes de calcul',
      icon: '🧮',
      content: (
        <div className="prose max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bilan de liaison</h3>
              <p className="text-gray-600 mb-4">
                Le bilan de liaison permet de calculer la puissance reçue en tenant compte
                de tous les gains et pertes du système :
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Perte en espace libre (formule de Friis)</li>
                <li>• Gain des antennes</li>
                <li>• Pertes dans les câbles</li>
                <li>• Pertes par diffraction</li>
                <li>• Marge de fade</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Zone de Fresnel</h3>
              <p className="text-gray-600 mb-4">
                La première zone de Fresnel doit être dégagée pour assurer une bonne
                qualité de transmission. Son rayon est calculé en fonction de :
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• La fréquence</li>
                <li>• La distance totale</li>
                <li>• La position du point considéré</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Diffraction</h3>
              <p className="text-gray-600 mb-4">
                La diffraction se produit lorsqu'une onde rencontre un obstacle. Les
                pertes par diffraction sont calculées en utilisant :
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Le paramètre de diffraction v</li>
                <li>• La méthode de Deygout</li>
                <li>• La hauteur des obstacles</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    bonnesPratiques: {
      title: 'Bonnes pratiques',
      icon: '✅',
      content: (
        <div className="prose max-w-none">
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Recommandations essentielles</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-600 mr-3">✓</span>
                <div>
                  <strong className="text-green-800">Maintenir une marge de fade suffisante</strong>
                  <p className="text-gray-600">Recommandé : 20-30 dB pour assurer une bonne fiabilité</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3">✓</span>
                <div>
                  <strong className="text-green-800">Dégager la première zone de Fresnel</strong>
                  <p className="text-gray-600">Éviter les obstacles dans la zone critique de propagation</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3">✓</span>
                <div>
                  <strong className="text-green-800">Tenir compte des variations climatiques</strong>
                  <p className="text-gray-600">Prévoir les effets de la pluie et des conditions atmosphériques</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3">✓</span>
                <div>
                  <strong className="text-green-800">Prévoir une redondance si nécessaire</strong>
                  <p className="text-gray-600">Assurer la continuité du service en cas de défaillance</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3">✓</span>
                <div>
                  <strong className="text-green-800">Respecter les réglementations en vigueur</strong>
                  <p className="text-gray-600">Se conformer aux normes et autorisations requises</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center">
        <span className="mr-3">📚</span>
        Documentation
      </h1>

      {/* Navigation */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeSection === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <span className="text-2xl mr-3">{sections[activeSection as keyof typeof sections].icon}</span>
          <h2 className="text-2xl font-semibold text-gray-800">
            {sections[activeSection as keyof typeof sections].title}
          </h2>
        </div>
        {sections[activeSection as keyof typeof sections].content}
      </div>
    </div>
  );
};

export default Documentation; 