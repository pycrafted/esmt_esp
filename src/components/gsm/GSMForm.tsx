import React, { useState } from 'react';
import GSMResults from './GSMResults';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface GSMFormValues {
  area: string;
  density: string;
  trafficPerUser: string;
  penetration: string;
  activity: string;
}

const initialValues: GSMFormValues = {
  area: '',
  density: '',
  trafficPerUser: '',
  penetration: '',
  activity: '',
};

const pedagogicHelp = {
  area: {
    short: "Superficie à couvrir. Plus elle est grande, plus il faudra de sites.",
    example: "Ex : 10 km² (petite ville), 100 km² (zone rurale)",
    why: "Permet de calculer la couverture nécessaire et le nombre de sites."
  },
  density: {
    short: "Nombre moyen d'habitants par km².",
    example: "Ex : 5000 (urbain), 100 (rural)",
    why: "Permet d'estimer le nombre total d'abonnés à desservir."
  },
  trafficPerUser: {
    short: "Trafic moyen généré par un abonné (en mErlang).",
    example: "Ex : 30 mErlang (usage modéré)",
    why: "Permet de dimensionner la capacité nécessaire."
  },
  penetration: {
    short: "Pourcentage de la population qui utilise le service.",
    example: "Ex : 80% (zone urbaine)",
    why: "Permet d'affiner le calcul du nombre d'abonnés réels."
  },
  activity: {
    short: "Facteur d'activité moyen des abonnés.",
    example: "Ex : 0.1 (10% du temps en communication)",
    why: "Affiner le calcul du trafic total."
  }
};

const exampleValues: GSMFormValues = {
  area: '10', // 10 km²
  density: '5000', // urbain
  trafficPerUser: '30', // mErlang
  penetration: '80', // %
  activity: '0.1', // 10%
};

const scenarioPresets: { [key: string]: { values: GSMFormValues; msg: string } } = {
  urbain: {
    values: { area: '10', density: '5000', trafficPerUser: '30', penetration: '80', activity: '0.1' },
    msg: "Scénario urbain : zone de 10 km², densité 5000 hab/km², trafic moyen, taux de pénétration élevé. Nécessite de nombreux sites pour couvrir la forte densité."
  },
  rural: {
    values: { area: '100', density: '100', trafficPerUser: '20', penetration: '60', activity: '0.08' },
    msg: "Scénario rural : grande zone (100 km²), faible densité (100 hab/km²), trafic modéré, taux de pénétration 60%. Moins de sites nécessaires, mais couverture plus difficile."
  },
  industriel: {
    values: { area: '5', density: '1000', trafficPerUser: '50', penetration: '90', activity: '0.15' },
    msg: "Scénario industriel : zone de 5 km², densité 1000 hab/km², trafic élevé (50 mErlang), taux de pénétration 90%, activité 15%. Forte sollicitation du réseau sur une petite zone."
  }
};

// Liste de termes pour le glossaire GSM
const termesGSM = [
  { id: 'trx', terme: 'TRX', definition: "Transceiver : unité radio permettant de gérer un certain nombre de communications simultanées.", unite: 'Erlangs', exemple: 'Un TRX GSM gère typiquement 2 Erlangs.' },
  { id: 'bts', terme: 'BTS', definition: "Base Transceiver Station : station de base GSM.", exemple: 'Un site BTS couvre une zone de quelques km².' },
  { id: 'cellule', terme: 'Cellule', definition: "Zone géographique couverte par une antenne ou un site radio.", unite: 'km²', exemple: 'Une cellule urbaine fait typiquement 1 km².' },
  { id: 'secteur', terme: 'Secteur', definition: "Subdivision d'une cellule, généralement couverte par une antenne orientée.", exemple: 'Un site tri-secteur couvre 3 directions.' },
  { id: 'erlang', terme: 'Erlang', definition: "Unité de trafic télécoms correspondant à une communication continue sur une heure.", unite: 'Erlang', exemple: '10 abonnés parlant 6 minutes chacun = 1 Erlang.' },
  { id: 'penet', terme: 'Taux de pénétration', definition: "Pourcentage d'utilisateurs équipés d'un service ou d'une technologie.", unite: '%', exemple: '80% de pénétration mobile en France.' },
  // Ajoute d'autres termes GSM ici
];

