import React from 'react';

const ProjectDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Projeto</h1>
        <p className="text-gray-600">Visão geral específica deste projeto</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default ProjectDashboard;

