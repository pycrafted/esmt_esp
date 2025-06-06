import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'GSM', path: '/gsm' },
  { label: 'UMTS', path: '/umts' },
  { label: 'Bilan Hertzien', path: '/hertzien' },
  { label: 'Bilan Optique', path: '/optique' },
  {label:'visualisation',path:'/visualisation'}
];

const Sidebar: React.FC = () => (
  <aside className="bg-blue-100 w-56 min-h-screen p-4 flex flex-col gap-4 shadow-md">
    <nav>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded font-medium ${
                  isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-200 text-blue-900'
                }`
              }
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar; 