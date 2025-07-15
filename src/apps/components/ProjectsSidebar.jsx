import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BellIcon,
  ChartBarIcon,
  FolderIcon,
  UserGroupIcon,
  ViewColumnsIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../../stores/appStore';

const ProjectsSidebar = ({ isExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects } = useAppStore();
  const [expandedProjects, setExpandedProjects] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  // Filtrar projetos baseado na pesquisa e status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const clearSearch = () => {
    setSearchTerm('');
  };

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
    <div className={`transition-all duration-300 ${
      isExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
    }`}>
      {/* Seção Projetos */}
      <div className="pt-4">
        {/* Cabeçalho com ícone de filtro */}
        <div className={`flex items-center space-x-2 px-3 py-2 group ${!isExpanded ? 'justify-center' : ''}`}>
          <FolderIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <span className={`font-medium text-gray-900 transition-all duration-300 text-xs ${
            isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
          }`}>
            Projetos
          </span>
          {isExpanded && (
            <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-400 ml-auto" />
          )}
          
          {/* Tooltip para estado recolhido */}
          {!isExpanded && (
            <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Projetos
            </div>
          )}
        </div>

        {/* Barra de Pesquisa Integrada */}
        <div className={`transition-all duration-300 px-3 mb-3 ${
          isExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filtros de Status */}
          <div className="flex space-x-1 mt-2">
            {['Todos', 'Ativo', 'Pausado', 'Concluído'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Linha divisória sutil */}
        <div className={`border-t border-gray-200 mx-3 mb-3 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}></div>

        {/* Lista de Projetos Filtrados */}
        <div className={`transition-all duration-300 ${
          isExpanded ? 'opacity-100 max-h-screen ml-4 space-y-0.5' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          {/* Contador de resultados */}
          {isExpanded && (searchTerm || statusFilter !== 'Todos') && (
            <div className="px-3 py-1 text-xs text-gray-500">
              {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
            </div>
          )}

          {filteredProjects.length === 0 && isExpanded && searchTerm && (
            <div className="px-3 py-2 text-xs text-gray-500 text-center">
              Nenhum projeto encontrado
            </div>
          )}

          {filteredProjects.slice(0, 10).map((project) => (
            <div key={project.id}>
              {/* Nome do Projeto */}
              <button
                onClick={() => toggleProject(project.id)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-800 truncate">{project.name}</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                    project.status === 'Pausado' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'Concluído' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                {expandedProjects[project.id] ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {/* Sub-páginas do Projeto */}
              {expandedProjects[project.id] && (
                <div className="ml-4 space-y-0.5">
                  {getProjectSubPages(project).map((subPage) => (
                    <button
                      key={subPage.path}
                      onClick={() => navigate(subPage.path)}
                      className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-left transition-colors ${
                        isActive(subPage.path)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <subPage.icon className={`h-4 w-4 flex-shrink-0 ${
                        isActive(subPage.path) ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-xs truncate">{subPage.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSidebar;

