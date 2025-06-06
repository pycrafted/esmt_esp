import React from 'react';

interface GlossaireProps {
  open: boolean;
  onClose: () => void;
  focusId?: string;
  termes: Array<{
    id: string;
    terme: string;
    definition: string;
    unite?: string;
    exemple?: string;
  }>;
}

const Glossaire: React.FC<GlossaireProps> = ({ open, onClose, focusId, termes }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl">×</button>
        <h2 className="text-xl font-bold mb-4">Glossaire Télécoms</h2>
        {termes.length === 0 ? (
          <div className="text-gray-500 text-center">Aucun terme pour ce thème.</div>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {termes.map((t) => (
              <li key={t.id} className={`border-b pb-2 ${focusId === t.id ? 'bg-blue-50' : ''}`} id={`glossaire-${t.id}`}>
                <div className="font-semibold text-blue-700">{t.terme}</div>
                <div className="text-sm text-gray-700">{t.definition}</div>
                {t.unite && <div className="text-xs text-gray-500">Unité : {t.unite}</div>}
                {t.exemple && <div className="text-xs text-gray-600 italic">Exemple : {t.exemple}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Glossaire; 