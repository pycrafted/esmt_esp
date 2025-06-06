import React, { useState } from 'react';

interface OptiqueResultsProps {
  length: number; // km
  attenuation: number; // dB/km
  splices: number;
  connectors: number;
  losses: number; // dB
  power: number; // dBm
}

const OptiqueResults: React.FC<OptiqueResultsProps> = ({ length, attenuation, splices, connectors, losses, power }) => {
  const attFibre = length * attenuation;
  const pertesEpissures = splices * 0.1;
  const pertesConnecteurs = connectors * 0.5;
  const pertesTotales = attFibre + pertesEpissures + pertesConnecteurs + losses;
  const bilan = power - pertesTotales;

  let recommandation = 'La liaison optique est correcte.';
  if (bilan < 0) {
    recommandation = "Attention : le bilan est négatif. Améliorez la puissance, réduisez les pertes ou la longueur.";
  } else if (bilan < 3) {
    recommandation = "Le bilan est limite. Un ajustement des paramètres est conseillé.";
  }

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString(),
      attFibre,
      pertesEpissures,
      pertesConnecteurs,
      pertesTotales,
      bilan,
      params: { length, attenuation, splices, connectors, losses, power },
    };
    const history = JSON.parse(localStorage.getItem('optique_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('optique_history', JSON.stringify(history.slice(0, 10)));
    alert('Résultat optique sauvegardé !');
  };

  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6 text-primary-dark">Résultats du bilan optique</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-primary mb-1">{attFibre.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Atténuation fibre totale (dB)</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-green-700 mb-1">{pertesEpissures.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes épissures (dB)</span>
        </div>
        <div className="bg-pink-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-pink-700 mb-1">{pertesConnecteurs.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes connecteurs (dB)</span>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-yellow-600 mb-1">{losses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes diverses (dB)</span>
        </div>
        <div className="bg-purple-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-purple-700 mb-1">{pertesTotales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes totales (dB)</span>
        </div>
        <div className={`rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow ${bilan < 0 ? 'bg-red-50' : bilan < 3 ? 'bg-yellow-50' : 'bg-teal-50'}`}> 
          <span className={`text-3xl font-bold mb-1 ${bilan < 0 ? 'text-red-600' : bilan < 3 ? 'text-yellow-600' : 'text-teal-700'}`}>{bilan.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Bilan de puissance (dBm)</span>
        </div>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShowFormula((v) => !v)}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2 mb-3 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Formule">🧮</span>
          {showFormula ? 'Masquer la formule' : 'Voir la formule'}
        </button>
        {showFormula && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow text-sm">
            <b>Formule de l'atténuation fibre :</b><br/>
            <span className="font-mono">A<sub>fibre</sub> = L × a</span><br/>
            où <b>L</b> = longueur (km), <b>a</b> = atténuation (dB/km)<br/><br/>
            <b>Formule des pertes épissures :</b><br/>
            <span className="font-mono">P<sub>épissures</sub> = N<sub>épissures</sub> × 0.1</span><br/>
            <b>Formule des pertes connecteurs :</b><br/>
            <span className="font-mono">P<sub>connecteurs</sub> = N<sub>connecteurs</sub> × 0.5</span><br/>
            <b>Formule des pertes totales :</b><br/>
            <span className="font-mono">P<sub>totales</sub> = A<sub>fibre</sub> + P<sub>épissures</sub> + P<sub>connecteurs</sub> + P<sub>diverses</sub></span><br/>
            <b>Formule du bilan de puissance :</b><br/>
            <span className="font-mono">Bilan = P<sub>ém</sub> - P<sub>totales</sub></span><br/>
            où <b>P<sub>ém</sub></b> = puissance émetteur (dBm)<br/><br/>
            <b>Explication :</b> On additionne toutes les pertes (fibre, épissures, connecteurs, diverses), puis on les soustrait à la puissance d'émission pour obtenir le bilan.<br/>
            <a href="#" className="text-blue-700 underline" target="_blank" rel="noopener">Voir le cours : Budget de puissance optique</a>
          </div>
        )}
      </div>
      <div className="mb-6 p-4 rounded-xl bg-gray-100 shadow flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="text-sm text-gray-700"><strong>Recommandation :</strong> {recommandation}</div>
      </div>
      <button
        onClick={handleSave}
        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
      >
        <span role="img" aria-label="Sauvegarder">💾</span> Sauvegarder
      </button>
    </div>
  );
};

export default OptiqueResults; 