const GSMForm: React.FC<{ onSubmit?: (values: GSMFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<GSMFormValues>>({});
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

  const getDynamicComment = (field: keyof GSMFormValues) => {
    const v = values[field];
    if (!v) return pedagogicHelp[field].short + ' ' + pedagogicHelp[field].example;
    const num = Number(v);
    if (isNaN(num)) return "Veuillez entrer une valeur numérique.";
    // Exemples de feedback pédagogique
    if (field === 'density') {
      if (num < 200) return "Faible densité (zone rurale).";
      if (num > 3000) return "Densité élevée (zone urbaine).";
      return "Densité typique.";
    }
    if (field === 'area') {
      if (num < 5) return "Petite zone (village, campus).";
      if (num > 100) return "Grande zone (agglomération ou région).";
      return "Zone de taille moyenne.";
    }
    if (field === 'penetration') {
      if (num < 40) return "Taux de pénétration faible (zone peu équipée).";
      if (num > 90) return "Taux de pénétration très élevé.";
      return "Taux de pénétration courant.";
    }
    if (field === 'trafficPerUser') {
      if (num < 10) return "Trafic faible par abonné.";
      if (num > 50) return "Trafic élevé, prévoir plus de capacité.";
      return "Trafic moyen par abonné.";
    }
    if (field === 'activity') {
      if (num < 0.05) return "Activité très faible.";
      if (num > 0.2) return "Activité très élevée, attention à la congestion.";
      return "Activité typique.";
    }
    return '';
  };

  const validate = () => {
    const newErrors: Partial<GSMFormValues> = {};
    if (!values.area || isNaN(Number(values.area))) newErrors.area = 'Zone invalide';
    if (!values.density || isNaN(Number(values.density))) newErrors.density = 'Densité invalide';
    if (!values.trafficPerUser || isNaN(Number(values.trafficPerUser))) newErrors.trafficPerUser = 'Trafic invalide';
    if (!values.penetration || isNaN(Number(values.penetration))) newErrors.penetration = 'Pénétration invalide';
    if (!values.activity || isNaN(Number(values.activity))) newErrors.activity = 'Activité invalide';
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
    setExampleMsg("Exemple : zone urbaine de 10 km², densité 5000 hab/km², trafic moyen 30 mErlang/abonné, taux de pénétration 80%, activité 10%. Cas typique de planification GSM en ville.");
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
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={glossaireFocus} termes={termesGSM} />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6 mt-8">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => setShowGlossaire(true)} className="flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light">
            <span role="img" aria-label="Glossaire">📖</span> Glossaire
          </button>
        </div>
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Dimensionnement GSM</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1 group cursor-pointer">
            Scénario prédéfini
            <InfoBulle content={"Choisissez un scénario pour pré-remplir les champs avec des valeurs types."} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <select value={scenario} onChange={handleScenarioChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-primary outline-none">
            <option value="">Choisir un scénario</option>
            <option value="urbain">Zone urbaine</option>
            <option value="rural">Zone rurale</option>
            <option value="industriel">Zone industrielle</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="mb-2 bg-success-light text-success-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-success transition-colors w-full focus:outline-none focus:ring-2 focus:ring-success-light flex items-center gap-2">
          <span role="img" aria-label="Exemple">✨</span> Remplir avec un exemple
        </button>
        {exampleMsg && <div className="mb-2 text-xs text-success-dark bg-success-light/40 rounded px-3 py-2">{exampleMsg}</div>}
        {/* Zone de couverture */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Zone de couverture (km²)
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
        {/* Densité de population */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Densité de population (hab/km²)
            <InfoBulle content={pedagogicHelp.density.why + ' ' + pedagogicHelp.density.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="density"
            value={values.density}
            onChange={handleChange}
            aria-invalid={!!errors.density}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.density ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 5000"
          />
          {errors.density && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.density}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('density')}</div>
        </div>
        {/* Trafic par abonné */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Trafic par abonné (mErlang)
            <InfoBulle content={pedagogicHelp.trafficPerUser.why + ' ' + pedagogicHelp.trafficPerUser.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="trafficPerUser"
            value={values.trafficPerUser}
            onChange={handleChange}
            aria-invalid={!!errors.trafficPerUser}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.trafficPerUser ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 30"
          />
          {errors.trafficPerUser && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.trafficPerUser}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('trafficPerUser')}</div>
        </div>
        {/* Taux de pénétration */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Taux de pénétration (%)
            <InfoBulle content={pedagogicHelp.penetration.why + ' ' + pedagogicHelp.penetration.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="penetration"
            value={values.penetration}
            onChange={handleChange}
            aria-invalid={!!errors.penetration}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.penetration ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 80"
          />
          {errors.penetration && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.penetration}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('penetration')}</div>
        </div>
        {/* Facteur d'activité */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Facteur d'activité
            <InfoBulle content={pedagogicHelp.activity.why + ' ' + pedagogicHelp.activity.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="activity"
            value={values.activity}
            onChange={handleChange}
            aria-invalid={!!errors.activity}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.activity ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 0.1"
          />
          {errors.activity && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.activity}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('activity')}</div>
        </div>
        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold text-lg mt-4 hover:bg-primary-dark transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary-light flex items-center gap-2">
          <span role="img" aria-label="Calculer">🧮</span> Calculer
        </button>
        {showResults && (
          <div className="mt-8">
            <GSMResults
              area={Number(values.area)}
              density={Number(values.density)}
              trafficPerUser={Number(values.trafficPerUser)}
              penetration={Number(values.penetration)}
              activity={Number(values.activity)}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default GSMForm; 