import React, { useState } from 'react';
import OptiqueResults from './OptiqueResults';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface OptiqueFormValues {
  length: string;
  attenuation: string;
  splices: string;
  connectors: string;
  losses: string;
  power: string;
}

const initialValues: OptiqueFormValues = {
  length: '',
  attenuation: '',
  splices: '',
  connectors: '',
  losses: '',
  power: '',
};

const pedagogicHelp = {
  length: {
    short: "Longueur totale de la liaison optique (en km).",
    example: "Ex : 10 km (liaison urbaine), 50 km (liaison interurbaine)",
    why: "Plus la liaison est longue, plus les pertes sont importantes."
  },
  attenuation: {
    short: "Atténuation de la fibre (en dB/km).",
    example: "Ex : 0.35 dB/km (fibre standard)",
    why: "Permet de calculer les pertes sur la distance totale."
  },
  splices: {
    short: "Nombre d'épissures (soudure entre fibres).",
    example: "Ex : 5 (liaison simple), 20 (longue liaison)",
    why: "Chaque épissure ajoute une petite perte (0.1 dB typique)."
  },
  connectors: {
    short: "Nombre de connecteurs optiques sur la liaison.",
    example: "Ex : 2 (liaison simple), 4 (liaison complexe)",
    why: "Chaque connecteur ajoute une perte (0.5 dB typique)."
  },
  losses: {
    short: "Pertes diverses (en dB) : boîtiers, tiroirs, etc.",
    example: "Ex : 1 dB (installation soignée)",
    why: "À prendre en compte pour un bilan réaliste."
  },
  power: {
    short: "Puissance d'émission de l'émetteur optique (en dBm).",
    example: "Ex : 0 dBm (standard), 5 dBm (amplifié)",
    why: "Détermine la réserve de puissance disponible pour compenser les pertes."
  }
};

const exampleValues: OptiqueFormValues = {
  length: '20',
  attenuation: '0.35',
  splices: '8',
  connectors: '2',
  losses: '1',
  power: '0',
};

const scenarioPresets: { [key: string]: { values: OptiqueFormValues; msg: string } } = {
  urbaine: {
    values: { length: '10', attenuation: '0.35', splices: '4', connectors: '2', losses: '1', power: '0' },
    msg: "Scénario urbain : 10 km, atténuation 0.35 dB/km, 4 épissures, 2 connecteurs, pertes 1 dB, puissance 0 dBm. Cas typique de fibre en ville."
  },
  longue: {
    values: { length: '50', attenuation: '0.4', splices: '20', connectors: '4', losses: '2', power: '5' },
    msg: "Scénario longue distance : 50 km, atténuation 0.4 dB/km, 20 épissures, 4 connecteurs, pertes 2 dB, puissance 5 dBm. Cas de liaison interurbaine ou dorsale."
  },
  campus: {
    values: { length: '2', attenuation: '0.3', splices: '2', connectors: '2', losses: '0.5', power: '0' },
    msg: "Scénario campus : 2 km, atténuation 0.3 dB/km, 2 épissures, 2 connecteurs, pertes 0.5 dB, puissance 0 dBm. Liaison courte et performante."
  }
};

// Liste de termes pour le glossaire Optique
const termesOptique = [
  { id: 'fibre', terme: 'Fibre optique', definition: "Support de transmission utilisant la lumière pour transporter l'information à très haut débit.", exemple: 'Une fibre optique relie deux centraux sur 50 km.' },
  { id: 'attenuation', terme: 'Atténuation', definition: "Perte de puissance d'un signal lors de sa transmission.", unite: 'dB', exemple: "Une fibre de 10 km à 0.35 dB/km a 3.5 dB d'atténuation." },
  { id: 'bande', terme: 'Bande passante', definition: "Intervalle de fréquences qu'un système peut transmettre sans atténuation excessive.", unite: 'Hz', exemple: "La bande passante d'une fibre peut dépasser 10 GHz." },
  { id: 'connecteur', terme: 'Connecteur', definition: "Dispositif permettant de raccorder deux fibres optiques.", exemple: 'Un connecteur SC ou LC.' },
  { id: 'epissure', terme: 'Épissure', definition: "Jonction permanente entre deux fibres optiques.", exemple: 'Une épissure par fusion.' },
  // Ajoute d'autres termes Optique ici
];

