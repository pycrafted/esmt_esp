import React from 'react';

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
      <div className="mt-4 p-3 rounded bg-gray-100 text-sm">
        <strong>Recommandation :</strong> {recommandation}
      </div>
    </div>
  );
};

export default OptiqueResults; 