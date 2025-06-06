import React, { useState } from 'react';

interface UMTSResultsProps {
  area: number;
  users: number;
  voice: number;
  data: number;
  video: number;
  load: number;
}

const CAPACITE_CELLULE = 3840; // kbps (exemple)
const SECTEURS_PAR_NODEB = 3;

const UMTSResults: React.FC<UMTSResultsProps> = ({ area, users, voice, data, video, load }) => {
  const debitVoix = users * voice;
  const debitData = users * data;
  const debitVideo = users * video;
  const debitTotal = debitVoix + debitData + debitVideo;
  const facteurCharge = load / 100;
  const capaciteUtileCellule = CAPACITE_CELLULE * facteurCharge;
  const nbCellules = Math.ceil(debitTotal / capaciteUtileCellule);
  const nbNodeB = Math.ceil(nbCellules / SECTEURS_PAR_NODEB);
  const [showFormula, setShowFormula] = useState(false);

  let recommandation = 'Dimensionnement UMTS correct.';
  if (capaciteUtileCellule < 1000) {
    recommandation = "Attention : le facteur de charge est très faible, la capacité utile par cellule est limitée.";
  } else if (nbNodeB > area) {
    recommandation = "Attention : le nombre de NodeB est supérieur à la zone, vérifiez les paramètres.";
  }

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString(),
      debitVoix,
      debitData,
      debitVideo,
      debitTotal,
      capaciteUtileCellule,
      nbCellules,
      nbNodeB,
      params: { area, users, voice, data, video, load },
    };
    const history = JSON.parse(localStorage.getItem('umts_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('umts_history', JSON.stringify(history.slice(0, 10)));
    alert('Résultat UMTS sauvegardé !');
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6 text-primary-dark">Résultats du dimensionnement UMTS</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-primary mb-1">{debitVoix.toLocaleString()}</span>
          <span className="text-gray-700 text-sm font-medium">Débit total voix (kbps)</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-green-700 mb-1">{debitData.toLocaleString()}</span>
          <span className="text-gray-700 text-sm font-medium">Débit total data (kbps)</span>
        </div>
        <div className="bg-pink-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-pink-700 mb-1">{debitVideo.toLocaleString()}</span>
          <span className="text-gray-700 text-sm font-medium">Débit total vidéo (kbps)</span>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-yellow-600 mb-1">{debitTotal.toLocaleString()}</span>
          <span className="text-gray-700 text-sm font-medium">Débit total (kbps)</span>
        </div>
        <div className="bg-purple-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-purple-700 mb-1">{capaciteUtileCellule.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Capacité utile par cellule (kbps)</span>
        </div>
        <div className="bg-orange-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-orange-600 mb-1">{nbCellules}</span>
          <span className="text-gray-700 text-sm font-medium">Nombre de cellules nécessaires</span>
        </div>
        <div className="bg-teal-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-teal-700 mb-1">{nbNodeB}</span>
          <span className="text-gray-700 text-sm font-medium">Nombre de NodeB nécessaires</span>
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
            <b>Formule de la capacité utile par cellule :</b><br/>
            <span className="font-mono">C<sub>utile</sub> = C<sub>cellule</sub> × Facteur de charge</span><br/>
            <b>Formule du nombre de cellules :</b><br/>
            <span className="font-mono">N<sub>cellules</sub> = Débit total / C<sub>utile</sub></span><br/>
            <b>Formule du nombre de NodeB :</b><br/>
            <span className="font-mono">N<sub>NodeB</sub> = N<sub>cellules</sub> / 3</span><br/>
            <b>Explication :</b> On calcule la capacité utile par cellule, puis le nombre de cellules nécessaires, et enfin le nombre de NodeB à installer.<br/>
            <a href="#" className="text-blue-700 underline" target="_blank" rel="noopener">Voir le cours : Dimensionnement UMTS</a>
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

export default UMTSResults; 