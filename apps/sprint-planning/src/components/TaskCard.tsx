'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { useDraggable } from '@dnd-kit/core';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { TaskDetailsModal } from './TaskDetailsModal';

interface TaskCardProps {
  task: Task;
  showProject?: boolean;
}

export function TaskCard({ task, showProject = false }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`bg-white border-l-4 ${getPriorityColor(task.priority)} rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        {/* Header compacto */}
        <div className="p-3">
          <div className="flex items-start justify-between">
            {/* Lado esquerdo - Tipo e título */}
            <div className="flex items-start space-x-2 flex-1 min-w-0">
              <span className="text-lg flex-shrink-0">{task.type.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
                  onClick={() => setShowDetails(true)}
                  title={task.title}
                >
                  {task.title}
                </h3>
                
                {/* Informações em linha */}
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {task.type.name}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getPriorityText(task.priority)}
                  </span>
                  
                  {task.epicName && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {task.epicName}
                    </span>
                  )}
                  
                  {task.storyPoints && (
                    <span className="font-medium">{task.storyPoints} pts</span>
                  )}
                  
                  {task.estimatedHours && (
                    <span>{task.estimatedHours}h</span>
                  )}
                </div>
              </div>
            </div>

            {/* Lado direito - Ações */}
            <div className="flex items-center space-x-2 ml-2">
              {/* Indicadores de comentários e anexos */}
              <div className="flex items-center space-x-1">
                {task.comments && task.comments.length > 0 && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ChatBubbleLeftIcon className="h-3 w-3" />
                    <span className="text-xs">{task.comments.length}</span>
                  </div>
                )}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <PaperClipIcon className="h-3 w-3" />
                    <span className="text-xs">{task.attachments.length}</span>
                  </div>
                )}
              </div>

              {/* Botão de expansão */}
              {task.description && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Responsável e tags em linha */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              {task.assignee && (
                <div className="flex items-center space-x-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-gray-600 truncate max-w-20">
                    {task.assignee.name.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Tags compactas */}
            {task.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                {task.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{task.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Descrição expandida */}
        {isExpanded && task.description && (
          <div className="px-3 pb-3 border-t border-gray-100">
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      <TaskDetailsModal
        task={task}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}

