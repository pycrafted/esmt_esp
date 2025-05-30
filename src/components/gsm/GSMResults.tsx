import React from 'react';

interface GSMResultsProps {
  area: number;
  density: number;
  trafficPerUser: number;
  penetration: number;
  activity: number;
}

const CAPACITE_TRX = 2; // Erlangs
const COUVERTURE_PAR_SITE = 5; // km²

const GSMResults: React.FC<GSMResultsProps> = ({ area, density, trafficPerUser, penetration, activity }) => {
  // Calculs
  const nbAbonnes = area * density * (penetration / 100);
  const traficTotal = nbAbonnes * trafficPerUser * activity;
  const nbTRX = Math.ceil(traficTotal / CAPACITE_TRX);
  const nbSites = Math.ceil(area / COUVERTURE_PAR_SITE);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Résultats du dimensionnement GSM</h3>
      <table className="min-w-full bg-white border rounded shadow">
        <tbody>
          <tr>
            <td className="border px-4 py-2 font-medium">Nombre d'abonnés</td>
            <td className="border px-4 py-2">{nbAbonnes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Trafic total (Erlangs)</td>
            <td className="border px-4 py-2">{traficTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Nombre de TRX</td>
            <td className="border px-4 py-2">{nbTRX}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-medium">Nombre de sites BTS</td>
            <td className="border px-4 py-2">{nbSites}</td>
          </tr>
        </tbody>
      </table>
      <div className="text-xs text-gray-500 mt-2">
        <div>Capacité TRX utilisée : {CAPACITE_TRX} Erlangs</div>
        <div>Couverture par site utilisée : {COUVERTURE_PAR_SITE} km²</div>
      </div>
    </div>
  );
};

export default GSMResults; 