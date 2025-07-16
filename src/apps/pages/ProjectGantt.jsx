import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAppStore from '../../stores/appStore';
import { 
  defaultCalculationEngine, 
  DateCalculationEngine, 
  SCHEDULING_MODES,
  DependencyValidator 
} from '../../utils/dateCalculationEngine';
import DependencyModal from '../components/DependencyModal';
import DependencyDisplay from '../components/DependencyDisplay';
import { 
  ArrowLeftIcon, 
  MagnifyingGlassIcon, 
  ListBulletIcon, 
  ChartBarIcon,
  EllipsisVerticalIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  PlusIcon,
  MinusIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const ProjectGantt = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, updateTask, addTask, deleteTask, updateTasksOrder } = useAppStore();
  
  // Estados principais
  const [viewMode, setViewMode] = useState('gantt');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [collapsedTasks, setCollapsedTasks] = useState(new Set());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    tipo: true,
    status: true,
    responsavel: true,
    dataInicio: true,
    dataFim: true,
    duracao: true,
    prioridade: true,
    epico: true,
    sp: true,
    progresso: true,
    modoAgendamento: true,
    dependencias: true
  });
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });
  const [dependencyModalOpen, setDependencyModalOpen] = useState(false);
  const [selectedTaskForDependencies, setSelectedTaskForDependencies] = useState(null);
  
  // Estados para edição inline
  const [editingCell, setEditingCell] = useState(null); // { taskId, field }
  const [editingValue, setEditingValue] = useState('');

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(task => task.projectId === projectId);

  // Sincronizar rolagem horizontal entre topo e tabela
  useEffect(() => {
    if (viewMode === 'list') {
      const topScroll = document.getElementById('horizontal-scroll-top');
      const bottomScroll = document.getElementById('horizontal-scroll-bottom');
      
      if (topScroll && bottomScroll) {
        const syncScrollTop = () => {
          bottomScroll.scrollLeft = topScroll.scrollLeft;
        };
        
        const syncScrollBottom = () => {
          topScroll.scrollLeft = bottomScroll.scrollLeft;
        };
        
        topScroll.addEventListener('scroll', syncScrollTop);
        bottomScroll.addEventListener('scroll', syncScrollBottom);
        
        return () => {
          topScroll.removeEventListener('scroll', syncScrollTop);
          bottomScroll.removeEventListener('scroll', syncScrollBottom);
        };
      }
    }
  }, [viewMode]);

  // Configurações de zoom para o Gantt
  const zoomConfigs = {
    25: { unit: 'month', width: 60, label: 'Mês' },
    50: { unit: 'week', width: 80, label: 'Semana' },
    75: { unit: 'week', width: 120, label: 'Semana' },
    100: { unit: 'day', width: 40, label: 'Dia' },
    125: { unit: 'day', width: 60, label: 'Dia' },
    150: { unit: 'day', width: 80, label: 'Dia' }
  };

  const currentZoomConfig = zoomConfigs[zoomLevel] || zoomConfigs[100];

  // Gerar timeline baseada no zoom
  const generateTimeline = () => {
    const timeline = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    
    if (currentZoomConfig.unit === 'day') {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        timeline.push({
          date: new Date(d),
          label: `${d.getDate()}`,
          dayName: dayNames[d.getDay()],
          monthName: monthNames[d.getMonth()],
          fullLabel: `${dayNames[d.getDay()]} ${d.getDate()}/${monthNames[d.getMonth()]}`,
          width: currentZoomConfig.width,
          isWeekend: d.getDay() === 0 || d.getDay() === 6
        });
      }
    } else if (currentZoomConfig.unit === 'week') {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        const weekNumber = Math.ceil((d - startDate) / (7 * 24 * 60 * 60 * 1000));
        timeline.push({
          date: new Date(d),
          label: `S${weekNumber}`,
          width: currentZoomConfig.width
        });
      }
    } else if (currentZoomConfig.unit === 'month') {
      for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        timeline.push({
          date: new Date(d),
          label: d.toLocaleDateString('pt-BR', { month: 'short' }),
          width: currentZoomConfig.width
        });
      }
    }
    
    return timeline;
  };

  const timeline = generateTimeline();

  // Função para recálculo automático das tarefas
  const recalculateProjectDates = () => {
    try {
      // Data de início do projeto (primeira tarefa ou data padrão)
      const projectStartDate = project?.startDate || new Date('2024-01-01');
      
      // Cria uma cópia das tarefas para recálculo
      const tasksToCalculate = [...projectTasks];
      
      // Executa o cálculo automático
      const calculatedTasks = defaultCalculationEngine.scheduleProject(tasksToCalculate, projectStartDate);
      
      // Atualiza as tarefas no store se houve mudanças
      calculatedTasks.forEach(calculatedTask => {
        const originalTask = projectTasks.find(t => t.id === calculatedTask.id);
        if (originalTask && (
          originalTask.startDate !== calculatedTask.startDate ||
          originalTask.endDate !== calculatedTask.endDate ||
          originalTask.duration !== calculatedTask.duration
        )) {
          updateTask(calculatedTask.id, {
            startDate: calculatedTask.startDate,
            endDate: calculatedTask.endDate,
            duration: calculatedTask.duration,
            work: calculatedTask.work
          });
        }
      });
      
      console.log('✅ Recálculo automático executado com sucesso');
    } catch (error) {
      console.error('❌ Erro no recálculo automático:', error);
    }
  };

  // Função para adicionar botão de recálculo manual
  const handleManualRecalculation = () => {
    recalculateProjectDates();
  };

  // Funções para gerenciar dependências
  const handleEditDependencies = (task) => {
    setSelectedTaskForDependencies(task);
    setDependencyModalOpen(true);
  };

  const handleSaveDependencies = (dependencies) => {
    if (selectedTaskForDependencies) {
      updateTask(selectedTaskForDependencies.id, {
        predecessors: dependencies
      });
      setDependencyModalOpen(false);
      setSelectedTaskForDependencies(null);
      
      // Executa recálculo automático após salvar dependências
      setTimeout(() => {
        recalculateProjectDates();
      }, 100);
    }
  };

  const handleCloseDependencyModal = () => {
    setDependencyModalOpen(false);
    setSelectedTaskForDependencies(null);
  };

  // Funções para edição inline
  const startEditing = (taskId, field, currentValue) => {
    setEditingCell({ taskId, field });
    setEditingValue(currentValue || '');
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  const saveEdit = () => {
    if (editingCell && editingValue.trim()) {
      updateTask(editingCell.taskId, {
        [editingCell.field]: editingValue.trim()
      });
    }
    cancelEditing();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Executa recálculo automático quando as dependências das tarefas mudam
  useEffect(() => {
    if (projectTasks.length > 0) {
      // Verifica se alguma tarefa tem predecessoras e está em modo automático
      const hasAutomaticTasksWithPredecessors = projectTasks.some(task => 
        task.predecessors && task.predecessors.length > 0 && 
        task.schedulingMode === 'automatic'
      );
      
      // Verifica se há tarefas em modo automático que precisam de recálculo
      const hasAutomaticTasks = projectTasks.some(task => 
        task.schedulingMode === 'automatic'
      );
      
      if (hasAutomaticTasksWithPredecessors || hasAutomaticTasks) {
        // Executa recálculo com um pequeno delay para evitar múltiplas execuções
        const timeoutId = setTimeout(() => {
          recalculateProjectDates();
        }, 500);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [
    projectTasks.length, 
    projectTasks.map(t => t.predecessors).join(','),
    projectTasks.map(t => t.schedulingMode).join(','),
    projectTasks.map(t => `${t.startDate}-${t.endDate}-${t.duration}`).join(',')
  ]);

  // Filtrar tarefas
  const filteredTasks = projectTasks.filter(task => {
    const matchesSearch = !searchTerm || (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesType = !filters.type || task.type === filters.type;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Função para calcular posição da tarefa no Gantt
  const getTaskPosition = (task) => {
    if (!task.startDate) return { left: 0, width: 0 };
    
    const taskStart = new Date(task.startDate);
    const taskEnd = task.endDate ? new Date(task.endDate) : new Date(taskStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const timelineStart = timeline[0]?.date || new Date('2024-01-01');
    
    let position = 0;
    let pixelPosition = 0;
    
    if (currentZoomConfig.unit === 'day') {
      const diffTime = taskStart.getTime() - timelineStart.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      position = Math.max(0, Math.min(diffDays, timeline.length - 1));
    } else if (currentZoomConfig.unit === 'week') {
      const diffTime = taskStart.getTime() - timelineStart.getTime();
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      position = Math.max(0, Math.min(diffWeeks, timeline.length - 1));
    } else if (currentZoomConfig.unit === 'month') {
      const diffMonths = (taskStart.getFullYear() - timelineStart.getFullYear()) * 12 + 
                        (taskStart.getMonth() - timelineStart.getMonth());
      position = Math.max(0, Math.min(diffMonths, timeline.length - 1));
    }
    
    for (let i = 0; i < position; i++) {
      pixelPosition += timeline[i]?.width || currentZoomConfig.width;
    }
    
    const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
    const width = Math.max(20, duration * (currentZoomConfig.width / (currentZoomConfig.unit === 'day' ? 1 : currentZoomConfig.unit === 'week' ? 7 : 30)));
    
    return { left: pixelPosition, width };
  };

  // Funções para indentação de tarefas
  const indentTask = (taskId) => {
    const task = projectTasks.find(t => t.id === taskId);
    if (task && task.level < 3) {
      updateTask(taskId, { level: (task.level || 0) + 1 });
    }
  };

  const unindentTask = (taskId) => {
    const task = projectTasks.find(t => t.id === taskId);
    if (task && task.level > 0) {
      updateTask(taskId, { level: Math.max(0, (task.level || 0) - 1) });
    }
  };

  // Função para adicionar nova tarefa rapidamente
  const addNewTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `${project.acronym}-${projectTasks.length + 1}`,
        title: newTaskTitle.trim(),
        type: 'Task',
        status: 'A Fazer',
        assignee: 'Carlos Santos',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        duration: 7,
        priority: 'Média',
        epic: '',
        storyPoints: 0,
        progress: 0,
        level: 0,
        projectId: projectId,
        schedulingMode: 'automatic',
        dependencies: []
      };
      
      // Adicionar tarefa ao store
      addTask(newTask);
      
      setNewTaskTitle('');
      setShowNewTaskInput(false);
    }
  };

  // Função para remover tarefa
  const removeTask = (taskId) => {
    deleteTask(taskId);
  };

  // Função para alternar colapso de tarefas
  const toggleTaskCollapse = (taskId) => {
    const newCollapsed = new Set(collapsedTasks);
    if (newCollapsed.has(taskId)) {
      newCollapsed.delete(taskId);
    } else {
      newCollapsed.add(taskId);
    }
    setCollapsedTasks(newCollapsed);
  };

  // Função para verificar se uma tarefa tem filhas
  const hasChildTasks = (taskId) => {
    const taskIndex = projectTasks.findIndex(t => t.id === taskId);
    const task = projectTasks[taskIndex];
    if (!task) return false;
    
    const nextTask = projectTasks[taskIndex + 1];
    return nextTask && nextTask.level > task.level;
  };

  // Função para filtrar tarefas considerando colapso
  const getVisibleTasks = (tasks) => {
    const visibleTasks = [];
    let skipLevel = null;
    
    for (const task of tasks) {
      if (skipLevel !== null && task.level > skipLevel) {
        continue; // Pular tarefas filhas de tarefas colapsadas
      }
      
      if (skipLevel !== null && task.level <= skipLevel) {
        skipLevel = null; // Resetar quando sair do nível colapsado
      }
      
      visibleTasks.push(task);
      
      if (collapsedTasks.has(task.id) && hasChildTasks(task.id)) {
        skipLevel = task.level; // Começar a pular tarefas filhas
      }
    }
    
    return visibleTasks;
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h2>
          <p className="text-gray-600 mb-4">O projeto solicitado não existe ou foi removido.</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar aos Projetos
          </button>
        </div>
      </div>
    );
  }

  // Renderizar visão lista simplificada
  const renderListView = () => {
    try {
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Lista de Tarefas</h2>
                  <p className="text-xs text-gray-600 mt-1">
                    {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} encontrada{filteredTasks.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Busca */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar tarefas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Filtros Avançados */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title="Filtros avançados"
                  >
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleManualRecalculation}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Recalcular datas automaticamente"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowColumnConfig(!showColumnConfig)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Configurar colunas"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Configuração de colunas */}
              {showColumnConfig && (
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                  <h3 className="text-xs font-medium text-blue-900 mb-3">Configurar Colunas Visíveis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries({
                      tipo: 'Tipo',
                      status: 'Status',
                      responsavel: 'Responsável',
                      dataInicio: 'Data Início',
                      dataFim: 'Data Fim',
                      duracao: 'Duração',
                      prioridade: 'Prioridade',
                      epico: 'Épico',
                      sp: 'SP',
                      progresso: 'Progresso',
                      modoAgendamento: 'Modo Agendamento',
                      dependencias: 'Dependências'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={visibleColumns[key]}
                          onChange={(e) => setVisibleColumns(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Filtros avançados */}
              {showFilters && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Filtros Avançados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Todos</option>
                        <option value="A Fazer">A Fazer</option>
                        <option value="Em Progresso">Em Progresso</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Todos</option>
                        <option value="Epic">Epic</option>
                        <option value="Story">Story</option>
                        <option value="Task">Task</option>
                        <option value="Bug">Bug</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => setFilters({ status: '', type: '' })}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        Limpar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Input para nova tarefa - REMOVIDO */}
              
              {/* Rolagem horizontal no topo */}
              <div className="mb-4">
                <div className="flex">
                  {/* Espaço para colunas fixas */}
                  <div className="flex-shrink-0" style={{ width: '510px' }}></div>
                  {/* Barra de rolagem horizontal */}
                  <div className="flex-1 overflow-x-auto" id="horizontal-scroll-top">
                    <div style={{ width: '1200px', height: '1px' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Container da tabela com rolagem horizontal avançada */}
              <div className="gantt-table-container flex border border-gray-200 rounded-lg overflow-hidden">
                {/* Colunas fixas à esquerda */}
                <div className="flex-shrink-0 bg-white" style={{ width: '510px' }}>
                  <div>
                    <table className="gantt-task-table w-full table-fixed">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>Ações</th>
                          <th className="px-0 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '80px' }}>ID</th>
                          <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '310px' }}>Nome da Tarefa</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {getVisibleTasks(filteredTasks).map((task) => (
                          <tr key={task.id} className="gantt-task-row hover:bg-gray-50" style={{ height: '42px' }}>
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <div className="flex justify-center space-x-1">
                                <button
                                  onClick={() => navigate(`/projects/tasks/${task.id}`)}
                                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                  title="Visualizar tarefa"
                                >
                                  <EyeIcon className="w-2 h-2" />
                                </button>
                                <button
                                  onClick={() => indentTask(task.id)}
                                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                                  title="Indentar tarefa"
                                  disabled={task.level >= 3}
                                >
                                  <ChevronRightIcon className="w-2 h-2" />
                                </button>
                                <button
                                  onClick={() => unindentTask(task.id)}
                                  className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded transition-colors"
                                  title="Desindentar tarefa"
                                  disabled={task.level <= 0}
                                >
                                  <ChevronLeftIcon className="w-2 h-2" />
                                </button>
                                <button
                                  onClick={() => removeTask(task.id)}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                  title="Remover tarefa"
                                >
                                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="px-0 py-1 whitespace-nowrap text-left align-middle" style={{ height: '32px' }}>
                              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {task.id || '-'}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-left align-middle overflow-hidden" style={{ height: '32px' }}>
                              <div className="flex items-center h-full">
                                <div 
                                  style={{ 
                                    marginLeft: `${(task.level || 0) * 50}px`,
                                    paddingLeft: `${(task.level || 0) * 15}px`
                                  }} 
                                  className="flex items-center w-full"
                                >
                                  {/* Seta de colapsar (apenas se tem filhas) */}
                                  {hasChildTasks(task.id) && (
                                    <button
                                      onClick={() => toggleTaskCollapse(task.id)}
                                      className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                                      title={collapsedTasks.has(task.id) ? "Expandir" : "Recolher"}
                                    >
                                      {collapsedTasks.has(task.id) ? (
                                        <ChevronRightIcon className="w-2 h-2 text-gray-500" />
                                      ) : (
                                        <ChevronDownIcon className="w-2 h-2 text-gray-500" />
                                      )}
                                    </button>
                                  )}
                                  {task.level > 0 && (
                                    <span className="text-gray-400 mr-2 flex-shrink-0 font-mono">└─</span>
                                  )}
                                  <span className={`${task.level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'} truncate`}>
                                    {editingCell?.taskId === task.id && editingCell?.field === 'title' ? (
                                      <input
                                        type="text"
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        onBlur={saveEdit}
                                        className="w-full px-1 py-0 text-xs border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                                        autoFocus
                                      />
                                    ) : (
                                      <span 
                                        onClick={() => startEditing(task.id, 'title', task.title)}
                                        className="cursor-pointer hover:bg-gray-100 px-1 py-0 rounded"
                                        title="Clique para editar"
                                      >
                                        {task.title || 'Sem título'}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Linha de inserção rápida */}
                        {showNewTaskInput ? (
                          <tr className="gantt-task-row bg-green-50 border-t-2 border-green-200" style={{ height: '26px' }}>
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle">
                              <div className="flex justify-center space-x-1">
                                <button
                                  onClick={addNewTask}
                                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                                  title="Salvar tarefa"
                                >
                                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setShowNewTaskInput(false);
                                    setNewTaskTitle('');
                                  }}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                                  title="Cancelar"
                                >
                                  <XMarkIcon className="w-2 h-2" />
                                </button>
                              </div>
                            </td>
                            <td className="px-0 py-1 whitespace-nowrap text-left align-middle">
                              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                {project.acronym}-{projectTasks.length + 1}
                              </span>
                            </td>
                            <td className="px-3 py-1 text-left align-middle">
                              <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Digite o nome da nova tarefa..."
                                className="w-full px-2 py-1 text-xs border border-green-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
                                autoFocus
                              />
                            </td>
                          </tr>
                        ) : (
                          <tr className="gantt-task-row hover:bg-gray-50" style={{ height: '26px' }}>
                            <td colSpan="3" className="px-3 py-1 text-center align-middle">
                              <button
                                onClick={() => setShowNewTaskInput(true)}
                                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1 rounded transition-colors flex items-center justify-center w-full"
                              >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Adicionar nova tarefa...
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Colunas com rolagem horizontal */}
                <div className="flex-1 overflow-x-auto bg-white" id="horizontal-scroll-bottom">
                  <table className="gantt-task-table w-full table-fixed" style={{ minWidth: '1200px' }}>
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        {visibleColumns.tipo && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '80px' }}>Tipo</th>}
                        {visibleColumns.status && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>Status</th>}
                        {visibleColumns.responsavel && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '60px' }}>Resp.</th>}
                        {visibleColumns.dataInicio && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '90px' }}>Início</th>}
                        {visibleColumns.dataFim && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '90px' }}>Fim</th>}
                        {visibleColumns.duracao && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '80px' }}>Duração</th>}
                        {visibleColumns.prioridade && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '90px' }}>Prioridade</th>}
                        {visibleColumns.epico && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>Épico</th>}
                        {visibleColumns.sp && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '60px' }}>SP</th>}
                        {visibleColumns.progresso && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>Progresso</th>}
                        {visibleColumns.modoAgendamento && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>Modo</th>}
                        {visibleColumns.dependencias && <th className="px-0 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>Dependências</th>}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {getVisibleTasks(filteredTasks).map((task) => (
                        <tr key={task.id} className="gantt-task-row hover:bg-gray-50" style={{ height: '42px' }}>
                          {visibleColumns.tipo && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              {editingCell?.taskId === task.id && editingCell?.field === 'type' ? (
                                <select
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onBlur={saveEdit}
                                  onKeyDown={handleKeyPress}
                                  className="text-xs px-2 py-1 border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  autoFocus
                                >
                                  <option value="Task">Task</option>
                                  <option value="Story">Story</option>
                                  <option value="Epic">Epic</option>
                                  <option value="Bug">Bug</option>
                                </select>
                              ) : (
                                <span 
                                  onClick={() => startEditing(task.id, 'type', task.type)}
                                  className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    task.type === 'Epic' ? 'bg-purple-100 text-purple-800' :
                                    task.type === 'Story' ? 'bg-blue-100 text-blue-800' :
                                    task.type === 'Task' ? 'bg-green-100 text-green-800' :
                                    task.type === 'Bug' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                  title="Clique para editar"
                                >
                                  {task.type || 'Task'}
                                </span>
                              )}
                            </td>
                          )}
                          {visibleColumns.status && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              {editingCell?.taskId === task.id && editingCell?.field === 'status' ? (
                                <select
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onBlur={saveEdit}
                                  onKeyDown={handleKeyPress}
                                  className="text-xs px-2 py-1 border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  autoFocus
                                >
                                  <option value="A Fazer">A Fazer</option>
                                  <option value="Em Progresso">Em Progresso</option>
                                  <option value="Concluído">Concluído</option>
                                </select>
                              ) : (
                                <span 
                                  onClick={() => startEditing(task.id, 'status', task.status)}
                                  className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    task.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                                    task.status === 'Em Progresso' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}
                                  title="Clique para editar"
                                >
                                  {task.status || 'A Fazer'}
                                </span>
                              )}
                            </td>
                          )}
                          {visibleColumns.responsavel && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              {task.assignee ? (
                                <div className="flex items-center justify-center">
                                  <div 
                                    className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs cursor-help"
                                    title={typeof task.assignee === 'string' ? task.assignee : task.assignee.name || 'Usuário'}
                                  >
                                    {typeof task.assignee === 'string' ? task.assignee.charAt(0).toUpperCase() : 
                                     task.assignee.name ? task.assignee.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                          )}
                          {visibleColumns.dataInicio && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <span className="text-xs">
                                {task.startDate ? new Date(task.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '-'}
                              </span>
                            </td>
                          )}
                          {visibleColumns.dataFim && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <span className="text-xs">
                                {task.endDate ? new Date(task.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '-'}
                              </span>
                            </td>
                          )}
                          {visibleColumns.duracao && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <span className="text-xs font-medium">
                                {task.duration ? `${task.duration}d` : '-'}
                              </span>
                            </td>
                          )}
                          {visibleColumns.prioridade && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <div className="flex items-center justify-center">
                                {editingCell?.taskId === task.id && editingCell?.field === 'priority' ? (
                                  <select
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={saveEdit}
                                    onKeyDown={handleKeyPress}
                                    className="text-xs px-2 py-1 border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                  >
                                    <option value="Baixa">Baixa</option>
                                    <option value="Média">Média</option>
                                    <option value="Alta">Alta</option>
                                  </select>
                                ) : (
                                  <div 
                                    onClick={() => startEditing(task.id, 'priority', task.priority)}
                                    className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                    title="Clique para editar"
                                  >
                                    {task.priority === 'Alta' ? (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-medium text-red-700">Alta</span>
                                  </div>
                                ) : task.priority === 'Média' ? (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-medium text-yellow-700">Média</span>
                                  </div>
                                ) : task.priority === 'Baixa' ? (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-medium text-green-700">Baixa</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">-</span>
                                )}
                                  </div>
                                )}
                              </div>
                            </td>
                          )}
                          {visibleColumns.epico && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <span className="text-xs text-purple-600 font-medium truncate max-w-24">
                                {task.epic || '-'}
                              </span>
                            </td>
                          )}
                          {visibleColumns.sp && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {task.storyPoints || '-'}
                              </span>
                            </td>
                          )}
                          {visibleColumns.progresso && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <div className="flex items-center justify-center">
                                <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${task.progress || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600 min-w-[30px]">{task.progress || 0}%</span>
                              </div>
                            </td>
                          )}
                          {visibleColumns.modoAgendamento && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <select
                                value={task.schedulingMode || 'automatic'}
                                onChange={(e) => updateTask(task.id, { schedulingMode: e.target.value })}
                                className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="automatic">Auto</option>
                                <option value="manual">Manual</option>
                              </select>
                            </td>
                          )}
                          {visibleColumns.dependencias && (
                            <td className="px-0 py-1 whitespace-nowrap text-center align-middle" style={{ height: '32px' }}>
                              <DependencyDisplay
                                task={task}
                                allTasks={projectTasks}
                                onEditDependencies={handleEditDependencies}
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                      
                      {/* Linha de inserção rápida - tabela direita */}
                      {showNewTaskInput ? (
                        <tr className="gantt-task-row bg-green-50 border-t-2 border-green-200" style={{ height: '26px' }}>
                          {visibleColumns.tipo && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">Task</span></td>}
                          {visibleColumns.status && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">A Fazer</span></td>}
                          {visibleColumns.responsavel && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">-</span></td>}
                          {visibleColumns.dataInicio && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">-</span></td>}
                          {visibleColumns.dataFim && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">-</span></td>}
                          {visibleColumns.duracao && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">-</span></td>}
                          {visibleColumns.prioridade && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">Média</span></td>}
                          {visibleColumns.epico && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">-</span></td>}
                          {visibleColumns.sp && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">0</span></td>}
                          {visibleColumns.progresso && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">0%</span></td>}
                          {visibleColumns.modoAgendamento && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">Auto</span></td>}
                          {visibleColumns.dependencias && <td className="px-0 py-1 text-center align-middle"><span className="text-xs text-gray-400">-</span></td>}
                        </tr>
                      ) : (
                        <tr className="gantt-task-row hover:bg-gray-50" style={{ height: '26px' }}>
                          <td colSpan="12" className="px-3 py-1 text-center align-middle">
                            <span className="text-xs text-gray-400">Nova tarefa será adicionada aqui...</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Erro na renderização da lista:', error);
      return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Erro na renderização da lista</h3>
            <p className="text-red-600 text-xs mt-1">
              Erro: {error.message}
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-xs text-gray-600">{project.description}</p>
              
              {/* Informações Gerais do Projeto */}
              <div className="flex items-center space-x-2 mt-2">
                {/* Início do Projeto */}
                {project.startDate && (
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                    <svg className="w-3 h-3 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Início: {project.startDate instanceof Date ? project.startDate.toLocaleDateString('pt-BR') : new Date(project.startDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                
                {/* Fim do Projeto */}
                {project.endDate && (
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                    <svg className="w-3 h-3 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Fim: {project.endDate instanceof Date ? project.endDate.toLocaleDateString('pt-BR') : new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                
                {/* Owner/Manager do Projeto */}
                {project.manager && (
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                    <svg className="w-3 h-3 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Owner: {typeof project.manager === 'string' ? project.manager : project.manager.name || 'Não definido'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Alternância Lista/Gantt */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visão Lista"
              >
                <ListBulletIcon className="w-2 h-2" />
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'gantt'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visão Gantt"
              >
                <ChartBarIcon className="w-2 h-2" />
              </button>
            </div>

            {/* Controles de zoom (apenas no Gantt) */}
            {viewMode === 'gantt' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={zoomLevel <= 25}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-600 min-w-[60px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={zoomLevel >= 150}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'list' ? (
          renderListView()
        ) : (
          // Visão Gantt
          <div className="h-full flex">
            {/* Lista de tarefas à esquerda */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
              <div className="px-4 border-b border-gray-200 bg-gray-50 flex items-center" style={{ height: '48px' }}>
                <h3 className="text-xs font-medium text-gray-900">Tarefas</h3>
              </div>
              <div className="flex-1 overflow-auto">
                {getVisibleTasks(filteredTasks).map((task, index) => {
                  const position = getTaskPosition(task);
                  return (
                    <div
                      key={task.id}
                      className="flex items-center px-4 py-2 border-b border-gray-100 hover:bg-gray-50"
                      style={{ height: '36px' }}
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <div 
                          style={{ 
                            marginLeft: `${(task.level || 0) * 20}px`,
                            paddingLeft: `${(task.level || 0) * 4}px`
                          }} 
                          className="flex items-center"
                        >
                          {hasChildTasks(task.id) && (
                            <button
                              onClick={() => toggleTaskCollapse(task.id)}
                              className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                              title={collapsedTasks.has(task.id) ? "Expandir" : "Recolher"}
                            >
                              {collapsedTasks.has(task.id) ? (
                                <ChevronRightIcon className="w-2 h-2 text-gray-500" />
                              ) : (
                                <ChevronDownIcon className="w-2 h-2 text-gray-500" />
                              )}
                            </button>
                          )}
                          {task.level > 0 && (
                            <span className="text-gray-400 mr-2">└─</span>
                          )}
                          <span className={`text-xs ${task.level === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {task.title || 'Sem título'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => navigate(`/projects/tasks/${task.id}`)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                          title="Visualizar tarefa"
                        >
                          <EyeIcon className="w-2 h-2" />
                        </button>
                        <button
                          onClick={() => indentTask(task.id)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                          title="Indentar tarefa"
                          disabled={task.level >= 3}
                        >
                          <ChevronRightIcon className="w-2 h-2" />
                        </button>
                        <button
                          onClick={() => unindentTask(task.id)}
                          className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded transition-colors"
                          title="Desindentar tarefa"
                          disabled={task.level <= 0}
                        >
                          <ChevronLeftIcon className="w-2 h-2" />
                        </button>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                          title="Remover tarefa"
                        >
                          <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline do Gantt */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Cabeçalho da timeline fixo */}
              <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0" style={{ height: '48px' }}>
                <div 
                  id="timeline-header"
                  className="overflow-x-auto overflow-y-hidden h-full"
                  style={{ 
                    maxWidth: 'calc(100vw - 384px)',
                    minWidth: '400px'
                  }}
                  onScroll={(e) => {
                    const ganttContainer = document.getElementById('gantt-container');
                    if (ganttContainer) {
                      ganttContainer.scrollLeft = e.target.scrollLeft;
                    }
                  }}
                >
                  <div className="flex h-full items-center" style={{ width: `${timeline.reduce((acc, item) => acc + item.width, 0)}px` }}>
                    {timeline.map((period, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center text-xs font-medium border-r border-gray-200 ${
                          period.isWeekend ? 'bg-gray-100 text-gray-500' : 'text-gray-700'
                        }`}
                        style={{ width: `${period.width}px`, height: '100%', padding: '2px' }}
                        title={period.fullLabel || period.label}
                      >
                        {period.dayName && (
                          <div className="text-xs text-gray-500 leading-tight">{period.dayName}</div>
                        )}
                        <div className="font-semibold leading-tight">{period.label}</div>
                        {period.monthName && (
                          <div className="text-xs text-gray-500 leading-tight">{period.monthName}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Área das barras do Gantt */}
              <div className="flex-1 overflow-auto">
                <div 
                  id="gantt-container"
                  className="overflow-auto h-full"
                  style={{ 
                    maxWidth: 'calc(100vw - 384px)',
                    minWidth: '400px'
                  }}
                  onScroll={(e) => {
                    const timelineHeader = document.getElementById('timeline-header');
                    if (timelineHeader && e.target.scrollLeft !== timelineHeader.scrollLeft) {
                      timelineHeader.scrollLeft = e.target.scrollLeft;
                    }
                  }}
                >
                  <div style={{ width: `${timeline.reduce((acc, item) => acc + item.width, 0)}px`, height: `${filteredTasks.length * 36}px` }}>
                    {filteredTasks.map((task, index) => {
                      const position = getTaskPosition(task);
                      return (
                        <div
                          key={task.id}
                          className="relative border-b border-gray-100"
                          style={{ height: '36px' }}
                        >
                          {/* Linha de fundo */}
                          <div className="absolute inset-0 flex">
                            {timeline.map((period, periodIndex) => (
                              <div
                                key={periodIndex}
                                className={`border-r border-gray-200 ${
                                  period.isWeekend ? 'bg-gray-50' : 'bg-white'
                                }`}
                                style={{ width: `${period.width}px` }}
                              />
                            ))}
                          </div>
                          
                          {/* Barra da tarefa */}
                          {position.width > 0 && (
                            <div
                              className={`absolute top-1 h-8 rounded flex items-center px-2 text-white text-xs font-medium ${
                                task.status === 'Concluído' ? 'bg-green-500' :
                                task.status === 'Em Progresso' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}
                              style={{
                                left: `${position.left}px`,
                                width: `${position.width}px`
                              }}
                              title={`${task.title || 'Sem título'} (${task.status || 'A Fazer'})`}
                            >
                              <span className="truncate">{task.title || 'Sem título'}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Dependências */}
      <DependencyModal
        isOpen={dependencyModalOpen}
        onClose={handleCloseDependencyModal}
        task={selectedTaskForDependencies}
        allTasks={projectTasks}
        onSave={handleSaveDependencies}
      />
    </div>
  );
};

export default ProjectGantt;

