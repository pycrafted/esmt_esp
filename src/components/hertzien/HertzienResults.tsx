import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HertzienResultsProps {
  frequency: number; // GHz
  distance: number; // km
  power: number; // dBm
  gainTx: number; // dBi
  gainRx: number; // dBi
  losses: number; // dB
  threshold: number; // dBm
}

const HertzienResults: React.FC<HertzienResultsProps> = ({ frequency, distance, power, gainTx, gainRx, losses, threshold }) => {
  // Conversion de la fréquence en MHz pour la formule
  const freqMHz = frequency * 1000;
  // Calculs
  const affaiblissement = 32.4 + 20 * Math.log10(freqMHz) + 20 * Math.log10(distance);
  const bilan = power + gainTx + gainRx - affaiblissement - losses;
  const marge = bilan - threshold;

  // Indicateur couleur pour la marge
  let margeColor = 'bg-green-500';
  let margeLabel = 'Bonne marge';
  let recommandation = "La liaison est fiable.";
  if (marge < 3) {
    margeColor = 'bg-red-500';
    margeLabel = 'Marge insuffisante';
    recommandation = "Attention : la marge de liaison est insuffisante. Améliorez le gain, réduisez les pertes ou la distance.";
  } else if (marge < 10) {
    margeColor = 'bg-yellow-400';
    margeLabel = 'Marge limite';
    recommandation = "La marge est limite. Un ajustement des paramètres est conseillé.";
  }

  // Générer des points pour le profil de liaison (distance de 1 à la distance saisie)
  const profileData = Array.from({ length: Math.max(2, Math.ceil(distance)) }, (_, i) => {
    const d = (i + 1) * (distance / Math.max(2, Math.ceil(distance)));
    const aff = 32.4 + 20 * Math.log10(freqMHz) + 20 * Math.log10(d);
    return { d: d.toFixed(2), aff: Number(aff.toFixed(2)) };
  });

  const [showFormula, setShowFormula] = useState(false);

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString(),
      affaiblissement,
      bilan,
      marge,
      params: { frequency, distance, power, gainTx, gainRx, losses, threshold },
    };
    const history = JSON.parse(localStorage.getItem('hertzien_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('hertzien_history', JSON.stringify(history.slice(0, 10)));
    alert('Résultat hertzien sauvegardé !');
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Résultats du bilan hertzien</h3>
      <table className="min-w-full bg-white border rounded shadow">
        <tbody>
          <tr>
            <td className="border px-4 py-2 font-medium">Affaiblissement espace libre (dB)</td>
            <td className="border px-4 py-2">{affaiblissement.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Bilan de liaison (dB)</td>
            <td className="border px-4 py-2">{bilan.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Marge de liaison (dB)</td>
            <td className="border px-4 py-2 flex items-center gap-2">
              {marge.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              <span className={`inline-block w-3 h-3 rounded-full ${margeColor}`} title={margeLabel}></span>
              <span className="text-xs text-gray-600">{margeLabel}</span>
            </td>
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
          <b>Formule de l'affaiblissement espace libre :</b><br/>
          <span className="font-mono">A = 32.4 + 20·log₁₀(F) + 20·log₁₀(D)</span><br/>
          où <b>A</b> = affaiblissement (dB), <b>F</b> = fréquence (MHz), <b>D</b> = distance (km)<br/><br/>
          <b>Formule du bilan de liaison :</b><br/>
          <span className="font-mono">Bilan = P<sub>ém</sub> + G<sub>Tx</sub> + G<sub>Rx</sub> - A - Pertes</span><br/>
          où <b>P<sub>ém</sub></b> = puissance émission (dBm), <b>G<sub>Tx</sub></b> = gain antenne émission (dBi), <b>G<sub>Rx</sub></b> = gain antenne réception (dBi), <b>Pertes</b> = pertes diverses (dB)<br/><br/>
          <b>Formule de la marge de liaison :</b><br/>
          <span className="font-mono">Marge = Bilan - Seuil</span><br/>
          où <b>Seuil</b> = sensibilité du récepteur (dBm)<br/><br/>
          <b>Explication :</b> On additionne la puissance d'émission et les gains, puis on soustrait toutes les pertes et l'affaiblissement, et enfin on compare au seuil de sensibilité du récepteur.<br/>
          <a href="#" className="text-blue-700 underline" target="_blank" rel="noopener">Voir le cours : Bilan de liaison FH</a>
        </div>
      )}
      <div className="mt-4 p-3 rounded bg-gray-100 text-sm">
        <strong>Recommandation :</strong> {recommandation}
      </div>
      <div className="mt-8">
        <h4 className="font-semibold mb-2">Profil de liaison : Affaiblissement en fonction de la distance</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={profileData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="d" label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Affaiblissement (dB)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="aff" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
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

export default HertzienResults; 