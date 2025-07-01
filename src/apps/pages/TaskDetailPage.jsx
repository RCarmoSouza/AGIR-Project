import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  DocumentTextIcon,
  CalendarIcon,
  LinkIcon,
  ListBulletIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  PlusIcon,
  XMarkIcon,
  UserIcon,
  FlagIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  BookmarkIcon,
  ShareIcon,
  PrinterIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  Bars3Icon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  FlagIcon as FlagIconSolid,
  CalendarIcon as CalendarIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';
import useAppStore from '../../stores/appStore';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, projects, updateTask } = useAppStore();

  const [editedTask, setEditedTask] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    description: true,
    subtasks: false,
    related: true,
    attachments: true,
    comments: false
  });
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [sortSubtasks, setSortSubtasks] = useState('name');
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Encontrar a tarefa
  const task = tasks.find(t => t.id === taskId);
  const project = task ? projects.find(p => p.id === task.projectId) : null;

  useEffect(() => {
    if (task && !editedTask) {
      setEditedTask({ ...task });
      // Simular alguns anexos para demonstração
      setAttachments([
        { id: 1, name: 'wireframe_login.pdf', size: '2.3 MB', type: 'pdf', uploadedAt: '2024-01-20' },
        { id: 2, name: 'mockup_interface.png', size: '1.8 MB', type: 'image', uploadedAt: '2024-01-22' }
      ]);
    }
  }, [task, editedTask]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!task || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tarefa não encontrada</h2>
          <p className="text-gray-600 mb-4">A tarefa solicitada não existe ou foi removida.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Função para converter Date para string no formato YYYY-MM-DD
  const formatDateForInput = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }
    return '';
  };

  // Função para converter string de data para Date object
  const parseInputDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  const handleFieldChange = (field, value) => {
    let processedValue = value;
    
    // Converter datas de string para Date object
    if (field === 'startDate' || field === 'endDate') {
      processedValue = parseInputDate(value);
    }
    
    const updatedTask = { ...editedTask, [field]: processedValue };
    setEditedTask(updatedTask);
    // Salvar automaticamente após pequeno delay
    setTimeout(() => {
      updateTask(taskId, updatedTask);
    }, 500);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'Ana Silva',
        content: newComment,
        timestamp: new Date().toISOString(),
        type: 'comment'
      };
      
      const updatedComments = [...(editedTask.comments || []), comment];
      const updatedTask = { ...editedTask, comments: updatedComments };
      setEditedTask(updatedTask);
      updateTask(taskId, updatedTask);
      setNewComment('');
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'file',
      uploadedAt: new Date().toISOString().split('T')[0],
      file: file
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Funcionalidades do menu de opções
  const handleDuplicateTask = () => {
    const duplicatedTask = {
      ...editedTask,
      id: `${editedTask.id}-COPY`,
      title: `${editedTask.title} (Cópia)`,
      status: 'A Fazer',
      progress: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    // Adicionar a tarefa duplicada ao store
    const { addTask } = useAppStore.getState();
    addTask(duplicatedTask);
    
    setShowMoreOptions(false);
    alert('Tarefa duplicada com sucesso!');
  };

  const handleMoveTask = () => {
    setShowMoveModal(true);
    setShowMoreOptions(false);
  };

  const handleShareTask = () => {
    setShowShareModal(true);
    setShowMoreOptions(false);
  };

  const handlePrintTask = () => {
    window.print();
    setShowMoreOptions(false);
  };

  const handleDeleteTask = () => {
    setShowDeleteModal(true);
    setShowMoreOptions(false);
  };

  const confirmMoveTask = (targetProjectId) => {
    const updatedTask = { ...editedTask, projectId: targetProjectId };
    updateTask(taskId, updatedTask);
    setEditedTask(updatedTask);
    setShowMoveModal(false);
    alert('Tarefa movida com sucesso!');
  };

  const confirmDeleteTask = () => {
    const { deleteTask } = useAppStore.getState();
    deleteTask(taskId);
    setShowDeleteModal(false);
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'há poucos minutos';
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Concluído':
        return <CheckCircleIconSolid className="w-5 h-5 text-green-500" />;
      case 'Em Progresso':
        return <ClockIconSolid className="w-5 h-5 text-blue-500" />;
      case 'Bloqueado':
        return <ExclamationTriangleIconSolid className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Progresso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Bloqueado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical':
        return <FlagIconSolid className="w-4 h-4 text-red-500" />;
      case 'High':
        return <FlagIconSolid className="w-4 h-4 text-orange-500" />;
      case 'Medium':
        return <FlagIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <FlagIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const CollapsibleSection = ({ id, title, icon: Icon, children, count = null }) => {
    const isCollapsed = collapsedSections[id];

    return (
      <div className="border-b border-gray-200 pb-6 mb-6">
        <button
          onClick={() => toggleSection(id)}
          className="flex items-center w-full text-left mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-500 mr-2" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500 mr-2" />
          )}
          <Icon className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {count !== null && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
              {count}
            </span>
          )}
        </button>
        {!isCollapsed && (
          <div className="ml-9">
            {children}
          </div>
        )}
      </div>
    );
  };

  const EditableField = ({ label, value, onChange, type = 'text', options = null, placeholder = '', className = '', icon = null }) => {
    if (type === 'select' && options) {
      return (
        <div className={className}>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            {icon && <span className="mr-2">{icon}</span>}
            {label}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className={className}>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            {icon && <span className="mr-2">{icon}</span>}
            {label}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            placeholder={placeholder}
          />
        </div>
      );
    }

    return (
      <div className={className}>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </label>
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
            type === 'date' && isOverdue(value) ? 'border-red-300 bg-red-50' : ''
          }`}
          placeholder={placeholder}
          min={type === 'number' ? 0 : undefined}
        />
        {type === 'date' && isOverdue(value) && (
          <p className="text-xs text-red-600 mt-1">⚠️ Data vencida</p>
        )}
      </div>
    );
  };

  if (!editedTask) return null;

  // Simular subtarefas para demonstração
  const subtasks = [
    { id: 'SEC-1-1', title: 'Criar wireframes da tela de login', status: 'Concluído', assignee: 'João Silva', progress: 100 },
    { id: 'SEC-1-2', title: 'Implementar validação de formulário', status: 'Em Progresso', assignee: 'Maria Santos', progress: 60 },
    { id: 'SEC-1-3', title: 'Testes de integração', status: 'A Fazer', assignee: 'Pedro Costa', progress: 0 }
  ];

  const sortedSubtasks = [...subtasks].sort((a, b) => {
    switch (sortSubtasks) {
      case 'status':
        return a.status.localeCompare(b.status);
      case 'assignee':
        return a.assignee.localeCompare(b.assignee);
      case 'progress':
        return b.progress - a.progress;
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const relatedTasks = [
    { id: 'SEC-2', title: 'Sistema de recuperação de senha', status: 'Em Progresso', type: 'predecessor' },
    { id: 'SEC-4', title: 'Dashboard do usuário', status: 'A Fazer', type: 'successor' }
  ];

  const sidebarContent = (
    <div className="space-y-4">
      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-xs font-semibold text-gray-900 mb-2">Ações Rápidas</h3>
        <div className="space-y-1.5">
          <button className="w-full flex items-center justify-center px-2 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
            <UserIconSolid className="w-3 h-3 mr-1.5" />
            Atribuir a Mim
          </button>
          <button className="w-full flex items-center justify-center px-2 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
            <PlusIcon className="w-3 h-3 mr-1.5" />
            Criar Subtarefa
          </button>
          <button className="w-full flex items-center justify-center px-2 py-1.5 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105">
            <BookmarkIcon className="w-3 h-3 mr-1.5" />
            Marcar como Importante
          </button>
        </div>
      </div>

      {/* Detalhes */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Detalhes</h3>
        <div className="space-y-3">
          
          <EditableField
            label="Status"
            value={editedTask.status}
            onChange={(value) => handleFieldChange('status', value)}
            type="select"
            icon={getStatusIcon(editedTask.status)}
            options={[
              { value: 'A Fazer', label: 'A Fazer' },
              { value: 'Em Progresso', label: 'Em Progresso' },
              { value: 'Bloqueado', label: 'Bloqueado' },
              { value: 'Concluído', label: 'Concluído' }
            ]}
          />

          <EditableField
            label="Prioridade"
            value={editedTask.priority}
            onChange={(value) => handleFieldChange('priority', value)}
            type="select"
            icon={getPriorityIcon(editedTask.priority)}
            options={[
              { value: 'Low', label: 'Baixa' },
              { value: 'Medium', label: 'Média' },
              { value: 'High', label: 'Alta' },
              { value: 'Critical', label: 'Crítica' }
            ]}
          />

          <EditableField
            label="Tipo"
            value={editedTask.type}
            onChange={(value) => handleFieldChange('type', value)}
            type="select"
            icon={<DocumentTextIcon className="w-3 h-3 text-gray-500" />}
            options={[
              { value: 'Epic', label: 'Epic' },
              { value: 'Feature', label: 'Feature' },
              { value: 'User Story', label: 'User Story' },
              { value: 'Task', label: 'Task' },
              { value: 'Bug', label: 'Bug' }
            ]}
          />

          <EditableField
            label="Data de Início"
            value={formatDateForInput(editedTask.startDate)}
            onChange={(value) => handleFieldChange('startDate', value)}
            type="date"
            icon={<CalendarIconSolid className="w-4 h-4 text-gray-500" />}
          />

          <EditableField
            label="Data de Fim"
            value={formatDateForInput(editedTask.endDate)}
            onChange={(value) => handleFieldChange('endDate', value)}
            type="date"
            icon={<CalendarIconSolid className="w-4 h-4 text-gray-500" />}
          />

          <EditableField
            label="Horas Estimadas"
            value={editedTask.estimatedHours}
            onChange={(value) => handleFieldChange('estimatedHours', value)}
            type="number"
            icon={<ClockIcon className="w-4 h-4 text-gray-500" />}
          />

          <EditableField
            label="Workstream"
            value={editedTask.workstream}
            onChange={(value) => handleFieldChange('workstream', value)}
            placeholder="Ex: Frontend, Backend"
            icon={<Bars3Icon className="w-4 h-4 text-gray-500" />}
          />

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
              Progresso (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={editedTask.progress || 0}
              onChange={(e) => handleFieldChange('progress', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-blue-600">{editedTask.progress || 0}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Projeto */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Projeto</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nome:</span>
            <span className="font-medium">{project.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sigla:</span>
            <span className="font-mono font-medium">{project.acronym}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600">{project.status}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Fixo */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            {isMobile && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            )}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                <span>{project.name}</span>
                <span>•</span>
                <span className="font-mono font-bold text-blue-600">#{editedTask.id}</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">{editedTask.title}</h1>
              
              {/* Linha compacta com informações essenciais */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {getStatusIcon(editedTask.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(editedTask.status)}`}>
                    {editedTask.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {editedTask.assignee?.name?.split(' ').map(n => n[0]).join('') || 'JC'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">{editedTask.assignee?.name || 'Julia Costa'}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {getPriorityIcon(editedTask.priority)}
                  <span className="text-xs text-gray-600">{editedTask.priority}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-blue-600">{editedTask.progress || 0}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <EllipsisVerticalIcon className="w-5 h-5" />
              </button>
              {showMoreOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button 
                      onClick={handleDuplicateTask}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                      Duplicar Tarefa
                    </button>
                    <button 
                      onClick={handleMoveTask}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ArrowRightIcon className="w-4 h-4 mr-2" />
                      Mover para Projeto
                    </button>
                    <button 
                      onClick={handleShareTask}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Compartilhar
                    </button>
                    <button 
                      onClick={handlePrintTask}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <PrinterIcon className="w-4 h-4 mr-2" />
                      Imprimir
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={handleDeleteTask}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Excluir Tarefa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content - Layout responsivo */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`${isMobile ? 'block' : 'grid grid-cols-3 gap-8'}`}>
          
          {/* Coluna Esquerda - Conteúdo Principal */}
          <div className={`${isMobile ? 'mb-8' : 'col-span-2'} space-y-6`}>

            {/* Descrição */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <button
                onClick={() => toggleSection('description')}
                className="flex items-center w-full text-left mb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                {collapsedSections.description ? (
                  <ChevronRightIcon className="w-4 h-4 text-gray-500 mr-2" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 mr-2" />
                )}
                <DocumentTextIcon className="w-4 h-4 text-gray-600 mr-2" />
                <h3 className="text-sm font-semibold text-gray-900">Descrição</h3>
              </button>
              {!collapsedSections.description && (
                <div className="ml-8">
                  <textarea
                    value={editedTask.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors text-xs"
                    placeholder="Descreva o objetivo e escopo da tarefa..."
                  />
                </div>
              )}
            </div>

            {/* Subtarefas */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <CollapsibleSection id="subtasks" title="Subtarefas" icon={ListBulletIcon} count={subtasks.length}>
                <div className="space-y-2">
                  {/* Controles de ordenação */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <ArrowsUpDownIcon className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Ordenar por:</span>
                      <select
                        value={sortSubtasks}
                        onChange={(e) => setSortSubtasks(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="name">Nome</option>
                        <option value="status">Status</option>
                        <option value="assignee">Responsável</option>
                        <option value="progress">Progresso</option>
                      </select>
                    </div>
                  </div>

                  {/* Tabela de subtarefas */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-medium text-gray-700">Nome</th>
                          <th className="text-left py-2 font-medium text-gray-700">Status</th>
                          <th className="text-left py-2 font-medium text-gray-700">Responsável</th>
                          <th className="text-left py-2 font-medium text-gray-700">Progresso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedSubtasks.map(subtask => (
                          <tr key={subtask.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-2">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(subtask.status)}
                                <div>
                                  <p className="font-medium text-gray-900">{subtask.title}</p>
                                  <p className="text-xs text-gray-500">#{subtask.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subtask.status)}`}>
                                {subtask.status}
                              </span>
                            </td>
                            <td className="py-2 text-gray-600 text-xs">{subtask.assignee}</td>
                            <td className="py-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${subtask.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600 w-8">{subtask.progress}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button className="flex items-center w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 text-xs">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Adicionar Subtarefa
                  </button>
                </div>
              </CollapsibleSection>
            </div>

            {/* Tarefas Relacionadas */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <CollapsibleSection id="related" title="Tarefas Relacionadas" icon={LinkIcon} count={relatedTasks.length}>
                <div className="space-y-2">
                  {relatedTasks.map(relatedTask => (
                    <div key={relatedTask.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(relatedTask.status)}
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{relatedTask.title}</p>
                          <p className="text-xs text-gray-500">#{relatedTask.id} • {relatedTask.type === 'predecessor' ? 'Predecessora' : 'Sucessora'}</p>
                        </div>
                      </div>
                      <ArrowRightIcon className="w-3 h-3 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>

            {/* Anexos */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <CollapsibleSection id="attachments" title="Anexos" icon={PaperClipIcon} count={attachments.length}>
                <div className="space-y-3">
                  {/* Upload de arquivos */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.zip"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <PaperClipIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Clique para fazer upload
                        </span> ou arraste arquivos aqui
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, PNG, JPG até 10MB
                      </p>
                    </label>
                  </div>

                  {/* Lista de anexos */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <PaperClipIcon className="w-3 h-3 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-xs text-gray-500">{attachment.size} • {attachment.uploadedAt}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            </div>

            {/* Comentários */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <CollapsibleSection id="comments" title="Comentários" icon={ChatBubbleLeftIcon} count={(editedTask.comments || []).length + 1}>
                <div className="space-y-3">
                  {/* Comentários existentes com scroll */}
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {editedTask.comments && editedTask.comments.length > 0 ? (
                      editedTask.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {comment.author.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900 text-xs">{comment.author}</span>
                                <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                              </div>
                              <p className="text-gray-700 text-xs">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">AS</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-xs">Ana Silva</span>
                              <span className="text-xs text-gray-500">há 2 horas</span>
                            </div>
                            <p className="text-gray-700 text-xs">Tarefa criada e atribuída para desenvolvimento.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Campo para novo comentário */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">AS</span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Adicione um comentário..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors text-xs"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none text-xs"
                          >
                            Adicionar Comentário
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>

          {/* Coluna Direita - Barra Lateral (Desktop) ou Modal (Mobile) */}
          {isMobile ? (
            <>
              {showSidebar && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)}></div>
                  <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 overflow-y-auto">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Detalhes da Tarefa</h2>
                        <button
                          onClick={() => setShowSidebar(false)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      {sidebarContent}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-1">
              <div className="sticky top-24 space-y-6">
                {sidebarContent}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Mover Tarefa */}
      {showMoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMoveModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative z-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mover Tarefa para Outro Projeto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Projeto de Destino:
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => e.target.value && confirmMoveTask(e.target.value)}
                >
                  <option value="">Selecione um projeto...</option>
                  {projects.filter(p => p.id !== project.id).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Compartilhar */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowShareModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative z-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compartilhar Tarefa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link da Tarefa:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={`${window.location.origin}/projects/tasks/${taskId}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/projects/tasks/${taskId}`);
                      alert('Link copiado para a área de transferência!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enviar por Email:
                </label>
                <input
                  type="email"
                  placeholder="Digite o email do destinatário"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    alert('Email enviado com sucesso!');
                    setShowShareModal(false);
                  }}
                  className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enviar Email
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Confirmar Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative z-10">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir a tarefa <strong>"{editedTask.title}"</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;

