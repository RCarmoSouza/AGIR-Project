import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectsLayout from './ProjectsLayout';
import Feed from './pages/Feed';
import ProjectsPortfolio from './pages/ProjectsPortfolio';
import ProjectDashboard from './pages/ProjectDashboard';
import TeamManagement from './pages/TeamManagement';
import ProjectKanban from './pages/ProjectKanban';
import ProjectSprintPlanning from './pages/ProjectSprintPlanning';
import ProjectGantt from './pages/ProjectGantt';
import TaskBoard from './pages/TaskBoard';
import TaskDetailPage from './pages/TaskDetailPage';
import CreateProjectPage from './pages/CreateProjectPage';

const ProjectsApp = () => {
  return (
    <ProjectsLayout>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/portfolio" element={<ProjectsPortfolio />} />
        <Route path="/create" element={<CreateProjectPage />} />
        <Route path="/:projectId/dashboard" element={<ProjectDashboard />} />
        <Route path="/:projectId/team" element={<TeamManagement />} />
        <Route path="/:projectId/kanban" element={<ProjectKanban />} />
        <Route path="/:projectId/sprints" element={<ProjectSprintPlanning />} />
        <Route path="/:projectId/gantt" element={<ProjectGantt />} />
        <Route path="/:projectId/tasks" element={<TaskBoard />} />
        <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
      </Routes>
    </ProjectsLayout>
  );
};

export default ProjectsApp;

