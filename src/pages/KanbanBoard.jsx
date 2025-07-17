import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAppStore from '../stores/appStore';
import KanbanBoard from '../components/KanbanBoard';

const ProjectKanbanBoard = () => {
  const { projectId } = useParams();
  const { 
    tasks, 
    projects, 
    sprints,
    getTasksByProject,
    getSprintsByProject,
    getLeafTasks,
    moveTask
  } = useAppStore();

  const [selectedSprintId, setSelectedSprintId] = useState('');

  const selectedProject = projects.find(p => p.id === projectId) || projects[0];
  const projectSprints = getSprintsByProject(selectedProject?.id || '');
  const allProjectTasks = getTasksByProject(selectedProject?.id || '');

  // Filtrar tarefas por sprint se selecionado, depois filtrar apenas tarefas folha
  const tasksToFilter = selectedSprintId 
    ? allProjectTasks.filter(task => task.sprintId === selectedSprintId)
    : allProjectTasks;
  
  const filteredTasks = getLeafTasks(tasksToFilter);

  // Handler para mover tarefa
  const handleTaskMove = (taskId, newStatus, sprintId) => {
    moveTask(taskId, newStatus, sprintId);
  };

  // Componente de filtros
  const FiltersComponent = () => (
    <select
      value={selectedSprintId}
      onChange={(e) => setSelectedSprintId(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
    >
      <option value="">Todas as tarefas</option>
      {projectSprints.map(sprint => (
        <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
      ))}
    </select>
  );

  return (
    <KanbanBoard
      tasks={filteredTasks}
      title="Quadro Kanban"
      subtitle="Visualize e gerencie o fluxo de trabalho"
      showFilters={true}
      filters={<FiltersComponent />}
      onTaskMove={handleTaskMove}
      columns={[
        { id: 'A Fazer', title: 'A Fazer', color: 'bg-blue-100', limit: null },
        { id: 'Em Progresso', title: 'Em Progresso', color: 'bg-yellow-100', limit: 3 },
        { id: 'Bloqueado', title: 'Bloqueado', color: 'bg-red-100', limit: null },
        { id: 'Concluído', title: 'Concluído', color: 'bg-green-100', limit: null }
      ]}
    />
  );
};

export default ProjectKanbanBoard;

