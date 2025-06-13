'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Task, Sprint } from '@/types';
import { SprintCard } from '@/components/SprintCard';
import { CreateSprintModal } from '@/components/CreateSprintModal';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { TaskList } from '@/components/TaskList';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';

// Componente para área droppable
function DroppableArea({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  
  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'bg-blue-50 border-blue-300' : ''} transition-colors`}
    >
      {children}
    </div>
  );
}

export default function SprintsPage() {
  const { 
    projects, 
    selectedProject, 
    setSelectedProject, 
    getTasksByProject, 
    getSprints,
    updateTask,
    moveTaskToSprint
  } = useAppStore();
  
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentProject = selectedProject || projects[0];
  const allTasks = currentProject ? getTasksByProject(currentProject.id) : [];
  const sprints = currentProject ? getSprints(currentProject.id) : [];
  
  // Tarefas do backlog (sem sprint atribuída)
  const backlogTasks = allTasks.filter(task => !task.sprintId);
  
  // Ordenar sprints por data de início
  const sortedSprints = [...sprints].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = allTasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const targetId = over.id as string;
    
    // Se soltar no backlog
    if (targetId === 'backlog') {
      moveTaskToSprint(taskId, null);
    }
    // Se soltar em uma sprint
    else if (targetId.startsWith('sprint-')) {
      const sprintId = targetId.replace('sprint-', '');
      moveTaskToSprint(taskId, sprintId);
    }
    
    setActiveTask(null);
  };

  const handleTaskMove = (taskId: string, targetSprintId: string | null) => {
    moveTaskToSprint(taskId, targetSprintId);
  };

  if (!currentProject) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum projeto encontrado
          </h2>
          <p className="text-gray-600">
            Crie um projeto primeiro para gerenciar sprints.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Planejamento de Sprints
            </h1>
            <p className="text-gray-600">
              Gerencie o backlog e planeje suas sprints ágeis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nova Tarefa
            </button>
            <button
              onClick={() => setShowCreateSprintModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nova Sprint
            </button>
          </div>
        </div>

        {/* Project Selector */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Projeto:
          </label>
          <select
            value={currentProject.id}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sprint Planning Layout - Vertical */}
        <div className="space-y-6">
          {/* Backlog Section */}
          <DroppableArea id="backlog" className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  📋 Backlog
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {backlogTasks.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Tarefas não atribuídas a sprints
              </p>
            </div>
            
            <div className="min-h-[200px]">
              <TaskList 
                tasks={backlogTasks} 
                showSprint={false}
                onTaskMove={handleTaskMove}
                droppableId="backlog"
              />
            </div>
          </DroppableArea>

          {/* Sprints Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                🏃‍♂️ Sprints
              </h2>
              <span className="text-sm text-gray-600">
                {sortedSprints.length} sprint(s)
              </span>
            </div>

            {sortedSprints.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500 mb-4">
                  Nenhuma sprint criada ainda
                </p>
                <button
                  onClick={() => setShowCreateSprintModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Primeira Sprint
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedSprints.map((sprint) => {
                  const sprintTasks = allTasks.filter(task => task.sprintId === sprint.id);
                  return (
                    <DroppableArea 
                      key={sprint.id} 
                      id={`sprint-${sprint.id}`}
                      className="border-2 border-dashed border-transparent rounded-lg"
                    >
                      <SprintCard
                        sprint={sprint}
                        tasks={sprintTasks}
                        onTaskMove={handleTaskMove}
                        droppableId={`sprint-${sprint.id}`}
                      />
                    </DroppableArea>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-lg opacity-90 rotate-3">
              <div className="text-sm font-medium text-gray-900">
                {activeTask.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {activeTask.type.name}
              </div>
            </div>
          ) : null}
        </DragOverlay>

        {/* Modals */}
        <CreateSprintModal
          isOpen={showCreateSprintModal}
          onClose={() => setShowCreateSprintModal(false)}
          projectId={currentProject.id}
        />

        <CreateTaskModal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          projectId={currentProject.id}
        />
      </div>
    </DndContext>
  );
}

