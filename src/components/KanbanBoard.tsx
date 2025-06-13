'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DroppableColumn } from './DroppableColumn';

interface KanbanBoardProps {
  projectId: string;
}

const columns = [
  { id: 'backlog', title: 'Backlog', status: 'backlog' as const, color: 'bg-gray-50 border-gray-200' },
  { id: 'todo', title: 'A Fazer', status: 'todo' as const, color: 'bg-blue-50 border-blue-200' },
  { id: 'in-progress', title: 'Em Progresso', status: 'in-progress' as const, color: 'bg-yellow-50 border-yellow-200', limit: 3 },
  { id: 'review', title: 'Em Revisão', status: 'review' as const, color: 'bg-purple-50 border-purple-200' },
  { id: 'done', title: 'Concluído', status: 'done' as const, color: 'bg-green-50 border-green-200' },
];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { getTasksByProject, selectedProject, updateTask } = useAppStore();
  const [selectedSprint, setSelectedSprint] = useState<string>('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const allTasks = getTasksByProject(projectId);
  
  // Filtrar tarefas por sprint se o projeto usar sprints
  const filteredTasks = selectedProject?.usesSprints && selectedSprint !== 'all'
    ? allTasks.filter(task => task.sprintId === selectedSprint)
    : allTasks;

  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const sprints = selectedProject?.sprints || [];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];
    
    // Verificar se é uma coluna válida
    const validColumn = columns.find(col => col.status === newStatus);
    if (!validColumn) {
      setActiveTask(null);
      return;
    }

    // Verificar WIP limit para "Em Progresso"
    if (newStatus === 'in-progress') {
      const currentInProgressTasks = getTasksByStatus('in-progress');
      const task = filteredTasks.find(t => t.id === taskId);
      
      if (task && task.status !== 'in-progress' && currentInProgressTasks.length >= 3) {
        alert('Limite WIP excedido! Finalize tarefas antes de adicionar novas.');
        setActiveTask(null);
        return;
      }
    }

    // Atualizar status da tarefa
    updateTask(taskId, { status: newStatus });
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Sprint Filter */}
        {selectedProject?.usesSprints && sprints.length > 0 && (
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filtrar por Sprint:
            </label>
            <select
              value={selectedSprint}
              onChange={(e) => setSelectedSprint(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas as tarefas</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-5 gap-6 h-[calc(100vh-300px)]">
          {columns.map((column) => {
            const tasks = getTasksByStatus(column.status);
            const isOverLimit = column.limit && tasks.length > column.limit;

            return (
              <DroppableColumn
                key={column.id}
                id={column.status}
                className={`${column.color} rounded-lg border-2 p-4 flex flex-col min-h-0`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {column.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isOverLimit ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tasks.length}
                      {column.limit && ` / ${column.limit}`}
                    </span>
                  </div>
                </div>

                {/* WIP Limit Warning */}
                {isOverLimit && (
                  <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                    ⚠️ Limite WIP excedido! Finalize tarefas antes de adicionar novas.
                  </div>
                )}

                {/* Tasks */}
                <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} isDragging={activeTask?.id === task.id} />
                  ))}
                  
                  {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Nenhuma tarefa
                    </div>
                  )}
                </div>
              </DroppableColumn>
            );
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-90">
              <TaskCard task={activeTask} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

