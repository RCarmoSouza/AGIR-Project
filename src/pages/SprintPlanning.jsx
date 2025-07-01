import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import useAppStore from '../stores/appStore';

const SprintPlanning = () => {
  const { projectId } = useParams(); // Obter ID do projeto da URL
  const navigate = useNavigate();
  const { 
    projects, 
    sprints, 
    tasks, 
    getTasksByProject,
    getSprintsByProject,
    getLeafTasks,
    addTask,
    addSprint,
    moveTask,
    currentUser
  } = useAppStore();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'User Story',
    priority: 'Medium',
    storyPoints: 1,
    estimatedHours: 1,
    parentId: ''
  });
  const [parentSearch, setParentSearch] = useState('');
  const [showParentResults, setShowParentResults] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [newSprint, setNewSprint] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: ''
  });

  const selectedProject = projects.find(p => p.id === projectId) || projects[0];
  const projectTasks = getTasksByProject(selectedProject?.id || '');
  const projectSprints = getSprintsByProject(selectedProject?.id || '');
  
  // Filtrar apenas tarefas folha (sem filhas) para backlog
  const allBacklogTasks = projectTasks.filter(task => !task.sprintId);
  const backlogTasks = getLeafTasks(allBacklogTasks);

  // Filtrar tarefas para pesquisa de pai
  const searchableParentTasks = projectTasks.filter(task => 
    task.type === 'Epic' || task.type === 'Feature' || task.type === 'User Story'
  );

  // Filtrar resultados da pesquisa
  const filteredParentTasks = parentSearch.trim() 
    ? searchableParentTasks.filter(task => 
        task.title.toLowerCase().includes(parentSearch.toLowerCase()) ||
        task.id.toLowerCase().includes(parentSearch.toLowerCase()) ||
        (task.code && task.code.toLowerCase().includes(parentSearch.toLowerCase()))
      ).slice(0, 5) // Limitar a 5 resultados
    : [];

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    addTask({
      ...newTask,
      projectId: selectedProject.id,
      assignee: currentUser,
      reporter: currentUser,
      status: 'Backlog',
      tags: [],
      comments: [],
      attachments: [],
      parentId: selectedParent?.id || null
    });

    setNewTask({
      title: '',
      description: '',
      type: 'User Story',
      priority: 'Medium',
      storyPoints: 1,
      estimatedHours: 1,
      parentId: ''
    });
    setParentSearch('');
    setSelectedParent(null);
    setShowParentResults(false);
    setShowTaskModal(false);
  };

  const handleSelectParent = (task) => {
    setSelectedParent(task);
    setParentSearch(task.title);
    setShowParentResults(false);
  };

  const handleClearParent = () => {
    setSelectedParent(null);
    setParentSearch('');
    setShowParentResults(false);
  };

  const handleParentSearchChange = (e) => {
    const value = e.target.value;
    setParentSearch(value);
    setShowParentResults(value.trim().length > 0);
    if (!value.trim()) {
      setSelectedParent(null);
    }
  };

  const handleAddSprint = () => {
    if (!newSprint.name.trim() || !newSprint.startDate || !newSprint.endDate) return;

    addSprint({
      ...newSprint,
      projectId: selectedProject.id,
      status: 'Planning'
    });

    setNewSprint({
      name: '',
      goal: '',
      startDate: '',
      endDate: ''
    });
    setShowSprintModal(false);
  };

  const handleDrop = (e, targetSprintId = null) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    moveTask(taskId, 'Backlog', targetSprintId);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Epic': 'bg-purple-100 text-purple-800',
      'Feature': 'bg-blue-100 text-blue-800',
      'User Story': 'bg-green-100 text-green-800',
      'Bug': 'bg-red-100 text-red-800',
      'Task': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'border-l-red-500',
      'High': 'border-l-orange-500',
      'Medium': 'border-l-yellow-500',
      'Low': 'border-l-green-500'
    };
    return colors[priority] || 'border-l-gray-500';
  };

  const TaskCard = ({ task, isDraggable = true }) => (
    <div
      draggable={isDraggable}
      onDragStart={(e) => handleDragStart(e, task.id)}
      className={`bg-white rounded-lg border-l-4 ${getPriorityColor(task.priority)} p-4 shadow-sm hover:shadow-md transition-shadow cursor-move`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
        <div className="flex items-center space-x-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(task.type)}`}>
            {task.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/tasks/${task.id}`);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            title="Ver detalhes da tarefa"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">SP: {task.storyPoints}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{task.estimatedHours}h</span>
        </div>
        
        {task.assignee && (
          <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {task.assignee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planejamento de Sprints</h1>
          <p className="text-gray-600">Organize seu backlog e planeje sprints</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSprintModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nova Sprint</span>
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Layout de Planejamento - Vertical */}
      <div className="space-y-6">
        {/* Backlog */}
        <div 
          className="bg-gray-50 rounded-lg p-6"
          onDrop={(e) => handleDrop(e, null)}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Backlog</h2>
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {backlogTasks.length} tarefas
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {backlogTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            
            {backlogTasks.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p className="text-sm">Nenhuma tarefa no backlog</p>
                <p className="text-xs">Arraste tarefas aqui ou crie uma nova</p>
              </div>
            )}
          </div>
        </div>

        {/* Sprints */}
        {projectSprints.slice(0, 2).map(sprint => {
          const allSprintTasks = projectTasks.filter(task => task.sprintId === sprint.id);
          const sprintTasks = getLeafTasks(allSprintTasks); // Filtrar apenas tarefas folha
          const totalPoints = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
          const completedPoints = sprintTasks
            .filter(task => task.status === 'Done')
            .reduce((sum, task) => sum + (task.storyPoints || 0), 0);
          
          return (
            <div 
              key={sprint.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
              onDrop={(e) => handleDrop(e, sprint.id)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">{sprint.name}</h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    sprint.status === 'Active' ? 'bg-green-100 text-green-800' :
                    sprint.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {sprint.status === 'Active' ? 'Ativo' :
                     sprint.status === 'Completed' ? 'Concluído' : 'Planejamento'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{sprint.goal}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Período:</span>
                    <span className="font-medium">
                      {new Date(sprint.startDate).toLocaleDateString('pt-BR')} - {new Date(sprint.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Story Points:</span>
                    <span className="font-medium">{completedPoints}/{totalPoints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: totalPoints > 0 ? `${(completedPoints / totalPoints) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sprintTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {sprintTasks.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm">Sprint vazia</p>
                    <p className="text-xs">Arraste tarefas do backlog</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Nova Tarefa */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Tarefa</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o título da tarefa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Descreva a tarefa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Epic">Épico</option>
                    <option value="Feature">Feature</option>
                    <option value="User Story">História de Usuário</option>
                    <option value="Task">Tarefa</option>
                    <option value="Sub-task">Sub-tarefa</option>
                    <option value="Bug">Bug</option>
                    <option value="Improvement">Melhoria</option>
                    <option value="Research">Pesquisa</option>
                    <option value="Documentation">Documentação</option>
                    <option value="Test">Teste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Baixa</option>
                    <option value="Medium">Média</option>
                    <option value="High">Alta</option>
                    <option value="Critical">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarefa Pai (opcional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={parentSearch}
                    onChange={handleParentSearchChange}
                    onFocus={() => setShowParentResults(parentSearch.trim().length > 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o código ou nome da tarefa pai..."
                  />
                  {selectedParent && (
                    <button
                      type="button"
                      onClick={handleClearParent}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                  
                  {/* Dropdown de resultados */}
                  {showParentResults && filteredParentTasks.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredParentTasks.map(task => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => handleSelectParent(task)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{task.title}</div>
                              <div className="text-xs text-gray-500">
                                {task.id} • {task.type}
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${
                              task.type === 'Epic' ? 'bg-purple-100 text-purple-800' :
                              task.type === 'Feature' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.type}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Mensagem quando não há resultados */}
                  {showParentResults && parentSearch.trim() && filteredParentTasks.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                      <div className="text-sm text-gray-500 text-center">
                        Nenhuma tarefa encontrada para "{parentSearch}"
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedParent && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="text-sm font-medium text-blue-900">
                      Tarefa pai selecionada:
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedParent.title} ({selectedParent.type})
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  Pesquise por código (ex: PROJ-123) ou nome da tarefa para criar hierarquia (até 6 níveis)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Story Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newTask.storyPoints}
                    onChange={(e) => setNewTask({...newTask, storyPoints: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimativa (horas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Criar Tarefa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nova Sprint */}
      {showSprintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Sprint</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Sprint
                </label>
                <input
                  type="text"
                  value={newSprint.name}
                  onChange={(e) => setNewSprint({...newSprint, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Sprint 3 - Checkout"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objetivo da Sprint
                </label>
                <textarea
                  value={newSprint.goal}
                  onChange={(e) => setNewSprint({...newSprint, goal: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Descreva o objetivo principal desta sprint..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={newSprint.startDate}
                    onChange={(e) => setNewSprint({...newSprint, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    value={newSprint.endDate}
                    onChange={(e) => setNewSprint({...newSprint, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSprintModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddSprint}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Criar Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintPlanning;

