import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { 
  ArrowRightOnRectangleIcon,
  UserIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';

const Header = ({ onMenuClick, showMenuButton = true }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log('Realizando logout...');
    
    // Limpar estado da aplicação
    logout();
    
    // Limpar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Fechar menu
    setUserMenuOpen(false);
    
    // Redirecionar para login
    navigate('/login', { replace: true });
  };

  const handleProfile = () => {
    // TODO: Navegar para perfil do usuário
    console.log('Abrindo perfil do usuário');
    setUserMenuOpen(false);
  };

  const handleSettings = () => {
    // TODO: Navegar para configurações
    console.log('Abrindo configurações');
    setUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo e Menu */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AGIR</h1>
              <p className="text-xs text-gray-500">Sistema de Gestão Ágil</p>
            </div>
          </button>
        </div>

        {/* Usuário */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <BellIcon className="h-6 w-6" />
          </button>
          
          {/* Menu do Usuário */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${
                userMenuOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <>
                {/* Overlay para fechar o menu */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setUserMenuOpen(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    {/* Informações do usuário */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-sm text-gray-500">{currentUser.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{currentUser.role}</p>
                    </div>

                    {/* Opções do menu */}
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Meu Perfil
                    </button>

                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <CogIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Configurações
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-red-400" />
                      Sair
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

