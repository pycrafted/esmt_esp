import React, { useState } from 'react';
import OptiqueResults from './OptiqueResults';

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

const OptiqueForm: React.FC<{ onSubmit?: (values: OptiqueFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<OptiqueFormValues>>({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
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
      <h2 className="text-xl font-bold mb-4">Paramètres Bilan Optique</h2>
      <div>
        <label className="block font-medium">Longueur de la liaison (km)</label>
        <input
          type="number"
          name="length"
          value={values.length}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.length && <span className="text-red-600 text-sm">{errors.length}</span>}
      </div>
      <div>
        <label className="block font-medium">Atténuation fibre (dB/km)</label>
        <input
          type="number"
          name="attenuation"
          value={values.attenuation}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.attenuation && <span className="text-red-600 text-sm">{errors.attenuation}</span>}
      </div>
      <div>
        <label className="block font-medium">Nombre d'épissures</label>
        <input
          type="number"
          name="splices"
          value={values.splices}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.splices && <span className="text-red-600 text-sm">{errors.splices}</span>}
      </div>
      <div>
        <label className="block font-medium">Nombre de connecteurs</label>
        <input
          type="number"
          name="connectors"
          value={values.connectors}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.connectors && <span className="text-red-600 text-sm">{errors.connectors}</span>}
      </div>
      <div>
        <label className="block font-medium">Pertes diverses (dB)</label>
        <input
          type="number"
          name="losses"
          value={values.losses}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.losses && <span className="text-red-600 text-sm">{errors.losses}</span>}
      </div>
      <div>
        <label className="block font-medium">Puissance émetteur (dBm)</label>
        <input
          type="number"
          name="power"
          value={values.power}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
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