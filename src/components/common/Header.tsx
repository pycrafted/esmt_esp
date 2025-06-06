import React from 'react';

const IconPerson = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-primary text-white shadow font-sans transition-colors duration-200 hover:bg-primary-dark relative">
      {/* Logo à gauche */}
      <div className="flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-extrabold text-xl shadow-md border-2 border-primary">
          <span role="img" aria-label="Télécom" className="mr-1">📡</span>DT
        </div>
      </div>
      {/* Titre centré */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="text-2xl font-semibold tracking-tight hidden sm:inline whitespace-nowrap">Outil de Dimensionnement Télécoms</span>
      </div>
      {/* Actions à droite */}
      <div className="flex items-center gap-4 z-10">
        <button aria-label="Profil utilisateur" title="Profil utilisateur" className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-light hover:bg-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white">
          <span className="sr-only">Profil utilisateur</span>
          <IconPerson />
        </button>
        <button aria-label="Paramètres" title="Paramètres" className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-light hover:bg-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white">
          <span className="sr-only">Paramètres</span>
          <IconSettings />
        </button>
      </div>
    </header>
  );
};

export default Header; 