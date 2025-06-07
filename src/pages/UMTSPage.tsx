import React from 'react';
import UMTSForm from '../components/umts/UMTSForm';

const UMTSPage: React.FC = () => {
  return (
    <div className="p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Dimensionnement UMTS</h2>
        <UMTSForm />
      </div>
    </div>
  );
};

export default UMTSPage;