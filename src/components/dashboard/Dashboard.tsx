import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

const Dashboard: React.FC = () => {
  const [gsmHistory, setGsmHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    setGsmHistory(getGsmHistory());
  }, []);

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
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Historique des calculs GSM</h3>
        {gsmHistory.length === 0 ? (
          <div className="text-gray-500">Aucun calcul GSM sauvegardé pour le moment.</div>
        ) : (
          <table className="min-w-full bg-white border rounded shadow text-sm">
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
    </div>
  );
};

export default Dashboard; 