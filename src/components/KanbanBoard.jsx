import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';

const KanbanBoard = ({ 
  tasks = [], 
  title = "Quadro Kanban", 
  subtitle = "Visualize e gerencie o fluxo de trabalho",
  showFilters = false,
  filters = null,
  onTaskMove = null,
  columns = [
    { id: 'A Fazer', title: 'A Fazer', color: 'bg-blue-100', limit: null },
    { id: 'Em Progresso', title: 'Em Progresso', color: 'bg-yellow-100', limit: 3 },
    { id: 'Bloqueado', title: 'Bloqueado', color: 'bg-red-100', limit: null },
    { id: 'Concluído', title: 'Concluído', color: 'bg-green-100', limit: null }
  ]
}) => {
  const navigate = useNavigate();

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && onTaskMove) {
      onTaskMove(taskId, newStatus, task.sprintId);
    }
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
      'Crítica': 'border-l-red-500',
      'High': 'border-l-orange-500',
      'Alta': 'border-l-orange-500',
      'Medium': 'border-l-yellow-500',
      'Média': 'border-l-yellow-500',
      'Low': 'border-l-green-500',
      'Baixa': 'border-l-green-500'
    };
    return colors[priority] || 'border-l-gray-500';
  };

  const TaskCard = ({ task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      className={`bg-white rounded-lg border-l-4 ${getPriorityColor(task.priority)} p-3 shadow-sm hover:shadow-md transition-all cursor-move`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(task.type)}`}>
            {task.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${task.projectId}/tasks/${task.id}`);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            title="Ver detalhes da tarefa"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span>SP: {task.storyPoints || 0}</span>
          <span>•</span>
          <span>{task.estimatedHours || 0}h</span>
        </div>
        
        {task.assignedTo && (
          <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {task.assignedTo.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {/* Informações do projeto */}
      {task.projectName && (
        <div className="mt-2 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {task.projectName}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        {showFilters && filters && (
          <div className="flex items-center space-x-4">
            {filters}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map(column => {
          const columnTasks = tasks.filter(task => task.status === column.id);
          const isOverLimit = column.limit && columnTasks.length > column.limit;
          
          return (
            <div key={column.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">{column.title}</p>
                <p className={`text-2xl font-bold ${isOverLimit ? 'text-red-600' : 'text-gray-900'}`}>
                  {columnTasks.length}
                  {column.limit && <span className="text-sm text-gray-500">/{column.limit}</span>}
                </p>
                {isOverLimit && (
                  <p className="text-xs text-red-600 mt-1">Limite excedido!</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quadro Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-96">
        {columns.map(column => {
          const columnTasks = tasks.filter(task => task.status === column.id);
          const isOverLimit = column.limit && columnTasks.length > column.limit;
          
          return (
            <div
              key={column.id}
              className={`${column.color} rounded-lg p-4 min-h-96`}
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    isOverLimit ? 'bg-red-100 text-red-800' : 'bg-white text-gray-700'
                  }`}>
                    {columnTasks.length}
                    {column.limit && `/${column.limit}`}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {columnTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Nenhuma tarefa</p>
                    <p className="text-xs">Arraste tarefas aqui</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-3">Legenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tipos de Tarefa</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Epic</span>
                <span className="text-xs text-gray-600">Épico</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Feature</span>
                <span className="text-xs text-gray-600">Funcionalidade</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">User Story</span>
                <span className="text-xs text-gray-600">História</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Prioridades</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">Crítica</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-xs text-gray-600">Alta</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-600">Média</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Baixa</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">WIP Limits</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Em Progresso: máx 3</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-red-600">Vermelho = limite excedido</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Informações</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">SP = Story Points</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">h = Horas estimadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Responsável</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

