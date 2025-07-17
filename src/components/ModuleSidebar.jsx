import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useSidebar } from '../hooks/useSidebar';

const ModuleSidebar = ({ 
  isOpen, 
  onClose, 
  moduleConfig,
  menuItems = [],
  expandableItems = [],
  children 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Hook para gerenciar estado do sidebar colapsável
  const { isExpanded, expandSidebar, collapseSidebar, toggleSidebar, cleanup } = useSidebar(1000);

  // Cleanup do timeout quando o componente for desmontado
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:h-auto
          ${isExpanded ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={expandSidebar}
        onMouseLeave={collapseSidebar}
        style={{ minWidth: isExpanded ? '256px' : '64px' }}
      >
        <div className="flex flex-col h-full">
          {/* Botão fechar (mobile) */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Header do Módulo */}
          {moduleConfig && (
            <div className={`px-4 py-4 border-b border-gray-200 transition-all duration-300 ${
              !isExpanded ? 'px-2' : ''
            }`}>
              <div className={`flex items-center space-x-3 ${!isExpanded ? 'justify-center' : ''}`}>
                <div className={`w-8 h-8 ${moduleConfig.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <moduleConfig.icon className={`h-5 w-5 ${moduleConfig.iconColor}`} />
                </div>
                <div className={`transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}>
                  <h2 className="text-sm font-semibold text-gray-900">{moduleConfig.title}</h2>
                  <p className="text-xs text-gray-500">{moduleConfig.subtitle}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu de Navegação */}
          <nav className={`flex-1 py-6 space-y-1 ${isExpanded ? 'px-4' : 'px-2'}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || 
                             (item.exactMatch ? currentPath === item.path : currentPath.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200 group relative
                    ${isActive 
                      ? `${moduleConfig?.activeColor || 'bg-blue-50 text-blue-700'} border-r-2 ${moduleConfig?.activeBorder || 'border-blue-500'}` 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Icon className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? (moduleConfig?.activeIconColor || 'text-blue-600') : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span className={`transition-all duration-300 ${
                      isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Tooltip para estado recolhido */}
                  {!isExpanded && (
                    <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}

            {/* Conteúdo expandível personalizado (para projetos, etc.) */}
            {children && (
              <div className={`transition-all duration-300 ${
                isExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
              }`}>
                {React.cloneElement(children, { isExpanded })}
              </div>
            )}
          </nav>

          {/* Botão de voltar ao Dashboard Principal */}
          <div className={`py-4 border-t border-gray-200 transition-all duration-300 ${
            isExpanded ? 'px-4' : 'px-2'
          }`}>
            <Link
              to="/"
              onClick={onClose}
              className={`
                flex items-center px-3 py-2 rounded-lg text-sm font-medium
                text-gray-500 hover:text-gray-700 hover:bg-gray-50
                transition-colors duration-200 group relative
              `}
              title={!isExpanded ? 'Voltar ao Dashboard' : ''}
            >
              <div className="flex items-center space-x-3 w-full">
                <HomeIcon className="h-4 w-4 flex-shrink-0" />
                <span className={`transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}>
                  Voltar ao Dashboard
                </span>
              </div>
              
              {/* Tooltip para estado recolhido */}
              {!isExpanded && (
                <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Voltar ao Dashboard
                </div>
              )}
            </Link>
          </div>

          {/* Botão de toggle para acessibilidade */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 -right-3 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10 hidden lg:flex"
            title={isExpanded ? 'Recolher menu' : 'Expandir menu'}
            aria-label={isExpanded ? 'Recolher menu lateral' : 'Expandir menu lateral'}
          >
            <ChevronRightIcon className={`h-3 w-3 text-gray-600 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default ModuleSidebar;

