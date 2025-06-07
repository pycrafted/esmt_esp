import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold">RTS</h1>
            </Link>
          </div>

          {/* Menu pour mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Menu pour desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Accueil
              </Link>
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 flex items-center">
                  Simulation
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                  <div className="py-1">
                    <Link
                      to="/simulation/link-budget"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Bilan de Liaison
                    </Link>
                    <Link
                      to="/simulation/fresnel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Zone de Fresnel
                    </Link>
                    <Link
                      to="/simulation/diffraction"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Diffraction
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                to="/documentation"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <div className="relative">
              <button
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                onClick={toggleMenu}
              >
                Simulation
              </button>
              <div className="pl-4">
                <Link
                  to="/simulation/link-budget"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={toggleMenu}
                >
                  Bilan de Liaison
                </Link>
                <Link
                  to="/simulation/fresnel"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={toggleMenu}
                >
                  Zone de Fresnel
                </Link>
                <Link
                  to="/simulation/diffraction"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                  onClick={toggleMenu}
                >
                  Diffraction
                </Link>
              </div>
            </div>
            <Link
              to="/documentation"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={toggleMenu}
            >
              Documentation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 