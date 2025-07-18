import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalKanban from './pages/GlobalKanban';
import Header from '../components/Header';
import ModuleSidebar from '../components/ModuleSidebar';
import { 
  Squares2X2Icon, 
  ViewColumnsIcon,
  ChartBarIcon,
  FunnelIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const KanbanApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    {
      name: 'Kanban Global',
      href: '/kanban',
      icon: Squares2X2Icon,
      current: true
    },
    {
      name: 'Quadros',
      href: '/kanban/boards',
      icon: ViewColumnsIcon,
      current: false
    },
    {
      name: 'Relatórios',
      href: '/kanban/reports',
      icon: ChartBarIcon,
      current: false
    },
    {
      name: 'Filtros Salvos',
      href: '/kanban/filters',
      icon: FunnelIcon,
      current: false
    },
    {
      name: 'Configurações',
      href: '/kanban/settings',
      icon: Cog6ToothIcon,
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <ModuleSidebar
          title="Kanban"
          subtitle="Visualização centralizada de tarefas"
          icon={Squares2X2Icon}
          items={sidebarItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Conteúdo principal */}
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<GlobalKanban />} />
              <Route path="/board" element={<GlobalKanban />} />
              <Route path="/boards" element={<div>Quadros - Em desenvolvimento</div>} />
              <Route path="/reports" element={<div>Relatórios - Em desenvolvimento</div>} />
              <Route path="/filters" element={<div>Filtros Salvos - Em desenvolvimento</div>} />
              <Route path="/settings" element={<div>Configurações - Em desenvolvimento</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KanbanApp;

