import React, { useState } from 'react';
import Header from './Header';
import ModuleSidebar from './ModuleSidebar';

const ModuleLayout = ({ 
  children, 
  moduleConfig,
  menuItems = [],
  sidebarChildren = null
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          moduleConfig={moduleConfig}
          menuItems={menuItems}
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

