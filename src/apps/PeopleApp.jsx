import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PeopleDashboard from './pages/PeopleDashboard';
import BasesManagement from './pages/BasesManagement';
import CalendarsManagement from './pages/CalendarsManagement';
import PeopleManagement from './pages/PeopleManagement';
import TeamsManagement from './pages/TeamsManagement';
import ResourceUsagePanel from './pages/ResourceUsagePanel';
import Sidebar from '../components/Sidebar';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const PeopleApp = () => {
  const sidebarItems = [
    {
      name: 'Dashboard',
      href: '/people',
      icon: HomeIcon,
      current: false
    },
    {
      name: 'Bases',
      href: '/people/bases',
      icon: BuildingOfficeIcon,
      current: false
    },
    {
      name: 'Calendários',
      href: '/people/calendars',
      icon: CalendarDaysIcon,
      current: false
    },
    {
      name: 'Pessoas',
      href: '/people/people',
      icon: UsersIcon,
      current: false
    },
    {
      name: 'Equipes',
      href: '/people/teams',
      icon: UserGroupIcon,
      current: false
    },
    {
      name: 'Uso de Recursos',
      href: '/people/resources',
      icon: ChartBarIcon,
      current: false
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        title="Pessoas & Recursos"
        subtitle="Gestão de equipes e recursos"
        items={sidebarItems}
        currentPath={window.location.pathname}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Routes>
            <Route index element={<PeopleDashboard />} />
            <Route path="bases" element={<BasesManagement />} />
            <Route path="calendars" element={<CalendarsManagement />} />
            <Route path="people" element={<PeopleManagement />} />
            <Route path="teams" element={<TeamsManagement />} />
            <Route path="resources" element={<ResourceUsagePanel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default PeopleApp;

