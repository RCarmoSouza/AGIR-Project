import React, { useState } from 'react';
import Header from './Header';
import ModuleSidebar from './ModuleSidebar';

const ModuleLayout = ({ 
  children, 
  title,
  subtitle,
  sidebarItems = [],
  moduleConfig,
  menuItems = [],
  sidebarChildren = null
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Configuração padrão do módulo se não fornecida
  const defaultModuleConfig = {
    title: title || 'Módulo',
    subtitle: subtitle || '',
    icon: () => <div className="w-5 h-5 bg-gray-400 rounded"></div>,
    bgColor: 'bg-red-500',
    iconColor: 'text-white',
    activeColor: 'bg-red-50 text-red-700',
    activeBorder: 'border-red-500'
  };

  const finalModuleConfig = moduleConfig || defaultModuleConfig;
  const finalMenuItems = sidebarItems.length > 0 ? sidebarItems : menuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Layout principal */}
      <div className="flex pt-16"> {/* pt-16 para compensar o header fixo */}
        {/* Sidebar */}
        <ModuleSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          moduleConfig={finalModuleConfig}
          menuItems={finalMenuItems}
        >
          {sidebarChildren}
        </ModuleSidebar>
        
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0"> {/* min-w-0 previne overflow */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModuleLayout;

