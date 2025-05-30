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
  frequency: '7', // GHz
  distance: '15', // km
  power: '20', // dBm
  gainTx: '20', // dBi
  gainRx: '20', // dBi
  losses: '2', // dB
  threshold: '-90', // dBm
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
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={glossaireFocus} />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <div className="font-semibold mb-1">À quoi ça sert ?</div>
          <div className="text-sm text-gray-700">
            Le module <b>Hertzien</b> permet de réaliser le bilan de liaison d'un faisceau hertzien (FH) : calcul de la marge, des pertes et de la faisabilité d'une liaison point à point.<br/>
            <b>Cas d'usage :</b> conception d'un lien FH, vérification de la faisabilité d'une liaison, optimisation des paramètres radio.<br/>
            <b>Lien avec la théorie :</b> ce module met en pratique les notions d'affaiblissement, de bilan de liaison et de propagation vues en cours de transmission hertzienne (voir chapitre "Bilan de liaison FH").
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Paramètres Bilan Hertzien</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Scénario</label>
          <select value={scenario} onChange={handleScenarioChange} className="w-full border rounded px-2 py-1 text-sm">
            <option value="">Choisir un scénario</option>
            <option value="urbain">Urbain</option>
            <option value="interurbain">Interurbain</option>
            <option value="montagne">Montagne</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="mb-2 bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200">Remplir avec un exemple</button>
        {exampleMsg && <div className="mb-2 text-xs text-green-700">{exampleMsg}</div>}
        {/* Fréquence */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Fréquence (GHz)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.frequency.short}<br/>
              <b>Unité :</b> GHz<br/>
              <b>Exemple :</b> {pedagogicHelp.frequency.example}<br/>
              <b>Impact :</b> {pedagogicHelp.frequency.why}
            </>} glossaireId="fh" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('frequency')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="frequency"
            value={values.frequency}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['frequency'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.frequency.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('frequency')}</div>
          {errors.frequency && <span className="text-red-600 text-sm">{errors.frequency}</span>}
        </div>
        {/* Distance */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Distance (km)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.distance.short}<br/>
              <b>Unité :</b> km<br/>
              <b>Exemple :</b> {pedagogicHelp.distance.example}<br/>
              <b>Impact :</b> {pedagogicHelp.distance.why}
            </>} glossaireId="fh" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('distance')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="distance"
            value={values.distance}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['distance'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.distance.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('distance')}</div>
          {errors.distance && <span className="text-red-600 text-sm">{errors.distance}</span>}
        </div>
        {/* Puissance émission */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Puissance émission (dBm)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.power.short}<br/>
              <b>Unité :</b> dBm<br/>
              <b>Exemple :</b> {pedagogicHelp.power.example}<br/>
              <b>Impact :</b> {pedagogicHelp.power.why}
            </>} glossaireId="dBm" onOpenGlossaire={handleOpenGlossaire} />
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
        {/* Gain antenne émission */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Gain antenne émission (dBi)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.gainTx.short}<br/>
              <b>Unité :</b> dBi<br/>
              <b>Exemple :</b> {pedagogicHelp.gainTx.example}<br/>
              <b>Impact :</b> {pedagogicHelp.gainTx.why}
            </>} glossaireId="gain" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('gainTx')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="gainTx"
            value={values.gainTx}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['gainTx'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.gainTx.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('gainTx')}</div>
          {errors.gainTx && <span className="text-red-600 text-sm">{errors.gainTx}</span>}
        </div>
        {/* Gain antenne réception */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Gain antenne réception (dBi)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.gainRx.short}<br/>
              <b>Unité :</b> dBi<br/>
              <b>Exemple :</b> {pedagogicHelp.gainRx.example}<br/>
              <b>Impact :</b> {pedagogicHelp.gainRx.why}
            </>} glossaireId="gain" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('gainRx')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="gainRx"
            value={values.gainRx}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['gainRx'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.gainRx.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('gainRx')}</div>
          {errors.gainRx && <span className="text-red-600 text-sm">{errors.gainRx}</span>}
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
            </>} glossaireId="attenuation" onOpenGlossaire={handleOpenGlossaire} />
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
        {/* Seuil de réception */}
        <div>
          <label className="block font-medium flex items-center gap-2">
            Seuil de réception (dBm)
            <InfoBulle content={<>
              <b>Définition :</b> {pedagogicHelp.threshold.short}<br/>
              <b>Unité :</b> dBm<br/>
              <b>Exemple :</b> {pedagogicHelp.threshold.example}<br/>
              <b>Impact :</b> {pedagogicHelp.threshold.why}
            </>} glossaireId="seuil" onOpenGlossaire={handleOpenGlossaire} />
            <button type="button" onClick={() => handleShowWhy('threshold')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
          </label>
          <input
            type="number"
            name="threshold"
            value={values.threshold}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {showWhy['threshold'] && (
            <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.threshold.why}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">{getDynamicComment('threshold')}</div>
          {errors.threshold && <span className="text-red-600 text-sm">{errors.threshold}</span>}
        </div>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Calculer</button>
        {showResults && (
          <HertzienResults
            frequency={Number(values.frequency)}
            distance={Number(values.distance)}
            power={Number(values.power)}
            gainTx={Number(values.gainTx)}
            gainRx={Number(values.gainRx)}
            losses={Number(values.losses)}
            threshold={Number(values.threshold)}
          />
        )}
      </form>
    </>
  );
};

export default HertzienForm; 