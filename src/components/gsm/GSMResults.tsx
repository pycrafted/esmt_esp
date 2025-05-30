import React, { useState } from 'react';
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

  const [showFormula, setShowFormula] = useState(false);

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

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString(),
      nbAbonnes,
      traficTotal,
      nbTRX,
      nbSites,
      params: { area, density, trafficPerUser, penetration, activity },
    };
    const history = JSON.parse(localStorage.getItem('gsm_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('gsm_history', JSON.stringify(history.slice(0, 10)));
    alert('Résultat GSM sauvegardé !');
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
      <button
        onClick={() => setShowFormula((v) => !v)}
        className="mt-3 mb-2 bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
      >
        {showFormula ? 'Masquer la formule' : 'Voir la formule'}
      </button>
      {showFormula && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm">
          <b>Formule du nombre d'abonnés :</b><br/>
          <span className="font-mono">N = S × D × (P / 100)</span><br/>
          où <b>N</b> = nombre d'abonnés, <b>S</b> = superficie (km²), <b>D</b> = densité (hab/km²), <b>P</b> = taux de pénétration (%)<br/><br/>
          <b>Formule du trafic total :</b><br/>
          <span className="font-mono">T = N × t × a</span><br/>
          où <b>T</b> = trafic total (Erlangs), <b>t</b> = trafic par abonné (mErlang), <b>a</b> = activité<br/><br/>
          <b>Formule du nombre de TRX :</b><br/>
          <span className="font-mono">TRX = T / Capacité<sub>TRX</sub></span><br/>
          où <b>Capacité<sub>TRX</sub></b> = capacité d'un TRX (Erlangs)<br/><br/>
          <b>Formule du nombre de sites BTS :</b><br/>
          <span className="font-mono">Sites = S / Couverture<sub>site</sub></span><br/>
          où <b>Couverture<sub>site</sub></b> = surface couverte par un site (km²)<br/><br/>
          <b>Explication :</b> On estime le nombre d'abonnés à partir de la zone, de la densité et du taux de pénétration, puis on calcule le trafic total, le nombre de TRX nécessaires et enfin le nombre de sites à installer.<br/>
          <a href="#" className="text-blue-700 underline" target="_blank" rel="noopener">Voir le cours : Dimensionnement GSM</a>
        </div>
      )}
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
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
      >
        Sauvegarder
      </button>
    </div>
  );
};

export default GSMResults; 