import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import ProjectsSidebar from './components/ProjectsSidebar';
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
import { 
  BellIcon,
  ChartBarIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

const ProjectsApp = () => {
  // Configuração do módulo
  const moduleConfig = {
    title: 'Projetos & Equipes',
    subtitle: 'Gestão de projetos e sprints',
    icon: FolderIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    activeColor: 'bg-blue-50 text-blue-700',
    activeBorder: 'border-blue-600',
    activeIconColor: 'text-blue-600'
  };

  // Itens do menu principal
  const menuItems = [
    { 
      path: '/projects', 
      icon: BellIcon, 
      label: 'Feed',
      exactMatch: true
    },
    { 
      path: '/projects/portfolio', 
      icon: ChartBarIcon, 
      label: 'Dashboard de portfólio'
    }
  ];

  return (
    <ModuleLayout 
      moduleConfig={moduleConfig}
      menuItems={menuItems}
      sidebarChildren={<ProjectsSidebar />}
    >
      <Routes>
        <Route index element={<Feed />} />
        <Route path="portfolio" element={<ProjectsPortfolio />} />
        <Route path="create" element={<CreateProjectPage />} />
        <Route path=":projectId/dashboard" element={<ProjectDashboard />} />
        <Route path=":projectId/team" element={<TeamManagement />} />
        <Route path=":projectId/kanban" element={<ProjectKanban />} />
        <Route path=":projectId/sprints" element={<ProjectSprintPlanning />} />
        <Route path=":projectId/gantt" element={<ProjectGantt />} />
        <Route path=":projectId/tasks" element={<TaskBoard />} />
        <Route path="tasks/:taskId" element={<TaskDetailPage />} />
      </Routes>
    </ModuleLayout>
  );
};

export default ProjectsApp;

