import React, { useState } from 'react';
import GSMResults from './GSMResults';

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

const GSMForm: React.FC<{ onSubmit?: (values: GSMFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<GSMFormValues>>({});
  const [showResults, setShowResults] = useState(false);
  const [showWhy, setShowWhy] = useState<{ [k: string]: boolean }>({});

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

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">Paramètres GSM</h2>
      {/* Zone de couverture */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Zone de couverture (km²)
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
  );
};

export default GSMForm; 