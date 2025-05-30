import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const chartData = [
    { name: 'Zone', value: area },
    { name: 'Sites BTS', value: nbSites },
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Résultats du dimensionnement GSM', 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [['Paramètre', 'Valeur']],
      body: [
        ["Nombre d'abonnés", nbAbonnes.toLocaleString(undefined, { maximumFractionDigits: 0 })],
        ['Trafic total (Erlangs)', traficTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })],
        ['Nombre de TRX', nbTRX],
        ['Nombre de sites BTS', nbSites],
      ],
    });
    doc.save('resultats_gsm.pdf');
  };

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
      <div className="mt-8">
        <h4 className="font-semibold mb-2">Graphique : Nombre de sites BTS par zone</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button
        onClick={handleExportPDF}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Exporter en PDF
      </button>
    </div>
  );
};

export default GSMResults; 