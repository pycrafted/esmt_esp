import React from 'react';

interface GlossaireProps {
  open: boolean;
  onClose: () => void;
  focusId?: string;
}

const termes = [
  {
    id: 'trx',
    terme: 'TRX',
    definition: "Transceiver : unité radio permettant de gérer un certain nombre de communications simultanées.",
    unite: 'Erlangs',
    exemple: 'Un TRX GSM gère typiquement 2 Erlangs.'
  },
  {
    id: 'nodeb',
    terme: 'NodeB',
    definition: "Station de base 3G (UMTS), équivalent du BTS en GSM.",
    unite: '',
    exemple: 'Un NodeB dessert plusieurs secteurs/cellules.'
  },
  {
    id: 'bts',
    terme: 'BTS',
    definition: "Base Transceiver Station : station de base GSM.",
    unite: '',
    exemple: 'Un site BTS couvre une zone de quelques km².'
  },
  {
    id: 'cellule',
    terme: 'Cellule',
    definition: "Zone géographique couverte par une antenne ou un site radio.",
    unite: 'km²',
    exemple: 'Une cellule urbaine fait typiquement 1 km².'
  },
  {
    id: 'secteur',
    terme: 'Secteur',
    definition: "Subdivision d'une cellule, généralement couverte par une antenne orientée.",
    unite: '',
    exemple: 'Un site tri-secteur couvre 3 directions.'
  },
  {
    id: 'fh',
    terme: 'FH',
    definition: "Faisceau Hertzien : liaison radio point à point utilisée pour relier deux sites distants.",
    unite: '',
    exemple: 'Un FH relie deux BTS sur 15 km.'
  },
  {
    id: 'fibre',
    terme: 'Fibre optique',
    definition: "Support de transmission utilisant la lumière pour transporter l'information à très haut débit.",
    unite: '',
    exemple: 'Une fibre optique relie deux centraux sur 50 km.'
  },
  {
    id: 'dBm',
    terme: 'dBm',
    definition: "Décibel-milliwatt : unité de puissance exprimée en décibels par rapport à 1 mW.",
    unite: 'dBm',
    exemple: '20 dBm = 100 mW.'
  },
  {
    id: 'dBi',
    terme: 'dBi',
    definition: "Décibel-isotrope : unité de gain d'antenne par rapport à une antenne isotrope.",
    unite: 'dBi',
    exemple: 'Une antenne directive peut avoir 20 dBi de gain.'
  },
  {
    id: 'erlang',
    terme: 'Erlang',
    definition: "Unité de trafic télécoms correspondant à une communication continue sur une heure.",
    unite: 'Erlang',
    exemple: '10 abonnés parlant 6 minutes chacun = 1 Erlang.'
  },
  {
    id: 'attenuation',
    terme: 'Atténuation',
    definition: "Perte de puissance d'un signal lors de sa transmission.",
    unite: 'dB',
    exemple: 'Une fibre de 10 km à 0.35 dB/km a 3.5 dB d\'atténuation.'
  },
  {
    id: 'gain',
    terme: 'Gain',
    definition: "Augmentation de la puissance d\'un signal par un dispositif (ex : antenne).",
    unite: 'dBi',
    exemple: 'Un gain de 15 dBi double la portée par rapport à 12 dBi.'
  },
  {
    id: 'seuil',
    terme: 'Seuil',
    definition: "Sensibilité minimale d\'un récepteur pour détecter un signal.",
    unite: 'dBm',
    exemple: 'Un seuil de -90 dBm est courant pour un récepteur FH.'
  },
  {
    id: 'bande',
    terme: 'Bande passante',
    definition: "Intervalle de fréquences qu'un système peut transmettre sans atténuation excessive.",
    unite: 'Hz',
    exemple: 'La bande passante d\'une fibre peut dépasser 10 GHz.'
  },
  {
    id: 'modulation',
    terme: 'Modulation',
    definition: "Technique permettant de transporter un signal sur une porteuse (ex : QAM, FSK, OFDM).",
    unite: '',
    exemple: 'La 3G utilise la modulation WCDMA.'
  },
  // Ajoutez d'autres termes selon besoin
];

const Glossaire: React.FC<GlossaireProps> = ({ open, onClose, focusId }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl">×</button>
        <h2 className="text-xl font-bold mb-4">Glossaire Télécoms</h2>
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
      </div>
    </div>
  );
};

export default Glossaire; 