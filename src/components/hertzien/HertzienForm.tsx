import React, { useState } from 'react';
import HertzienResults from './HertzienResults';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface HertzienFormValues {
  frequency: string;
  distance: string;
  power: string;
  gainTx: string;
  gainRx: string;
  losses: string;
  threshold: string;
}

const initialValues: HertzienFormValues = {
  frequency: '',
  distance: '',
  power: '',
  gainTx: '',
  gainRx: '',
  losses: '',
  threshold: '',
};

const pedagogicHelp = {
  frequency: {
    short: "Fréquence du lien radio (en GHz).",
    example: "Ex : 2.4 GHz (WiFi), 7 GHz (FH)",
    why: "La fréquence influence l'affaiblissement et la portée du lien."
  },
  distance: {
    short: "Distance entre les deux points à relier (en km).",
    example: "Ex : 5 km (liaison urbaine), 30 km (liaison rurale)",
    why: "Plus la distance est grande, plus l'affaiblissement est important."
  },
  power: {
    short: "Puissance d'émission de l'émetteur (en dBm).",
    example: "Ex : 20 dBm (100 mW)",
    why: "Détermine la force du signal envoyé."
  },
  gainTx: {
    short: "Gain de l'antenne d'émission (en dBi).",
    example: "Ex : 15 dBi (antenne directive)",
    why: "Un gain élevé permet de concentrer l'énergie et d'augmenter la portée."
  },
  gainRx: {
    short: "Gain de l'antenne de réception (en dBi).",
    example: "Ex : 15 dBi (antenne directive)",
    why: "Un bon gain à la réception améliore la qualité du lien."
  },
  losses: {
    short: "Pertes diverses sur la liaison (en dB).",
    example: "Ex : 2 dB (câbles, connecteurs)",
    why: "À prendre en compte pour un bilan réaliste."
  },
  threshold: {
    short: "Seuil de réception minimal acceptable (en dBm).",
    example: "Ex : -90 dBm (récepteur standard)",
    why: "Définit la sensibilité minimale du récepteur pour un lien fiable."
  }
};

const exampleValues: HertzienFormValues = {
  frequency: '7',
  distance: '15',
  power: '20',
  gainTx: '20',
  gainRx: '20',
  losses: '2',
  threshold: '-90',
};

const scenarioPresets: { [key: string]: { values: HertzienFormValues; msg: string } } = {
  urbain: {
    values: { frequency: '13', distance: '5', power: '15', gainTx: '18', gainRx: '18', losses: '2', threshold: '-85' },
    msg: "Scénario urbain : 5 km, 13 GHz, puissance 15 dBm, gains 18 dBi, pertes 2 dB, seuil -85 dBm. Liaison courte, fréquence élevée, typique en ville."
  },
  interurbain: {
    values: { frequency: '7', distance: '15', power: '20', gainTx: '20', gainRx: '20', losses: '2', threshold: '-90' },
    msg: "Scénario interurbain : 15 km, 7 GHz, puissance 20 dBm, gains 20 dBi, pertes 2 dB, seuil -90 dBm. Cas standard de liaison FH entre deux villes."
  },
  montagne: {
    values: { frequency: '2', distance: '30', power: '25', gainTx: '25', gainRx: '25', losses: '3', threshold: '-95' },
    msg: "Scénario montagne : 30 km, 2 GHz, puissance 25 dBm, gains 25 dBi, pertes 3 dB, seuil -95 dBm. Longue distance, basse fréquence, conditions difficiles."
  }
};

