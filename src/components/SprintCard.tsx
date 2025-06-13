'use client';

import { Sprint, Task } from '@/types';
import { TaskList } from './TaskList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, ClockIcon, FlagIcon } from '@heroicons/react/24/outline';
import { useDroppable } from '@dnd-kit/core';

interface SprintCardProps {
  sprint: Sprint;
  tasks: Task[];
  onTaskMove?: (taskId: string, targetSprintId: string | null) => void;
  droppableId?: string;
}

export function SprintCard({ sprint, tasks, onTaskMove, droppableId }: SprintCardProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId || `sprint-${sprint.id}`,
  });

  const getStatusColor = (status: Sprint['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Sprint['status']) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'planning':
        return 'Planejamento';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white rounded-lg border-2 p-6 transition-colors ${
        isOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Sprint Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {sprint.name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sprint.status)}`}>
              {getStatusText(sprint.status)}
            </span>
          </div>
          
          {sprint.goal && (
            <p className="text-sm text-gray-600 mb-3">
              <FlagIcon className="h-4 w-4 inline mr-1" />
              {sprint.goal}
            </p>
          )}
        </div>
      </div>

      {/* Sprint Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>Início: {format(sprint.startDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>Fim: {format(sprint.endDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progresso</span>
          <span>{completedTasks} de {tasks.length} tarefas</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            Tarefas
          </h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {tasks.length}
          </span>
        </div>
        
        <div className="min-h-[200px] border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
          <TaskList 
            tasks={tasks} 
            showSprint={false}
            onTaskMove={onTaskMove}
            droppableId={droppableId}
          />
        </div>
      </div>
    </div>
  );
}

