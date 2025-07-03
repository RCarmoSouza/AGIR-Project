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
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../../stores/appStore';

const ProjectsSidebar = ({ isExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects } = useAppStore();
  const [expandedProjects, setExpandedProjects] = useState({});

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
    <div className={`transition-all duration-300 ${
      isExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
    }`}>
      {/* Seção Projetos */}
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
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <subPage.icon className={`h-4 w-4 flex-shrink-0 ${
                        isActive(subPage.path) ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm truncate">{subPage.name}</span>
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

