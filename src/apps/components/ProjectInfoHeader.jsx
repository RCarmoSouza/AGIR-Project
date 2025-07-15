import React from 'react';
import { Calendar, Clock, User, Flag } from 'lucide-react';

const ProjectInfoHeader = ({ project }) => {
  if (!project) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Não definido';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateDuration = () => {
    if (!project.startDate || !project.endDate) return 'Não calculado';
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dias`;
  };

  return (
    <div className="flex items-center space-x-6 text-xs">
      {/* Data de Início */}
      <div className="flex items-center space-x-1">
        <Calendar className="w-3 h-3 text-green-600" />
        <span className="text-gray-600 font-medium">Início:</span>
        <span className="text-gray-900 font-semibold">{formatDate(project.startDate)}</span>
      </div>

      {/* Data de Fim */}
      <div className="flex items-center space-x-1">
        <Calendar className="w-3 h-3 text-red-600" />
        <span className="text-gray-600 font-medium">Fim:</span>
        <span className="text-gray-900 font-semibold">{formatDate(project.endDate)}</span>
      </div>

      {/* Duração */}
      <div className="flex items-center space-x-1">
        <Clock className="w-3 h-3 text-blue-600" />
        <span className="text-gray-600 font-medium">Duração:</span>
        <span className="text-gray-900 font-semibold">{calculateDuration()}</span>
      </div>

      {/* Gerente */}
      <div className="flex items-center space-x-1">
        <User className="w-3 h-3 text-purple-600" />
        <span className="text-gray-600 font-medium">Gerente:</span>
        <span className="text-gray-900 font-semibold">{project.manager || 'Ana Silva'}</span>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-1">
        <Flag className="w-3 h-3 text-orange-600" />
        <span className="text-gray-600 font-medium">Status:</span>
        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
          {project.status || 'Planejamento'}
        </span>
      </div>
    </div>
  );
};

export default ProjectInfoHeader;

