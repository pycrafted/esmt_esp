import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/gsm', label: 'GSM', icon: '📱' },
  { to: '/umts', label: 'UMTS', icon: '📶' },
  { to: '/hertzien', label: 'Hertzien', icon: '📡' },
  { to: '/optique', label: 'Optique', icon: '💡' },
  { to: '/simulation', label: 'simulation', icon: '🧪' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 inset-y-0 w-60 bg-primary-dark text-white flex flex-col justify-between py-8 shadow-2xl font-sans border-r border-primary z-30">
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-7 py-3 rounded-l-full transition-colors duration-200 text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white/80
              ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-100 hover:bg-primary-light/90 hover:text-white'}`
            }
            aria-label={item.label}
          >
            <span className="text-2xl transition-transform group-hover:scale-110 group-active:scale-95">{item.icon}</span>
            <span className="tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 