const OptiqueForm: React.FC<{ onSubmit?: (values: OptiqueFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<OptiqueFormValues>>({});
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

  const getDynamicComment = (field: keyof OptiqueFormValues) => {
    const v = values[field];
    if (!v) return pedagogicHelp[field].short + ' ' + pedagogicHelp[field].example;
    const num = Number(v);
    if (isNaN(num)) return "Veuillez entrer une valeur numérique.";
    if (field === 'length') {
      if (num < 5) return "Liaison courte (réseau local, campus).";
      if (num > 50) return "Liaison très longue, attention au budget optique.";
      return "Longueur typique pour liaison urbaine.";
    }
    if (field === 'attenuation') {
      if (num < 0.2) return "Fibre très performante.";
      if (num > 0.5) return "Atténuation élevée, attention à la qualité de la fibre.";
      return "Atténuation standard.";
    }
    if (field === 'splices') {
      if (num < 3) return "Peu d'épissures, pertes minimales.";
      if (num > 15) return "Beaucoup d'épissures, attention aux pertes cumulées.";
      return "Nombre d'épissures courant.";
    }
    if (field === 'connectors') {
      if (num < 2) return "Peu de connecteurs, pertes faibles.";
      if (num > 6) return "Beaucoup de connecteurs, attention aux pertes.";
      return "Nombre de connecteurs typique.";
    }
    if (field === 'losses') {
      if (num < 0.5) return "Pertes diverses très faibles.";
      if (num > 2) return "Pertes diverses élevées, vérifier l'installation.";
      return "Pertes diverses courantes.";
    }
    if (field === 'power') {
      if (num < -5) return "Puissance très faible, attention au budget optique.";
      if (num > 5) return "Puissance élevée, attention à la saturation du récepteur.";
      return "Puissance d'émission standard.";
    }
    return '';
  };

  const validate = () => {
    const newErrors: Partial<OptiqueFormValues> = {};
    if (!values.length || isNaN(Number(values.length))) newErrors.length = 'Longueur invalide';
    if (!values.attenuation || isNaN(Number(values.attenuation))) newErrors.attenuation = 'Atténuation invalide';
    if (!values.splices || isNaN(Number(values.splices))) newErrors.splices = 'Nombre d\'épissures invalide';
    if (!values.connectors || isNaN(Number(values.connectors))) newErrors.connectors = 'Nombre de connecteurs invalide';
    if (!values.losses || isNaN(Number(values.losses))) newErrors.losses = 'Pertes invalides';
    if (!values.power || isNaN(Number(values.power))) newErrors.power = 'Puissance invalide';
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
    setExampleMsg("Exemple : fibre de 20 km, atténuation 0.35 dB/km, 8 épissures, 2 connecteurs, pertes diverses 1 dB, puissance émetteur 0 dBm. Cas standard de liaison optique urbaine.");
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
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={glossaireFocus} termes={termesOptique} />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6 mt-8">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => setShowGlossaire(true)} className="flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light">
            <span role="img" aria-label="Glossaire">📖</span> Glossaire
          </button>
        </div>
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Bilan Optique</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1 group cursor-pointer">
            Scénario prédéfini
            <InfoBulle content={"Choisissez un scénario pour pré-remplir les champs avec des valeurs types."} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <select value={scenario} onChange={handleScenarioChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-primary outline-none">
            <option value="">Choisir un scénario</option>
            <option value="urbaine">Fibre urbaine</option>
            <option value="longue">Longue distance</option>
            <option value="campus">Campus</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="mb-2 bg-success-light text-success-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-success transition-colors w-full focus:outline-none focus:ring-2 focus:ring-success-light flex items-center gap-2">
          <span role="img" aria-label="Exemple">✨</span> Remplir avec un exemple
        </button>
        {exampleMsg && <div className="mb-2 text-xs text-success-dark bg-success-light/40 rounded px-3 py-2">{exampleMsg}</div>}
        {/* Longueur de la liaison */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Longueur de la liaison (km)
            <InfoBulle content={pedagogicHelp.length.why + ' ' + pedagogicHelp.length.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="length"
            value={values.length}
            onChange={handleChange}
            aria-invalid={!!errors.length}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.length ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 20"
          />
          {errors.length && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.length}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('length')}</div>
        </div>
        {/* Atténuation fibre */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Atténuation fibre (dB/km)
            <InfoBulle content={pedagogicHelp.attenuation.why + ' ' + pedagogicHelp.attenuation.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="attenuation"
            value={values.attenuation}
            onChange={handleChange}
            aria-invalid={!!errors.attenuation}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.attenuation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 0.35"
          />
          {errors.attenuation && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.attenuation}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('attenuation')}</div>
        </div>
        {/* Nombre d'épissures */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Nombre d'épissures
            <InfoBulle content={pedagogicHelp.splices.why + ' ' + pedagogicHelp.splices.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="splices"
            value={values.splices}
            onChange={handleChange}
            aria-invalid={!!errors.splices}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.splices ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 8"
          />
          {errors.splices && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.splices}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('splices')}</div>
        </div>
        {/* Nombre de connecteurs */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Nombre de connecteurs
            <InfoBulle content={pedagogicHelp.connectors.why + ' ' + pedagogicHelp.connectors.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="connectors"
            value={values.connectors}
            onChange={handleChange}
            aria-invalid={!!errors.connectors}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.connectors ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 2"
          />
          {errors.connectors && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.connectors}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('connectors')}</div>
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
            placeholder="Ex : 1"
          />
          {errors.losses && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.losses}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('losses')}</div>
        </div>
        {/* Puissance émetteur */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
            Puissance émetteur (dBm)
            <InfoBulle content={pedagogicHelp.power.why + ' ' + pedagogicHelp.power.example} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <input
            type="number"
            name="power"
            value={values.power}
            onChange={handleChange}
            aria-invalid={!!errors.power}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.power ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            placeholder="Ex : 0"
          />
          {errors.power && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.power}</span>}
          <div className="text-xs text-gray-500">{getDynamicComment('power')}</div>
        </div>
        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold text-lg mt-4 hover:bg-primary-dark transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary-light flex items-center gap-2">
          <span role="img" aria-label="Calculer">🧮</span> Calculer
        </button>
        {showResults && (
          <div className="mt-8">
            <OptiqueResults
              length={Number(values.length)}
              attenuation={Number(values.attenuation)}
              splices={Number(values.splices)}
              connectors={Number(values.connectors)}
              losses={Number(values.losses)}
              power={Number(values.power)}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default OptiqueForm; 