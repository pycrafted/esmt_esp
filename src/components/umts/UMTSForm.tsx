import React, { useState } from 'react';
import UMTSResults from './UMTSResults';
import InfoBulle from '../common/InfoBulle';

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

const pedagogicHelp = {
  area: {
    short: "Zone totale à couvrir (en km²).",
    example: "Ex : 2 km² (quartier), 50 km² (ville)",
    why: "La taille de la zone influence le nombre de cellules nécessaires."
  },
  users: {
    short: "Nombre total d'utilisateurs à desservir.",
    example: "Ex : 500 (petite zone), 10000 (grande ville)",
    why: "Permet de dimensionner la capacité du réseau."
  },
  voice: {
    short: "Débit voix par utilisateur (en kbps).",
    example: "Ex : 12.2 kbps (AMR), 8 kbps (codec bas débit)",
    why: "Le débit voix impacte la bande passante nécessaire."
  },
  data: {
    short: "Débit data par utilisateur (en kbps).",
    example: "Ex : 64 kbps (browsing), 384 kbps (3G max)",
    why: "Le débit data détermine la capacité requise pour l'accès Internet."
  },
  video: {
    short: "Débit vidéo par utilisateur (en kbps).",
    example: "Ex : 128 kbps (basse qualité), 512 kbps (bonne qualité)",
    why: "Le débit vidéo est important pour les services multimédias."
  },
  load: {
    short: "Facteur de charge du réseau (en %).",
    example: "Ex : 60% (valeur courante)",
    why: "Permet de ne pas saturer le réseau et d'assurer la qualité de service."
  }
};

const UMTSForm: React.FC<{ onSubmit?: (values: UMTSFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<UMTSFormValues>>({});
  const [showResults, setShowResults] = useState(false);
  const [showWhy, setShowWhy] = useState<{ [k: string]: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleShowWhy = (field: string) => {
    setShowWhy((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getDynamicComment = (field: keyof UMTSFormValues) => {
    const v = values[field];
    if (!v) return pedagogicHelp[field].short + ' ' + pedagogicHelp[field].example;
    const num = Number(v);
    if (isNaN(num)) return "Veuillez entrer une valeur numérique.";
    if (field === 'area') {
      if (num < 1) return "Petite zone, peu de cellules nécessaires.";
      if (num > 100) return "Grande zone, prévoir plus de sites.";
      return "Zone typique pour une ville ou un campus.";
    }
    if (field === 'users') {
      if (num < 100) return "Peu d'utilisateurs, faible trafic.";
      if (num > 10000) return "Beaucoup d'utilisateurs, attention à la capacité.";
      return "Nombre d'utilisateurs courant.";
    }
    if (field === 'voice') {
      if (num < 8) return "Débit voix très faible, qualité dégradée.";
      if (num > 16) return "Débit voix élevé, bonne qualité mais plus de ressources nécessaires.";
      return "Débit voix standard (AMR).";
    }
    if (field === 'data') {
      if (num < 32) return "Débit data faible, usage basique.";
      if (num > 384) return "Débit data élevé, attention à la capacité.";
      return "Débit data courant pour 3G.";
    }
    if (field === 'video') {
      if (num < 64) return "Débit vidéo faible, qualité basse.";
      if (num > 512) return "Débit vidéo élevé, attention à la bande passante.";
      return "Débit vidéo typique pour mobile.";
    }
    if (field === 'load') {
      if (num < 40) return "Facteur de charge faible, réseau sous-utilisé.";
      if (num > 80) return "Facteur de charge élevé, risque de saturation.";
      return "Facteur de charge courant (60%).";
    }
    return '';
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
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
        <div className="font-semibold mb-1">À quoi ça sert ?</div>
        <div className="text-sm text-gray-700">
          Le module <b>UMTS</b> permet de dimensionner la capacité d'un réseau 3G pour une zone donnée. Il aide à estimer le nombre de cellules nécessaires en fonction du nombre d'utilisateurs, des débits voix, data et vidéo, et du facteur de charge.<br/>
          <b>Cas d'usage :</b> planification d'un réseau urbain, simulation de scénarios de trafic, étude d'impact d'une augmentation d'utilisateurs.<br/>
          <b>Lien avec la théorie :</b> ce module met en pratique les notions de capacité cellulaire, de partage de ressources radio et d'ingénierie de trafic vues en cours de réseaux mobiles (voir chapitre "Dimensionnement UMTS").
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Paramètres UMTS</h2>
      {/* Zone de couverture */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Zone de couverture (km²)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.area.short}<br/>
            <b>Unité :</b> km²<br/>
            <b>Exemple :</b> {pedagogicHelp.area.example}<br/>
            <b>Impact :</b> {pedagogicHelp.area.why}
          </>} />
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
      {/* Nombre d'utilisateurs */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Nombre d'utilisateurs
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.users.short}<br/>
            <b>Unité :</b> nombre<br/>
            <b>Exemple :</b> {pedagogicHelp.users.example}<br/>
            <b>Impact :</b> {pedagogicHelp.users.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('users')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="users"
          value={values.users}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['users'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.users.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('users')}</div>
        {errors.users && <span className="text-red-600 text-sm">{errors.users}</span>}
      </div>
      {/* Débit voix */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Débit voix par utilisateur (kbps)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.voice.short}<br/>
            <b>Unité :</b> kbps<br/>
            <b>Exemple :</b> {pedagogicHelp.voice.example}<br/>
            <b>Impact :</b> {pedagogicHelp.voice.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('voice')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="voice"
          value={values.voice}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['voice'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.voice.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('voice')}</div>
        {errors.voice && <span className="text-red-600 text-sm">{errors.voice}</span>}
      </div>
      {/* Débit data */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Débit data par utilisateur (kbps)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.data.short}<br/>
            <b>Unité :</b> kbps<br/>
            <b>Exemple :</b> {pedagogicHelp.data.example}<br/>
            <b>Impact :</b> {pedagogicHelp.data.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('data')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="data"
          value={values.data}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['data'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.data.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('data')}</div>
        {errors.data && <span className="text-red-600 text-sm">{errors.data}</span>}
      </div>
      {/* Débit vidéo */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Débit vidéo par utilisateur (kbps)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.video.short}<br/>
            <b>Unité :</b> kbps<br/>
            <b>Exemple :</b> {pedagogicHelp.video.example}<br/>
            <b>Impact :</b> {pedagogicHelp.video.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('video')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="video"
          value={values.video}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['video'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.video.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('video')}</div>
        {errors.video && <span className="text-red-600 text-sm">{errors.video}</span>}
      </div>
      {/* Facteur de charge */}
      <div>
        <label className="block font-medium flex items-center gap-2">
          Facteur de charge (%)
          <InfoBulle content={<>
            <b>Définition :</b> {pedagogicHelp.load.short}<br/>
            <b>Unité :</b> %<br/>
            <b>Exemple :</b> {pedagogicHelp.load.example}<br/>
            <b>Impact :</b> {pedagogicHelp.load.why}
          </>} />
          <button type="button" onClick={() => handleShowWhy('load')} className="text-blue-600 text-xs underline">Pourquoi ?</button>
        </label>
        <input
          type="number"
          name="load"
          value={values.load}
          onChange={handleChange}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {showWhy['load'] && (
          <div className="text-xs text-blue-700 mb-1">{pedagogicHelp.load.why}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">{getDynamicComment('load')}</div>
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