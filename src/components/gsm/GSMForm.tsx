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
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={glossaireFocus} />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <div className="font-semibold mb-1">À quoi ça sert ?</div>
          <div className="text-sm text-gray-700">
            Le module <b>GSM</b> permet de dimensionner le nombre de sites nécessaires pour couvrir une zone donnée en fonction de la population, de la densité, du trafic et des paramètres radio.<br/>
            <b>Cas d'usage :</b> planification d'un réseau GSM, simulation de scénarios de couverture, étude d'impact d'une variation de trafic.<br/>
            <b>Lien avec la théorie :</b> ce module met en pratique les notions de dimensionnement cellulaire, de calcul de capacité et de couverture vues en cours de réseaux mobiles (voir chapitre "Dimensionnement GSM").
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Paramètres GSM</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Scénario</label>
          <select value={scenario} onChange={handleScenarioChange} className="w-full border rounded px-2 py-1 text-sm">
            <option value="">Choisir un scénario</option>
            <option value="urbain">Zone urbaine</option>
            <option value="rural">Zone rurale</option>
            <option value="industriel">Zone industrielle</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="mb-2 bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200">Remplir avec un exemple</button>
        {exampleMsg && <div className="mb-2 text-xs text-green-700">{exampleMsg}</div>}
        {/* Zone de couverture */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Zone de couverture (km²)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.area.short}<br/>
              <b>Unité :</b> km²<br/>
              <b>Exemple :</b> {pedagogicHelp.area.example}<br/>
              <b>Impact :</b> {pedagogicHelp.area.why}
            </>} glossaireId="cellule" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('area')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="area"
            value={values.area}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['area'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.area.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('area')}</div>
          {errors.area && <span className="text-red-600 text-sm">{errors.area}</span>}
        </div>
        {/* Densité de population */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Densité de population (hab/km²)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.density.short}<br/>
              <b>Unité :</b> hab/km²<br/>
              <b>Exemple :</b> {pedagogicHelp.density.example}<br/>
              <b>Impact :</b> {pedagogicHelp.density.why}
            </>} glossaireId="cellule" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('density')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="density"
            value={values.density}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['density'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.density.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('density')}</div>
          {errors.density && <span className="text-red-600 text-sm">{errors.density}</span>}
        </div>
        {/* Trafic par abonné */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Trafic par abonné (mErlang)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.trafficPerUser.short}<br/>
              <b>Unité :</b> mErlang<br/>
              <b>Exemple :</b> {pedagogicHelp.trafficPerUser.example}<br/>
              <b>Impact :</b> {pedagogicHelp.trafficPerUser.why}
            </>} glossaireId="erlang" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('trafficPerUser')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="trafficPerUser"
            value={values.trafficPerUser}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['trafficPerUser'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.trafficPerUser.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('trafficPerUser')}</div>
          {errors.trafficPerUser && <span className="text-red-600 text-sm">{errors.trafficPerUser}</span>}
        </div>
        {/* Taux de pénétration */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Taux de pénétration (%)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.penetration.short}<br/>
              <b>Unité :</b> %<br/>
              <b>Exemple :</b> {pedagogicHelp.penetration.example}<br/>
              <b>Impact :</b> {pedagogicHelp.penetration.why}
            </>} glossaireId="penetration" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('penetration')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="penetration"
            value={values.penetration}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['penetration'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.penetration.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('penetration')}</div>
          {errors.penetration && <span className="text-red-600 text-sm">{errors.penetration}</span>}
        </div>
        {/* Facteur d'activité */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Facteur d'activité
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.activity.short}<br/>
              <b>Unité :</b> (sans unité)<br/>
              <b>Exemple :</b> {pedagogicHelp.activity.example}<br/>
              <b>Impact :</b> {pedagogicHelp.activity.why}
            </>} glossaireId="activity" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('activity')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="activity"
            value={values.activity}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['activity'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.activity.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('activity')}</div>
          {errors.activity && <span className="text-red-600 text-sm">{errors.activity}</span>}
        </div>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Calculer</button>
        {showResults && (
          <GSMResults
            area={Number(values.area)}
            density={Number(values.density)}
            trafficPerUser={Number(values.trafficPerUser)}
            penetration={Number(values.penetration)}
            activity={Number(values.activity)}
          />
        )}
      </form>
    </>
  );
};

export default GSMForm; 