import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../../stores/appStore';

const ProjectGantt = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { tasks, getTasksByProject, projects } = useAppStore();
  
  // Estados
  const [ganttView, setGanttView] = useState('gantt');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [zoomLevel, setZoomLevel] = useState(1);

  // Dados do projeto
  const project = projects.find(p => p.id === parseInt(projectId));
  const projectTasks = getTasksByProject(parseInt(projectId));

  // Função para indentar tarefa
  const indentTask = (taskId) => {
    alert(`Indentando tarefa ${taskId}`);
  };

  // Função para desindentar tarefa
  const outdentTask = (taskId) => {
    alert(`Desindentando tarefa ${taskId}`);
  };

  // Função para alternar expansão
  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  // Tarefas visíveis
  const visibleTasks = useMemo(() => {
    return projectTasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projectTasks, searchTerm]);

  if (!project) {
    return <div className="p-4">Projeto não encontrado</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setGanttView('lista')}
                className={`px-3 py-1 text-sm rounded ${
                  ganttView === 'lista' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setGanttView('gantt')}
                className={`px-3 py-1 text-sm rounded ${
                  ganttView === 'gantt' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Gantt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-hidden">
        {ganttView === 'lista' ? (
          /* Visão Lista */
          <div className="h-full bg-white">
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-7 gap-2 px-4 py-2 text-xs font-medium text-gray-700">
                <div className="col-span-2">Nome da Tarefa</div>
                <div>Status</div>
                <div>Responsável</div>
                <div>Data Início</div>
                <div>Progresso</div>
                <div className="text-center">Ações</div>
              </div>
            </div>
            
            <div className="overflow-y-auto">
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className={`grid grid-cols-7 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 group ${
                    selectedTask === task.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedTask(task.id)}
                >
                  <div className="col-span-2 flex items-center">
                    <div 
                      style={{ marginLeft: `${(task.level || 0) * 20}px` }}
                      className="flex items-center"
                    >
                      {projectTasks.some(t => t.parentId === task.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskExpansion(task.id);
                          }}
                          className="mr-2 p-0.5 hover:bg-gray-200 rounded"
                        >
                          {expandedTasks.has(task.id) ? (
                            <ChevronDownIcon className="w-3 h-3" />
                          ) : (
                            <ChevronRightIcon className="w-3 h-3" />
                          )}
                        </button>
                      )}
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                      task.status === 'Em Progresso' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {task.assignee?.name || '-'}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {task.startDate ? new Date(task.startDate).toLocaleDateString('pt-BR') : '-'}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          task.status === 'Concluído' ? 'bg-green-500' :
                          task.status === 'Em Progresso' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{task.progress || 0}%</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        indentTask(task.id);
                      }}
                      disabled={(task.level || 0) >= 2}
                      className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                      title="Indentar tarefa"
                    >
                      <ArrowRightIcon className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        outdentTask(task.id);
                      }}
                      disabled={(task.level || 0) === 0}
                      className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                      title="Desindentar tarefa"
                    >
                      <ArrowLeftIcon className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Visão Gantt */
          <div className="h-full flex bg-white">
            {/* Lista de Tarefas */}
            <div className="w-80 border-r border-gray-200 bg-gray-50">
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <h3 className="text-sm font-medium text-gray-900">Tarefas</h3>
              </div>
              
              <div className="overflow-y-auto">
                {visibleTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-white cursor-pointer group ${
                      selectedTask === task.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedTask(task.id)}
                  >
                    <div 
                      style={{ marginLeft: `${(task.level || 0) * 20}px` }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        {projectTasks.some(t => t.parentId === task.id) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaskExpansion(task.id);
                            }}
                            className="mr-2 p-0.5 hover:bg-gray-200 rounded"
                          >
                            {expandedTasks.has(task.id) ? (
                              <ChevronDownIcon className="w-3 h-3" />
                            ) : (
                              <ChevronRightIcon className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            indentTask(task.id);
                          }}
                          disabled={(task.level || 0) >= 2}
                          className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                          title="Indentar tarefa"
                        >
                          <ArrowRightIcon className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            outdentTask(task.id);
                          }}
                          disabled={(task.level || 0) === 0}
                          className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                          title="Desindentar tarefa"
                        >
                          <ArrowLeftIcon className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500">
                      {task.assignee?.name} • {task.progress || 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Timeline */}
            <div className="flex-1 overflow-x-auto bg-white">
              <div className="p-8 text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">Timeline do Gantt</h3>
                <p>Cronograma visual das tarefas será exibido aqui</p>
                <div className="mt-4 text-sm">
                  <p>Tarefas carregadas: {visibleTasks.length}</p>
                  <p>Projeto: {project.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Controles de Zoom */}
      <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg px-3 py-2 flex items-center space-x-2">
        <span className="text-xs text-gray-600">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MinusIcon className="w-3 h-3" />
        </button>
        <button
          onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <PlusIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default ProjectGantt;

