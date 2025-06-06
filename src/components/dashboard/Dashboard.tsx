import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Données fictives pour le dashboard
const stats = [
  { module: 'GSM', sites: 12, marge: 15, bilan: 10 },
  { module: 'Hertzien', sites: 4, marge: 8, bilan: 5 },
  { module: 'Optique', sites: 2, marge: 20, bilan: 18 },
  { module: 'UMTS', sites: 6, marge: 12, bilan: 9 },
];

const getGsmHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('gsm_history') || '[]');
  } catch {
    return [];
  }
};

const getHertzienHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('hertzien_history') || '[]');
  } catch {
    return [];
  }
};

const getOptiqueHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('optique_history') || '[]');
  } catch {
    return [];
  }
};

const getUmtsHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('umts_history') || '[]');
  } catch {
    return [];
  }
};

const Dashboard: React.FC = () => {
  const [gsmHistory, setGsmHistory] = React.useState<any[]>([]);
  const [hertzienHistory, setHertzienHistory] = React.useState<any[]>([]);
  const [optiqueHistory, setOptiqueHistory] = React.useState<any[]>([]);
  const [umtsHistory, setUmtsHistory] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setGsmHistory(getGsmHistory());
    setHertzienHistory(getHertzienHistory());
    setOptiqueHistory(getOptiqueHistory());
    setUmtsHistory(getUmtsHistory());
  }, []);

  function exportAllHistories() {
    const data = {
      gsm: getGsmHistory(),
      hertzien: getHertzienHistory(),
      optique: getOptiqueHistory(),
      umts: getUmtsHistory(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dimensionnement_telecoms_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importAllHistories(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.gsm) localStorage.setItem('gsm_history', JSON.stringify(data.gsm));
        if (data.hertzien) localStorage.setItem('hertzien_history', JSON.stringify(data.hertzien));
        if (data.optique) localStorage.setItem('optique_history', JSON.stringify(data.optique));
        if (data.umts) localStorage.setItem('umts_history', JSON.stringify(data.umts));
        alert('Import réussi !');
        setGsmHistory(getGsmHistory());
        setHertzienHistory(getHertzienHistory());
        setOptiqueHistory(getOptiqueHistory());
        setUmtsHistory(getUmtsHistory());
      } catch {
        alert('Fichier invalide.');
      }
    };
    reader.readAsText(file);
  }

  function exportPDFReport() {
    const doc = new jsPDF();
    doc.text('Rapport de dimensionnement Télécoms', 14, 16);
    let y = 24;

    // GSM
    const gsm = getGsmHistory()[0];
    if (gsm) {
      doc.text('GSM', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Abonnés', 'Sites', 'TRX', 'Trafic (Erlangs)']],
        body: [[
          gsm.nbAbonnes,
          gsm.nbSites,
          gsm.nbTRX,
          gsm.traficTotal
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Hertzien
    const hertzien = getHertzienHistory()[0];
    if (hertzien) {
      doc.text('Hertzien', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Affaiblissement (dB)', 'Bilan (dB)', 'Marge (dB)']],
        body: [[
          hertzien.affaiblissement,
          hertzien.bilan,
          hertzien.marge
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Optique
    const optique = getOptiqueHistory()[0];
    if (optique) {
      doc.text('Optique', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Att. fibre (dB)', 'Pertes totales (dB)', 'Bilan (dBm)']],
        body: [[
          optique.attFibre,
          optique.pertesTotales,
          optique.bilan
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // UMTS
    const umts = getUmtsHistory()[0];
    if (umts) {
      doc.text('UMTS', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Débit total (kbps)', 'Cellules', 'NodeB']],
        body: [[
          umts.debitTotal,
          umts.nbCellules,
          umts.nbNodeB
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    doc.save('rapport_dimensionnement_telecoms.pdf');
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard récapitulatif</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.module} className="bg-white rounded shadow p-5 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">{s.module}</h3>
            <div className="text-3xl font-bold text-blue-700 mb-1">{s.sites}</div>
            <div className="text-gray-600">Sites/NodeB</div>
            <div className="mt-2 text-sm text-gray-500">Marge : {s.marge} dB | Bilan : {s.bilan} dB</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow p-5">
        <h4 className="font-semibold mb-4">Comparatif du nombre de sites/NodeB par module</h4>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="module" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sites" fill="#2563eb" name="Sites/NodeB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Bloc unique pour tous les historiques */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 mt-10">
        <h3 className="text-xl font-bold text-primary-dark mb-4">Historique des calculs</h3>
        {/* GSM */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-blue-700">GSM</h4>
          {gsmHistory.length === 0 ? (
            <div className="text-gray-500">Aucun calcul GSM sauvegardé pour le moment.</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow text-sm mb-2">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Abonnés</th>
                  <th className="border px-2 py-1">Sites</th>
                  <th className="border px-2 py-1">TRX</th>
                  <th className="border px-2 py-1">Trafic (Erlangs)</th>
                </tr>
              </thead>
              <tbody>
                {gsmHistory.slice(0, 5).map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{new Date(entry.date).toLocaleString()}</td>
                    <td className="border px-2 py-1">{entry.nbAbonnes.toLocaleString()}</td>
                    <td className="border px-2 py-1">{entry.nbSites}</td>
                    <td className="border px-2 py-1">{entry.nbTRX}</td>
                    <td className="border px-2 py-1">{entry.traficTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <hr className="my-4 border-gray-200" />
        {/* Hertzien */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-teal-700">Hertzien</h4>
          {hertzienHistory.length === 0 ? (
            <div className="text-gray-500">Aucun calcul hertzien sauvegardé pour le moment.</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow text-sm mb-2">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Affaiblissement (dB)</th>
                  <th className="border px-2 py-1">Bilan (dB)</th>
                  <th className="border px-2 py-1">Marge (dB)</th>
                </tr>
              </thead>
              <tbody>
                {hertzienHistory.slice(0, 5).map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{new Date(entry.date).toLocaleString()}</td>
                    <td className="border px-2 py-1">{entry.affaiblissement.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="border px-2 py-1">{entry.bilan.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="border px-2 py-1">{entry.marge.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <hr className="my-4 border-gray-200" />
        {/* Optique */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-purple-700">Optique</h4>
          {optiqueHistory.length === 0 ? (
            <div className="text-gray-500">Aucun calcul optique sauvegardé pour le moment.</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow text-sm mb-2">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Att. fibre (dB)</th>
                  <th className="border px-2 py-1">Pertes totales (dB)</th>
                  <th className="border px-2 py-1">Bilan (dBm)</th>
                </tr>
              </thead>
              <tbody>
                {optiqueHistory.slice(0, 5).map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{new Date(entry.date).toLocaleString()}</td>
                    <td className="border px-2 py-1">{entry.attFibre.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="border px-2 py-1">{entry.pertesTotales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="border px-2 py-1">{entry.bilan.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <hr className="my-4 border-gray-200" />
        {/* UMTS */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-orange-700">UMTS</h4>
          {umtsHistory.length === 0 ? (
            <div className="text-gray-500">Aucun calcul UMTS sauvegardé pour le moment.</div>
          ) : (
            <table className="min-w-full bg-white border rounded shadow text-sm mb-2">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Débit total (kbps)</th>
                  <th className="border px-2 py-1">Cellules</th>
                  <th className="border px-2 py-1">NodeB</th>
                </tr>
              </thead>
              <tbody>
                {umtsHistory.slice(0, 5).map((entry, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{new Date(entry.date).toLocaleString()}</td>
                    <td className="border px-2 py-1">{entry.debitTotal.toLocaleString()}</td>
                    <td className="border px-2 py-1">{entry.nbCellules}</td>
                    <td className="border px-2 py-1">{entry.nbNodeB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={exportAllHistories}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Exporter JSON">📤</span> Exporter JSON
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-200 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Importer JSON">📥</span> Importer JSON
        </button>
        <button
          onClick={exportPDFReport}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <span role="img" aria-label="Exporter PDF">📄</span> Exporter rapport PDF
        </button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={importAllHistories}
        />
      </div>
    </div>
  );
};

export default Dashboard; 