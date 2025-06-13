'use client';

import { Project } from '@/types';
import { useAppStore } from '@/stores/appStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon,
  EyeIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { getTasksByProject } = useAppStore();
  const tasks = getTasksByProject(project.id);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'planning':
        return 'Planejamento';
      case 'completed':
        return 'Concluído';
      case 'on-hold':
        return 'Pausado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.name}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Dates */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>Início: {format(project.startDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>
        {project.endDate && (
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>Fim: {format(project.endDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <UsersIcon className="h-4 w-4 mr-2" />
        <span>{project.members.length} membros</span>
      </div>

      {/* Sprint info */}
      {project.usesSprints ? (
        <div className="text-sm text-gray-500 mb-4">
          <span>{project.sprints.length} sprints</span>
        </div>
      ) : (
        <div className="text-sm text-gray-500 mb-4">
          <span>Apenas Kanban</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <Link
          href={`/projects/${project.id}`}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <EyeIcon className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Link>
        <Link
          href={`/projects/${project.id}/kanban`}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ViewColumnsIcon className="h-4 w-4 mr-2" />
          Abrir Kanban
        </Link>
      </div>
    </div>
  );
}

