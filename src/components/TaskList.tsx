'use client';

import { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  showSprint?: boolean;
  onTaskMove?: (taskId: string, targetSprintId: string | null) => void;
  droppableId?: string;
}

export function TaskList({ tasks, showSprint = true, onTaskMove, droppableId }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>Nenhuma tarefa encontrada</p>
        <p className="text-xs mt-1">Arraste tarefas para cá ou crie uma nova</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

