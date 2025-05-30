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

const GSMForm: React.FC<{ onSubmit?: (values: GSMFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<GSMFormValues>>({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
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
      <div>
        <label className="block font-medium">Zone de couverture (km²)</label>
        <input
          type="number"
          name="area"
          value={values.area}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.area && <span className="text-red-600 text-sm">{errors.area}</span>}
      </div>
      <div>
        <label className="block font-medium">Densité de population (hab/km²)</label>
        <input
          type="number"
          name="density"
          value={values.density}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.density && <span className="text-red-600 text-sm">{errors.density}</span>}
      </div>
      <div>
        <label className="block font-medium">Trafic par abonné (mErlang)</label>
        <input
          type="number"
          name="trafficPerUser"
          value={values.trafficPerUser}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.trafficPerUser && <span className="text-red-600 text-sm">{errors.trafficPerUser}</span>}
      </div>
      <div>
        <label className="block font-medium">Taux de pénétration (%)</label>
        <input
          type="number"
          name="penetration"
          value={values.penetration}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.penetration && <span className="text-red-600 text-sm">{errors.penetration}</span>}
      </div>
      <div>
        <label className="block font-medium">Facteur d'activité</label>
        <input
          type="number"
          name="activity"
          value={values.activity}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
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