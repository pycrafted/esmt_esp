import React, { useState } from 'react';
import OptiqueResults from './OptiqueResults';
import InfoBulle from '../common/InfoBulle';

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

const OptiqueForm: React.FC<{ onSubmit?: (values: OptiqueFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<OptiqueFormValues>>({});
  const [showResults, setShowResults] = useState(false);
  const [showWhy, setShowWhy] = useState<{ [k: string]: boolean }>({});

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

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
        <div className="font-semibold mb-1">À quoi ça sert ?</div>
        <div className="text-sm text-gray-700">
          Le module <b>Optique</b> permet de calculer le budget de puissance d'une liaison fibre optique : estimation des pertes, vérification de la faisabilité et optimisation des paramètres d'installation.<br/>
          <b>Cas d'usage :</b> conception d'une liaison optique, validation d'un budget de puissance, étude d'impact d'une modification de la longueur ou des composants.<br/>
          <b>Lien avec la théorie :</b> ce module met en pratique les notions d'atténuation, de pertes et de budget optique vues en cours de transmission optique (voir chapitre "Budget de puissance optique").
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Paramètres Bilan Optique</h2>
      {/* Longueur de la liaison */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Longueur de la liaison (km)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.length.short}<br/>
            <b>Unité :</b> km<br/>
            <b>Exemple :</b> {pedagogicHelp.length.example}<br/>
            <b>Impact :</b> {pedagogicHelp.length.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('length')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="length"
          value={values.length}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['length'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.length.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('length')}</div>
        {errors.length && <span className="text-red-600 text-sm">{errors.length}</span>}
      </div>
      {/* Atténuation fibre */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Atténuation fibre (dB/km)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.attenuation.short}<br/>
            <b>Unité :</b> dB/km<br/>
            <b>Exemple :</b> {pedagogicHelp.attenuation.example}<br/>
            <b>Impact :</b> {pedagogicHelp.attenuation.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('attenuation')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="attenuation"
          value={values.attenuation}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['attenuation'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.attenuation.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('attenuation')}</div>
        {errors.attenuation && <span className="text-red-600 text-sm">{errors.attenuation}</span>}
      </div>
      {/* Nombre d'épissures */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Nombre d'épissures
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.splices.short}<br/>
            <b>Unité :</b> nombre<br/>
            <b>Exemple :</b> {pedagogicHelp.splices.example}<br/>
            <b>Impact :</b> {pedagogicHelp.splices.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('splices')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="splices"
          value={values.splices}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['splices'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.splices.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('splices')}</div>
        {errors.splices && <span className="text-red-600 text-sm">{errors.splices}</span>}
      </div>
      {/* Nombre de connecteurs */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Nombre de connecteurs
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.connectors.short}<br/>
            <b>Unité :</b> nombre<br/>
            <b>Exemple :</b> {pedagogicHelp.connectors.example}<br/>
            <b>Impact :</b> {pedagogicHelp.connectors.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('connectors')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="connectors"
          value={values.connectors}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['connectors'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.connectors.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('connectors')}</div>
        {errors.connectors && <span className="text-red-600 text-sm">{errors.connectors}</span>}
      </div>
      {/* Pertes diverses */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Pertes diverses (dB)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.losses.short}<br/>
            <b>Unité :</b> dB<br/>
            <b>Exemple :</b> {pedagogicHelp.losses.example}<br/>
            <b>Impact :</b> {pedagogicHelp.losses.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('losses')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="losses"
          value={values.losses}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['losses'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.losses.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('losses')}</div>
        {errors.losses && <span className="text-red-600 text-sm">{errors.losses}</span>}
      </div>
      {/* Puissance émetteur */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Puissance émetteur (dBm)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.power.short}<br/>
            <b>Unité :</b> dBm<br/>
            <b>Exemple :</b> {pedagogicHelp.power.example}<br/>
            <b>Impact :</b> {pedagogicHelp.power.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('power')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="power"
          value={values.power}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['power'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.power.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('power')}</div>
        {errors.power && <span className="text-red-600 text-sm">{errors.power}</span>}
      </div>
      <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Calculer</button>
      {showResults && (
        <OptiqueResults
          length={Number(values.length)}
          attenuation={Number(values.attenuation)}
          splices={Number(values.splices)}
          connectors={Number(values.connectors)}
          losses={Number(values.losses)}
          power={Number(values.power)}
        />
      )}
    </form>
  );
};

export default OptiqueForm; 