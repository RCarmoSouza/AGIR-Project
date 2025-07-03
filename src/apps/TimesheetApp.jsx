import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import TimesheetPage from './pages/TimesheetPage';
import ApprovalsPage from './pages/ApprovalsPage';
import { 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const TimesheetApp = () => {
  // Configuração do módulo
  const moduleConfig = {
    title: 'Timesheet & Aprovações',
    subtitle: 'Controle de horas e aprovações',
    icon: ClockIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    activeColor: 'bg-green-50 text-green-700',
    activeBorder: 'border-green-600',
    activeIconColor: 'text-green-600'
  };

  // Itens do menu principal
  const menuItems = [
    {
      path: '/timesheet',
      icon: ClockIcon,
      label: 'Timesheet',
      exactMatch: true
    },
    {
      path: '/timesheet/approvals',
      icon: CheckCircleIcon,
      label: 'Aprovações'
    }
  ];

  return (
    <ModuleLayout 
      moduleConfig={moduleConfig}
      menuItems={menuItems}
    >
      <Routes>
        <Route index element={<TimesheetPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
      </Routes>
    </ModuleLayout>
  );
};

export default TimesheetApp;

