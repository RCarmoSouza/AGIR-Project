import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  FolderIcon,
  BellIcon,
  ChartBarIcon,
  UserGroupIcon,
  ViewColumnsIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';
import { useSidebar } from '../hooks/useSidebar';

const ProjectsLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, currentUser } = useAppStore();
  const [expandedProjects, setExpandedProjects] = useState({});
  
  // Hook para gerenciar estado do sidebar colapsável
  const { isExpanded, expandSidebar, collapseSidebar, toggleSidebar, cleanup } = useSidebar(1000);

  // Cleanup do timeout quando o componente for desmontado
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  const getProjectSubPages = (project) => [
    { 
      name: 'Dashboard do projeto', 
      path: `/projects/${project.id}/dashboard`,
      icon: ChartBarIcon 
    },
    { 
      name: 'Gestão de equipe', 
      path: `/projects/${project.id}/team`,
      icon: UserGroupIcon 
    },
    { 
      name: 'Kanban do Projeto', 
      path: `/projects/${project.id}/kanban`,
      icon: ViewColumnsIcon 
    },
    { 
      name: 'Planejamento de sprints', 
      path: `/projects/${project.id}/sprints`,
      icon: CalendarDaysIcon 
    },
    { 
      name: 'Cronograma (Gantt)', 
      path: `/projects/${project.id}/gantt`,
      icon: CalendarDaysIcon 
    },
    { 
      name: 'Mural de tarefas', 
      path: `/projects/${project.id}/tasks`,
      icon: ClipboardDocumentListIcon 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Colapsável */}
      <div 
        className={`bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative ${
          isExpanded ? 'w-80' : 'w-16'
        }`}
        onMouseEnter={expandSidebar}
        onMouseLeave={collapseSidebar}
        style={{ minWidth: isExpanded ? '320px' : '64px' }}
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
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">Projetos</h1>
              <p className="text-xs text-gray-500 whitespace-nowrap">Gestão de projetos e equipes</p>
            </div>
            
            {/* Ícone quando recolhido */}
            {!isExpanded && (
              <div className="absolute left-16 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Bars3Icon className="h-5 w-5 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className={`p-2 space-y-1 ${isExpanded ? '' : 'px-1'}`}>
            {/* Feed */}
            <button
              onClick={() => navigate('/projects')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                isActive('/projects') && location.pathname === '/projects'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={!isExpanded ? 'Feed' : ''}
            >
              <BellIcon className="h-5 w-5 flex-shrink-0" />
              <span className={`font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                Feed
              </span>
              
              {/* Tooltip para estado recolhido */}
              {!isExpanded && (
                <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Feed
                </div>
              )}
            </button>

            {/* Dashboard de portfólio */}
            <button
              onClick={() => navigate('/projects/portfolio')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors group ${
                isActive('/projects/portfolio')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={!isExpanded ? 'Dashboard de portfólio de projetos' : ''}
            >
              <ChartBarIcon className="h-5 w-5 flex-shrink-0" />
              <span className={`font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                Dashboard de portfólio de projetos
              </span>
              
              {/* Tooltip para estado recolhido */}
              {!isExpanded && (
                <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Dashboard de portfólio de projetos
                </div>
              )}
            </button>

            {/* Projetos */}
            <div className="pt-4">
              <div className={`flex items-center space-x-2 px-3 py-2 group ${!isExpanded ? 'justify-center' : ''}`}>
                <FolderIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className={`font-medium text-gray-900 transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}>
                  Projetos
                </span>
                
                {/* Tooltip para estado recolhido */}
                {!isExpanded && (
                  <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Projetos
                  </div>
                )}
              </div>

              {/* Lista de Projetos - só visível quando expandido */}
              <div className={`transition-all duration-300 ${
                isExpanded ? 'opacity-100 max-h-screen ml-4 space-y-1' : 'opacity-0 max-h-0 overflow-hidden'
              }`}>
                {projects.map((project) => (
                  <div key={project.id}>
                    {/* Nome do Projeto */}
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-800 truncate">{project.name}</span>
                      {expandedProjects[project.id] ? (
                        <ChevronDownIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      )}
                    </button>

                    {/* Sub-páginas do Projeto */}
                    {expandedProjects[project.id] && (
                      <div className="ml-4 space-y-1">
                        {getProjectSubPages(project).map((subPage) => (
                          <button
                            key={subPage.path}
                            onClick={() => navigate(subPage.path)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              isActive(subPage.path)
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <subPage.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm truncate">{subPage.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center space-x-3 group ${!isExpanded ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
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

export default ProjectsLayout;

