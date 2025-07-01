import React from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';

const Header = ({ onMenuClick }) => {
  const { currentUser } = useAppStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo e Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AGIR</h1>
              <p className="text-xs text-gray-500">Sistema de Gestão Ágil</p>
            </div>
          </div>
        </div>

        {/* Usuário */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <BellIcon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.role}</p>
            </div>
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

