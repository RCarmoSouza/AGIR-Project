import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';
import { useSidebar } from '../hooks/useSidebar';

const TimesheetLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAppStore();
  
  // Hook para gerenciar estado do sidebar colapsável
  const { isExpanded, expandSidebar, collapseSidebar, toggleSidebar, cleanup } = useSidebar(1000);

  // Cleanup do timeout quando o componente for desmontado
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      name: 'Timesheet',
      path: '/timesheet',
      icon: ClockIcon
    },
    {
      name: 'Aprovações',
      path: '/timesheet/approvals',
      icon: CheckCircleIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Colapsável */}
      <div 
        className={`bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={expandSidebar}
        onMouseLeave={collapseSidebar}
        style={{ minWidth: isExpanded ? '256px' : '64px' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
              title="Voltar ao Dashboard"
            >
              <span className="text-white font-bold text-sm">A</span>
            </button>
            
            {/* Conteúdo expandido */}
            <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">Timesheet</h1>
              <p className="text-xs text-gray-500 whitespace-nowrap">Controle de horas e aprovações</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className={`p-2 space-y-1 ${isExpanded ? '' : 'px-1'}`}>
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={!isExpanded ? item.name : ''}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={`font-medium transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}>
                  {item.name}
                </span>
                
                {/* Tooltip para estado recolhido */}
                {!isExpanded && (
                  <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center space-x-3 group ${!isExpanded ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div className={`flex-1 min-w-0 transition-all duration-300 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
            </div>
            
            {/* Tooltip para estado recolhido */}
            {!isExpanded && (
              <div className="absolute left-16 bottom-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {currentUser.name} - {currentUser.role}
              </div>
            )}
          </div>
        </div>

        {/* Botão de toggle para acessibilidade */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 -right-3 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
          title={isExpanded ? 'Recolher menu' : 'Expandir menu'}
          aria-label={isExpanded ? 'Recolher menu lateral' : 'Expandir menu lateral'}
        >
          <ChevronRightIcon className={`h-3 w-3 text-gray-600 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TimesheetLayout;

