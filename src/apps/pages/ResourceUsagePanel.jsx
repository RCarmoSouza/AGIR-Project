import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const ResourceUsagePanel = () => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Painel de Uso de Recursos</h3>
        <p className="mt-1 text-sm text-gray-500">
          Em desenvolvimento - Visualização e edição de alocações de recursos
        </p>
      </div>
    </div>
  );
};

export default ResourceUsagePanel;

