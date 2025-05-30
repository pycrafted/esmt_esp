import React, { useState } from 'react';
import HertzienResults from './HertzienResults';

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

const HertzienForm: React.FC<{ onSubmit?: (values: HertzienFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<HertzienFormValues>>({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
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

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">Paramètres Bilan Hertzien</h2>
      <div>
        <label className="block font-medium">Fréquence (GHz)</label>
        <input
          type="number"
          name="frequency"
          value={values.frequency}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.frequency && <span className="text-red-600 text-sm">{errors.frequency}</span>}
      </div>
      <div>
        <label className="block font-medium">Distance (km)</label>
        <input
          type="number"
          name="distance"
          value={values.distance}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.distance && <span className="text-red-600 text-sm">{errors.distance}</span>}
      </div>
      <div>
        <label className="block font-medium">Puissance émission (dBm)</label>
        <input
          type="number"
          name="power"
          value={values.power}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.power && <span className="text-red-600 text-sm">{errors.power}</span>}
      </div>
      <div>
        <label className="block font-medium">Gain antenne émission (dBi)</label>
        <input
          type="number"
          name="gainTx"
          value={values.gainTx}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.gainTx && <span className="text-red-600 text-sm">{errors.gainTx}</span>}
      </div>
      <div>
        <label className="block font-medium">Gain antenne réception (dBi)</label>
        <input
          type="number"
          name="gainRx"
          value={values.gainRx}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.gainRx && <span className="text-red-600 text-sm">{errors.gainRx}</span>}
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
        <label className="block font-medium">Seuil de réception (dBm)</label>
        <input
          type="number"
          name="threshold"
          value={values.threshold}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
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
  );
};

export default HertzienForm; 