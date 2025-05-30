import React from 'react';

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
      <h3 className="text-lg font-semibold mb-4">Résultats du dimensionnement UMTS</h3>
      <table className="min-w-full bg-white border rounded shadow">
        <tbody>
          <tr>
            <td className="border px-4 py-2 font-medium">Débit total voix (kbps)</td>
            <td className="border px-4 py-2">{debitVoix.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Débit total data (kbps)</td>
            <td className="border px-4 py-2">{debitData.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Débit total vidéo (kbps)</td>
            <td className="border px-4 py-2">{debitVideo.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Débit total (kbps)</td>
            <td className="border px-4 py-2">{debitTotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Capacité utile par cellule (kbps)</td>
            <td className="border px-4 py-2">{capaciteUtileCellule.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Nombre de cellules nécessaires</td>
            <td className="border px-4 py-2">{nbCellules}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Nombre de NodeB nécessaires</td>
            <td className="border px-4 py-2">{nbNodeB}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 p-3 rounded bg-gray-100 text-sm">
        <strong>Recommandation :</strong> {recommandation}
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
      >
        Sauvegarder
      </button>
    </div>
  );
};

export default UMTSResults; 