// Liste de termes pour le glossaire Hertzien
const termesFH = [
  { id: 'fh', terme: 'FH', definition: "Faisceau Hertzien : liaison radio point à point utilisée pour relier deux sites distants.", exemple: 'Un FH relie deux BTS sur 15 km.' },
  { id: 'dBm', terme: 'dBm', definition: "Décibel-milliwatt : unité de puissance exprimée en décibels par rapport à 1 mW.", unite: 'dBm', exemple: '20 dBm = 100 mW.' },
  { id: 'dBi', terme: 'dBi', definition: "Décibel-isotrope : unité de gain d'antenne par rapport à une antenne isotrope.", unite: 'dBi', exemple: 'Une antenne directive peut avoir 20 dBi de gain.' },
  { id: 'gain', terme: 'Gain', definition: "Augmentation de la puissance d'un signal par un dispositif (ex : antenne).", unite: 'dBi', exemple: 'Un gain de 15 dBi double la portée par rapport à 12 dBi.' },
  { id: 'seuil', terme: 'Seuil', definition: "Sensibilité minimale d'un récepteur pour détecter un signal.", unite: 'dBm', exemple: 'Un seuil de -90 dBm est courant pour un récepteur FH.' },
  { id: 'modulation', terme: 'Modulation', definition: "Technique permettant de transporter un signal sur une porteuse (ex : QAM, FSK, OFDM).", exemple: 'La 3G utilise la modulation WCDMA.' },
  // Ajoute d'autres termes FH ici
];

