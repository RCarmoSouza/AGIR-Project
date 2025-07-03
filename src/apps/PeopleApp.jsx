import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import PeopleDashboard from './pages/PeopleDashboard';
import BasesManagement from './pages/BasesManagement';
import CalendarsManagement from './pages/CalendarsManagement';
import PeopleManagement from './pages/PeopleManagement';
import TeamsManagement from './pages/TeamsManagement';
import ResourceUsagePanel from './pages/ResourceUsagePanel';
import { 
  HomeIcon,
  UsersIcon, 
  BuildingOfficeIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const PeopleApp = () => {
  // Configuração do módulo
  const moduleConfig = {
    title: 'Pessoas & Recursos',
    subtitle: 'Gestão de equipes',
    icon: UsersIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    activeColor: 'bg-purple-50 text-purple-700',
    activeBorder: 'border-purple-600',
    activeIconColor: 'text-purple-600'
  };

  // Itens do menu principal
  const menuItems = [
    { 
      path: '/people', 
      icon: HomeIcon, 
      label: 'Dashboard',
      exactMatch: true
    },
    { 
      path: '/people/people', 
      icon: UsersIcon, 
      label: 'Pessoas'
    },
    { 
      path: '/people/teams', 
      icon: UserGroupIcon, 
      label: 'Equipes'
    },
    { 
      path: '/people/bases', 
      icon: BuildingOfficeIcon, 
      label: 'Bases'
    },
    { 
      path: '/people/calendars', 
      icon: CalendarDaysIcon, 
      label: 'Calendários'
    },
    { 
      path: '/people/resources', 
      icon: ChartBarIcon, 
      label: 'Uso de Recursos'
    }
  ];

  return (
    <ModuleLayout 
      moduleConfig={moduleConfig}
      menuItems={menuItems}
    >
      <Routes>
        <Route index element={<PeopleDashboard />} />
        <Route path="bases" element={<BasesManagement />} />
        <Route path="calendars" element={<CalendarsManagement />} />
        <Route path="people" element={<PeopleManagement />} />
        <Route path="teams" element={<TeamsManagement />} />
        <Route path="resources" element={<ResourceUsagePanel />} />
      </Routes>
    </ModuleLayout>
  );
};

export default PeopleApp;

