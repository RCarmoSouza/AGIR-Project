import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  CalendarDaysIcon, 
  ViewColumnsIcon, 
  ClockIcon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';
import { useSidebar } from '../hooks/useSidebar';

const Sidebar = ({ isOpen, onClose, currentPath }) => {
  const { selectedProjectId, getProjectById } = useAppStore();
  const selectedProject = selectedProjectId ? getProjectById(selectedProjectId) : null;
  
  // Hook para gerenciar estado do sidebar colapsável
  const { isExpanded, expandSidebar, collapseSidebar, toggleSidebar, cleanup } = useSidebar(1000);

  // Cleanup do timeout quando o componente for desmontado
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const menuItems = [
    { 
      path: '/', 
      icon: HomeIcon, 
      label: 'Dashboard', 
      badge: null,
      color: 'text-blue-600'
    },
    { 
      path: '/projects', 
      icon: FolderIcon, 
      label: 'Projetos', 
      badge: '3',
      color: 'text-green-600'
    },
    { 
      path: '/sprint-planning', 
      icon: CalendarDaysIcon, 
      label: 'Planejamento', 
      badge: '2',
      color: 'text-purple-600'
    },
    { 
      path: '/kanban', 
      icon: ViewColumnsIcon, 
      label: 'Kanban', 
      badge: '8',
      color: 'text-orange-600'
    },
    { 
      path: '/timesheet', 
      icon: ClockIcon, 
      label: 'Timesheet', 
      badge: '1',
      color: 'text-pink-600'
    }
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Colapsável */}
      <aside 
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out relative
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
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

          {/* Projeto Selecionado */}
          {selectedProject && (
            <div className={`px-4 py-3 border-b border-gray-200 transition-all duration-300 ${
              !isExpanded ? 'px-2' : ''
            }`}>
              <p className={`text-xs font-medium text-gray-500 uppercase tracking-wide transition-all duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
              }`}>
                Projeto Atual
              </p>
              <div className={`mt-1 flex items-center space-x-2 group ${!isExpanded ? 'justify-center' : ''}`}>
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <p className={`text-sm font-medium text-gray-900 truncate transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}>
                  {selectedProject.name}
                </p>
                
                {/* Tooltip para estado recolhido */}
                {!isExpanded && (
                  <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {selectedProject.name}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Menu de Navegação */}
          <nav className={`flex-1 py-6 space-y-2 ${isExpanded ? 'px-4' : 'px-2'}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200 group relative
                    ${isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? item.color : 'text-gray-400'}`} />
                    <span className={`transition-all duration-300 ${
                      isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {item.badge && (
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full transition-all duration-300
                      ${isActive 
                        ? 'bg-white text-gray-900' 
                        : 'bg-gray-200 text-gray-600'
                      }
                      ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Tooltip para estado recolhido */}
                  {!isExpanded && (
                    <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && ` (${item.badge})`}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Rodapé */}
          <div className={`py-4 border-t border-gray-200 transition-all duration-300 ${
            isExpanded ? 'px-4' : 'px-2'
          }`}>
            <p className={`text-xs text-gray-500 text-center transition-all duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
            }`}>
              AGIR v1.0.0
            </p>
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

export default Sidebar;

