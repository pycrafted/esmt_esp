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
      <h3 className="text-lg font-semibold mb-4">Résultats du bilan optique</h3>
      <table className="min-w-full bg-white border rounded shadow">
        <tbody>
          <tr>
            <td className="border px-4 py-2 font-medium">Atténuation fibre totale (dB)</td>
            <td className="border px-4 py-2">{attFibre.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Pertes épissures (dB)</td>
            <td className="border px-4 py-2">{pertesEpissures.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Pertes connecteurs (dB)</td>
            <td className="border px-4 py-2">{pertesConnecteurs.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Pertes diverses (dB)</td>
            <td className="border px-4 py-2">{losses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Pertes totales (dB)</td>
            <td className="border px-4 py-2">{pertesTotales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Bilan de puissance (dBm)</td>
            <td className="border px-4 py-2">{bilan.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={() => setShowFormula((v) => !v)}
        className="mt-3 mb-2 bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
      >
        {showFormula ? 'Masquer la formule' : 'Voir la formule'}
      </button>
      {showFormula && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm">
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

export default OptiqueResults; 