const HertzienForm: React.FC<{ onSubmit?: (values: HertzienFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<HertzienFormValues>>({});
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

  const getDynamicComment = (field: keyof HertzienFormValues) => {
    const v = values[field];
    if (!v) return pedagogicHelp[field].short + ' ' + pedagogicHelp[field].example;
    const num = Number(v);
    if (isNaN(num)) return "Veuillez entrer une valeur numérique.";
    if (field === 'frequency') {
      if (num < 2) return "Fréquence basse, portée plus grande mais risque d'interférences.";
      if (num > 15) return "Fréquence très élevée, portée plus faible.";
      return "Fréquence courante pour FH.";
    }
    if (field === 'distance') {
      if (num < 2) return "Liaison courte (urbaine, campus).";
      if (num > 30) return "Liaison longue, attention à l'affaiblissement.";
      return "Distance typique pour FH.";
    }
    if (field === 'power') {
      if (num < 10) return "Puissance faible, portée limitée.";
      if (num > 30) return "Puissance élevée, attention à la réglementation.";
      return "Puissance courante pour FH.";
    }
    if (field === 'gainTx' || field === 'gainRx') {
      if (num < 10) return "Gain faible, portée réduite.";
      if (num > 25) return "Gain très élevé, antenne très directive.";
      return "Gain typique pour antenne FH.";
    }
    if (field === 'losses') {
      if (num < 1) return "Pertes faibles, installation soignée.";
      if (num > 5) return "Pertes élevées, attention à la qualité des câbles.";
      return "Pertes courantes.";
    }
    if (field === 'threshold') {
      if (num < -100) return "Récepteur très sensible.";
      if (num > -70) return "Récepteur peu sensible, attention à la fiabilité.";
      return "Seuil courant pour FH.";
    }
    return '';
  };

  const validate = () => {
    const newErrors: Partial<HertzienFormValues> = {};
    if (!values.frequency || isNaN(Number(values.frequency))) newErrors.frequency = 'Fréquence invalide';
    if (!values.distance || isNaN(Number(values.distance))) newErrors.distance = 'Distance invalide';
    if (!values.power || isNaN(Number(values.power))) newErrors.power = 'Puissance invalide';
    if (!values.gainTx || isNaN(Number(values.gainTx))) newErrors.gainTx = 'Gain émission invalide';
    if (!values.gainRx || isNaN(Number(values.gainRx))) newErrors.gainRx = 'Gain réception invalide';
    if (!values.losses || isNaN(Number(values.losses))) newErrors.losses = 'Pertes invalides';
    if (!values.threshold || isNaN(Number(values.threshold))) newErrors.threshold = 'Seuil invalide';
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
    setExampleMsg("Exemple : FH 7 GHz, 15 km, puissance 20 dBm, gains antennes 20 dBi, pertes 2 dB, seuil -90 dBm. Cas typique de liaison hertzienne interurbaine.");
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
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={glossaireFocus} termes={termesFH} />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6 mt-8">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => setShowGlossaire(true)} className="flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light">
            <span role="img" aria-label="Glossaire">📖</span> Glossaire
          </button>
        </div>
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Bilan de Liaison Hertzien</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1 group cursor-pointer">
            Scénario prédéfini
            <InfoBulle content={"Choisissez un scénario pour pré-remplir les champs avec des valeurs types."} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <select value={scenario} onChange={handleScenarioChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-primary outline-none">
            <option value="">Choisir un scénario</option>
            <option value="urbain">Urbain</option>
            <option value="interurbain">Interurbain</option>
            <option value="montagne">Montagne</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="mb-2 bg-success-light text-success-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-success transition-colors w-full focus:outline-none focus:ring-2 focus:ring-success-light flex items-center gap-2">
          <span role="img" aria-label="Exemple">✨</span> Remplir avec un exemple
        </button>
        {exampleMsg && <div className="mb-2 text-xs text-success-dark bg-success-light/40 rounded px-3 py-2">{exampleMsg}</div>}
        {/* Fréquence */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Fréquence (GHz)
            <InfoBulle content={pedagogicHelp.frequency.why + ' ' + pedagogicHelp.frequency.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="frequency"
            value={values.frequency}
            onChange={handleChange}
            aria-invalid={!!errors.frequency}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.frequency ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 7"
          />
          {errors.frequency && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.frequency}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('frequency')}</div>
        </div>
        {/* Distance */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Distance (km)
            <InfoBulle content={pedagogicHelp.distance.why + ' ' + pedagogicHelp.distance.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="distance"
            value={values.distance}
            onChange={handleChange}
            aria-invalid={!!errors.distance}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.distance ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 15"
          />
          {errors.distance && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.distance}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('distance')}</div>
        </div>
        {/* Puissance émission */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Puissance émission (dBm)
            <InfoBulle content={pedagogicHelp.power.why + ' ' + pedagogicHelp.power.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="power"
            value={values.power}
            onChange={handleChange}
            aria-invalid={!!errors.power}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.power ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 20"
          />
          {errors.power && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.power}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('power')}</div>
        </div>
        {/* Gain émission */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Gain émission (dBi)
            <InfoBulle content={pedagogicHelp.gainTx.why + ' ' + pedagogicHelp.gainTx.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="gainTx"
            value={values.gainTx}
            onChange={handleChange}
            aria-invalid={!!errors.gainTx}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.gainTx ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 20"
          />
          {errors.gainTx && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.gainTx}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('gainTx')}</div>
        </div>
        {/* Gain réception */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Gain réception (dBi)
            <InfoBulle content={pedagogicHelp.gainRx.why + ' ' + pedagogicHelp.gainRx.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="gainRx"
            value={values.gainRx}
            onChange={handleChange}
            aria-invalid={!!errors.gainRx}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.gainRx ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 20"
          />
          {errors.gainRx && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.gainRx}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('gainRx')}</div>
        </div>
        {/* Pertes diverses */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Pertes diverses (dB)
            <InfoBulle content={pedagogicHelp.losses.why + ' ' + pedagogicHelp.losses.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="losses"
            value={values.losses}
            onChange={handleChange}
            aria-invalid={!!errors.losses}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.losses ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 2"
          />
          {errors.losses && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.losses}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('losses')}</div>
        </div>
        {/* Seuil de réception */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Seuil de réception (dBm)
            <InfoBulle content={pedagogicHelp.threshold.why + ' ' + pedagogicHelp.threshold.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="threshold"
            value={values.threshold}
            onChange={handleChange}
            aria-invalid={!!errors.threshold}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.threshold ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : -90"
          />
          {errors.threshold && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.threshold}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('threshold')}</div>
        </div>
        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold text-lg mt-4 hover:bg-primary-dark transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary-light flex items-center gap-2">
          <span role="img" aria-label="Calculer">🧮</span> Calculer
        </button>
        {showResults && (
          <div className="mt-8">
            <HertzienResults
              frequency={Number(values.frequency)}
              distance={Number(values.distance)}
              power={Number(values.power)}
              gainTx={Number(values.gainTx)}
              gainRx={Number(values.gainRx)}
              losses={Number(values.losses)}
              threshold={Number(values.threshold)}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default HertzienForm; 