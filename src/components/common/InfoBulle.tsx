import React, { useState } from 'react';

interface InfoBulleProps {
  content: React.ReactNode;
  className?: string;
  glossaireId?: string;
  onOpenGlossaire?: (id: string) => void;
}

const InfoBulle: React.FC<InfoBulleProps> = ({ content, className, glossaireId, onOpenGlossaire }) => {
  const [show, setShow] = useState(false);

  return (
    <span className={"relative inline-block " + (className || "")}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((v) => !v)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      style={{ cursor: 'pointer' }}
    >
      <span className="text-blue-500 ml-1 align-middle">❓</span>
      {glossaireId && onOpenGlossaire && (
        <button
          type="button"
          title="Voir dans le glossaire"
          className="ml-1 text-blue-700 hover:text-blue-900 align-middle"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          onClick={e => { e.stopPropagation(); onOpenGlossaire(glossaireId); }}
        >
          <span role="img" aria-label="Glossaire">📖</span>
        </button>
      )}
      {show && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-blue-300 rounded shadow-lg p-3 text-xs text-gray-800">
          {content}
        </div>
      )}
    </span>
  );
};

export default InfoBulle; 