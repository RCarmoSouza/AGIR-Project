import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../../stores/appStore';

const ProjectsPortfolio = () => {
  const navigate = useNavigate();
  const { projects, getDashboardMetrics } = useAppStore();
  const metrics = getDashboardMetrics();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active':
        return 'Ativo';
      case 'Completed':
        return 'Concluído';
      case 'Planning':
        return 'Planejamento';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Portfólio de Projetos</h1>
          <p className="text-gray-600">Visão geral de todos os projetos da organização</p>
        </div>
        <button
          onClick={() => navigate('/projects/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Projeto
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Membros da Equipe</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.teamMembers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Horas Trabalhadas</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalHours}h</p>
            </div>
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}/dashboard`)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Gerente:</span>
                <span className="font-medium">{project.manager.name}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Membros:</span>
                <span className="font-medium">{project.members.length}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Período:</span>
                <span className="font-medium">
                  {new Date(project.startDate).toLocaleDateString('pt-BR')} - {new Date(project.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {project.members.slice(0, 3).map((member, index) => (
                  <div key={index} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                ))}
                {project.members.length > 3 && (
                  <span className="text-xs text-gray-500">+{project.members.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPortfolio;

