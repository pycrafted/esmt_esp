import React, { useState } from 'react';
import UMTSResults from './UMTSResults';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface UMTSFormValues {
  area: string;
  users: string;
  voice: string;
  data: string;
  video: string;
  load: string;
}

const initialValues: UMTSFormValues = {
  area: '',
  users: '',
  voice: '',
  data: '',
  video: '',
  load: '',
};

const pedagogicHelp = {
  area: {
    short: "Zone totale à couvrir (en km²).",
    example: "Ex : 2 km² (quartier), 50 km² (ville)",
    why: "La taille de la zone influence le nombre de cellules nécessaires."
  },
  users: {
    short: "Nombre total d'utilisateurs à desservir.",
    example: "Ex : 500 (petite zone), 10000 (grande ville)",
    why: "Permet de dimensionner la capacité du réseau."
  },
  voice: {
    short: "Débit voix par utilisateur (en kbps).",
    example: "Ex : 12.2 kbps (AMR), 8 kbps (codec bas débit)",
    why: "Le débit voix impacte la bande passante nécessaire."
  },
  data: {
    short: "Débit data par utilisateur (en kbps).",
    example: "Ex : 64 kbps (browsing), 384 kbps (3G max)",
    why: "Le débit data détermine la capacité requise pour l'accès Internet."
  },
  video: {
    short: "Débit vidéo par utilisateur (en kbps).",
    example: "Ex : 128 kbps (basse qualité), 512 kbps (bonne qualité)",
    why: "Le débit vidéo est important pour les services multimédias."
  },
  load: {
    short: "Facteur de charge du réseau (en %).",
    example: "Ex : 60% (valeur courante)",
    why: "Permet de ne pas saturer le réseau et d'assurer la qualité de service."
  }
};

const exampleValues: UMTSFormValues = {
  area: '10', // 10 km²
  users: '2000',
  voice: '12.2', // kbps (AMR)
  data: '128', // kbps
  video: '256', // kbps
  load: '60', // %
};

const scenarioPresets: { [key: string]: { values: UMTSFormValues; msg: string } } = {
  urbain: {
    values: { area: '10', users: '2000', voice: '12.2', data: '128', video: '256', load: '60' },
    msg: "Scénario urbain : 10 km², 2000 utilisateurs, débits standards. Cas typique de planification 3G en ville."
  },
  rural: {
    values: { area: '50', users: '500', voice: '8', data: '64', video: '128', load: '50' },
    msg: "Scénario rural : 50 km², 500 utilisateurs, débits plus faibles, facteur de charge réduit. Moins de cellules nécessaires, mais couverture plus difficile."
  },
  campus: {
    values: { area: '2', users: '1000', voice: '12.2', data: '384', video: '512', load: '70' },
    msg: "Scénario campus : 2 km², 1000 utilisateurs, débits élevés (data/vidéo), facteur de charge important. Forte sollicitation sur une petite zone."
  }
};

// Liste de termes pour le glossaire UMTS
const termesUMTS = [
  { id: 'nodeb', terme: 'NodeB', definition: "Station de base 3G (UMTS), équivalent du BTS en GSM.", exemple: 'Un NodeB dessert plusieurs secteurs/cellules.' },
  { id: 'cellule', terme: 'Cellule', definition: "Zone géographique couverte par une antenne ou un site radio.", unite: 'km²', exemple: 'Une cellule urbaine fait typiquement 1 km².' },
  { id: 'secteur', terme: 'Secteur', definition: "Subdivision d'une cellule, généralement couverte par une antenne orientée.", exemple: 'Un site tri-secteur couvre 3 directions.' },
  { id: 'erlang', terme: 'Erlang', definition: "Unité de trafic télécoms correspondant à une communication continue sur une heure.", unite: 'Erlang', exemple: '10 abonnés parlant 6 minutes chacun = 1 Erlang.' },
  { id: 'wcdma', terme: 'WCDMA', definition: "Wideband Code Division Multiple Access : technologie d'accès radio utilisée par l'UMTS.", exemple: 'La 3G utilise la modulation WCDMA.' },
  // Ajoute d'autres termes UMTS ici
];

