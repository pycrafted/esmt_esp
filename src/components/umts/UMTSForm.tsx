import React, { useState } from 'react';
import UMTSResults from './UMTSResults';

interface UMTSFormValues {
  area: string;
  users: string;
  voice: string;
  data: string;
  video: string;
  load: string;
}

const initialValues: UMTSFormValues = {
  area: '',
  users: '',
  voice: '',
  data: '',
  video: '',
  load: '',
};

const UMTSForm: React.FC<{ onSubmit?: (values: UMTSFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<UMTSFormValues>>({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<UMTSFormValues> = {};
    if (!values.area || isNaN(Number(values.area))) newErrors.area = 'Zone invalide';
    if (!values.users || isNaN(Number(values.users))) newErrors.users = 'Nombre d\'utilisateurs invalide';
    if (!values.voice || isNaN(Number(values.voice))) newErrors.voice = 'Débit voix invalide';
    if (!values.data || isNaN(Number(values.data))) newErrors.data = 'Débit data invalide';
    if (!values.video || isNaN(Number(values.video))) newErrors.video = 'Débit vidéo invalide';
    if (!values.load || isNaN(Number(values.load))) newErrors.load = 'Facteur de charge invalide';
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
      <h2 className="text-xl font-bold mb-4">Paramètres UMTS</h2>
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
        <label className="block font-medium">Nombre d'utilisateurs</label>
        <input
          type="number"
          name="users"
          value={values.users}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.users && <span className="text-red-600 text-sm">{errors.users}</span>}
      </div>
      <div>
        <label className="block font-medium">Débit voix par utilisateur (kbps)</label>
        <input
          type="number"
          name="voice"
          value={values.voice}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.voice && <span className="text-red-600 text-sm">{errors.voice}</span>}
      </div>
      <div>
        <label className="block font-medium">Débit data par utilisateur (kbps)</label>
        <input
          type="number"
          name="data"
          value={values.data}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.data && <span className="text-red-600 text-sm">{errors.data}</span>}
      </div>
      <div>
        <label className="block font-medium">Débit vidéo par utilisateur (kbps)</label>
        <input
          type="number"
          name="video"
          value={values.video}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.video && <span className="text-red-600 text-sm">{errors.video}</span>}
      </div>
      <div>
        <label className="block font-medium">Facteur de charge (%)</label>
        <input
          type="number"
          name="load"
          value={values.load}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {errors.load && <span className="text-red-600 text-sm">{errors.load}</span>}
      </div>
      <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Calculer</button>
      {showResults && (
        <UMTSResults
          area={Number(values.area)}
          users={Number(values.users)}
          voice={Number(values.voice)}
          data={Number(values.data)}
          video={Number(values.video)}
          load={Number(values.load)}
        />
      )}
    </form>
  );
};

export default UMTSForm; 