const UMTSForm: React.FC<{ onSubmit?: (values: UMTSFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<UMTSFormValues>>({});
  const [showResults, setShowResults] = useState(false);
  const [showWhy, setShowWhy] = useState<{ [k: string]: boolean }>({});
  const [exampleMsg, setExampleMsg] = useState<string | null>(null);
  const [scenario, setScenario] = useState('');
  const [showGlossaire, setShowGlossaire] = useState(false);
  const [glossaireFocus, setGlossaireFocus] = useState<string | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleShowWhy = (field: string) => {
    setShowWhy((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getDynamicComment = (field: keyof UMTSFormValues) => {
    const v = values[field];
    if (!v) return pedagogicHelp[field].short + ' ' + pedagogicHelp[field].example;
    const num = Number(v);
    if (isNaN(num)) return "Veuillez entrer une valeur numérique.";
    if (field === 'area') {
      if (num < 1) return "Petite zone, peu de cellules nécessaires.";
      if (num > 100) return "Grande zone, prévoir plus de sites.";
      return "Zone typique pour une ville ou un campus.";
    }
    if (field === 'users') {
      if (num < 100) return "Peu d'utilisateurs, faible trafic.";
      if (num > 10000) return "Beaucoup d'utilisateurs, attention à la capacité.";
      return "Nombre d'utilisateurs courant.";
    }
    if (field === 'voice') {
      if (num < 8) return "Débit voix très faible, qualité dégradée.";
      if (num > 16) return "Débit voix élevé, bonne qualité mais plus de ressources nécessaires.";
      return "Débit voix standard (AMR).";
    }
    if (field === 'data') {
      if (num < 32) return "Débit data faible, usage basique.";
      if (num > 384) return "Débit data élevé, attention à la capacité.";
      return "Débit data courant pour 3G.";
    }
    if (field === 'video') {
      if (num < 64) return "Débit vidéo faible, qualité basse.";
      if (num > 512) return "Débit vidéo élevé, attention à la bande passante.";
      return "Débit vidéo typique pour mobile.";
    }
    if (field === 'load') {
      if (num < 40) return "Facteur de charge faible, réseau sous-utilisé.";
      if (num > 80) return "Facteur de charge élevé, risque de saturation.";
      return "Facteur de charge courant (60%).";
    }
    return '';
  };

  const validate = () => {
    const newErrors: Partial<UMTSFormValues> = {};
    if (!values.area || isNaN(Number(values.area))) newErrors.area = 'Zone invalide';
    if (!values.users || isNaN(Number(values.users))) newErrors.users = 'Nombre d\'utilisateurs invalide';
    if (!values.voice || isNaN(Number(values.voice))) newErrors.voice = 'Débit voix invalide';
    if (!values.data || isNaN(Number(values.data))) newErrors.data = 'Débit data invalide';
    if (!values.video || isNaN(Number(values.video))) newErrors.video = 'Débit vidéo invalide';
    if (!values.load || isNaN(Number(values.load))) newErrors.load = 'Facteur de charge invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowResults(true);
      onSubmit?.(values);
    }
  };

  const handleFillExample = (e: React.MouseEvent) => {
    e.preventDefault();
    setValues(exampleValues);
    setExampleMsg("Exemple : zone urbaine de 10 km², 2000 utilisateurs, débits standards (voix 12.2 kbps, data 128 kbps, vidéo 256 kbps, facteur de charge 60%). Permet de simuler un cas courant de planification 3G.");
    setShowResults(false);
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setScenario(val);
    if (scenarioPresets[val]) {
      setValues(scenarioPresets[val].values);
      setExampleMsg(scenarioPresets[val].msg);
      setShowResults(false);
    }
  };

  const handleOpenGlossaire = (id: string) => {
    setGlossaireFocus(id);
    setShowGlossaire(true);
  };

  return (
    <>
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={glossaireFocus} termes={termesUMTS} />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6 mt-8">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => setShowGlossaire(true)} className="flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light">
            <span role="img" aria-label="Glossaire">📖</span> Glossaire
          </button>
        </div>
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Dimensionnement UMTS</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1 group cursor-pointer">
            Scénario prédéfini
            <InfoBulle content={"Choisissez un scénario pour pré-remplir les champs avec des valeurs types."} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <select value={scenario} onChange={handleScenarioChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-primary outline-none">
            <option value="">Choisir un scénario</option>
            <option value="urbain">Zone urbaine</option>
            <option value="rural">Zone rurale</option>
            <option value="campus">Campus</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="mb-2 bg-success-light text-success-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-success transition-colors w-full focus:outline-none focus:ring-2 focus:ring-success-light flex items-center gap-2">
          <span role="img" aria-label="Exemple">✨</span> Remplir avec un exemple
        </button>
        {exampleMsg && <div className="mb-2 text-xs text-success-dark bg-success-light/40 rounded px-3 py-2">{exampleMsg}</div>}
        {/* Zone à couvrir */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Zone à couvrir (km²)
            <InfoBulle content={pedagogicHelp.area.why + ' ' + pedagogicHelp.area.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="area"
            value={values.area}
            onChange={handleChange}
            aria-invalid={!!errors.area}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.area ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 10"
          />
          {errors.area && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.area}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('area')}</div>
        </div>
        {/* Nombre d'utilisateurs */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Nombre d'utilisateurs
            <InfoBulle content={pedagogicHelp.users.why + ' ' + pedagogicHelp.users.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="users"
            value={values.users}
            onChange={handleChange}
            aria-invalid={!!errors.users}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.users ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 2000"
          />
          {errors.users && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.users}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('users')}</div>
        </div>
        {/* Débit voix */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Débit voix par utilisateur (kbps)
            <InfoBulle content={pedagogicHelp.voice.why + ' ' + pedagogicHelp.voice.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="voice"
            value={values.voice}
            onChange={handleChange}
            aria-invalid={!!errors.voice}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.voice ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 12.2"
          />
          {errors.voice && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.voice}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('voice')}</div>
        </div>
        {/* Débit data */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Débit data par utilisateur (kbps)
            <InfoBulle content={pedagogicHelp.data.why + ' ' + pedagogicHelp.data.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="data"
            value={values.data}
            onChange={handleChange}
            aria-invalid={!!errors.data}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.data ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 128"
          />
          {errors.data && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.data}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('data')}</div>
        </div>
        {/* Débit vidéo */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Débit vidéo par utilisateur (kbps)
            <InfoBulle content={pedagogicHelp.video.why + ' ' + pedagogicHelp.video.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="video"
            value={values.video}
            onChange={handleChange}
            aria-invalid={!!errors.video}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.video ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 256"
          />
          {errors.video && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.video}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('video')}</div>
        </div>
        {/* Facteur de charge */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Facteur de charge (%)
            <InfoBulle content={pedagogicHelp.load.why + ' ' + pedagogicHelp.load.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="load"
            value={values.load}
            onChange={handleChange}
            aria-invalid={!!errors.load}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.load ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 60"
          />
          {errors.load && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.load}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('load')}</div>
        </div>
        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold text-lg mt-4 hover:bg-primary-dark transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary-light flex items-center gap-2">
          <span role="img" aria-label="Calculer">🧮</span> Calculer
        </button>
        {showResults && (
          <div className="mt-8">
            <UMTSResults
              area={Number(values.area)}
              users={Number(values.users)}
              voice={Number(values.voice)}
              data={Number(values.data)}
              video={Number(values.video)}
              load={Number(values.load)}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default UMTSForm; 