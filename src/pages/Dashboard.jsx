import React from 'react';
import { 
  ChartBarIcon, 
  FolderIcon, 
  ClockIcon, 
  UserGroupIcon,
  UsersIcon,
  CalendarDaysIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../stores/appStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getDashboardMetrics, currentUser } = useAppStore();
  const metrics = getDashboardMetrics();

  const apps = [
    {
      id: 'projects',
      name: 'Projetos',
      description: 'Gerencie projetos, equipes e sprints',
      icon: FolderIcon,
      color: 'bg-blue-500',
      path: '/projects',
      metrics: [
        { label: 'Projetos Ativos', value: metrics.activeProjects },
        { label: 'Total de Tarefas', value: metrics.totalTasks }
      ]
    },
    {
      id: 'timesheet',
      name: 'Timesheet',
      description: 'Controle de horas e aprovações',
      icon: ClockIcon,
      color: 'bg-green-500',
      path: '/timesheet',
      metrics: [
        { label: 'Horas Registradas', value: `${metrics.totalHours}h` },
        { label: 'Custo Total', value: `R$ ${metrics.totalCost.toLocaleString()}` }
      ]
    },
    {
      id: 'people',
      name: 'Pessoas',
      description: 'Gestão de pessoas, equipes e recursos',
      icon: UsersIcon,
      color: 'bg-purple-500',
      path: '/people',
      metrics: [
        { label: 'Total de Pessoas', value: '24' },
        { label: 'Equipes Ativas', value: '6' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AGIR</h1>
                <p className="text-xs text-gray-500">Sistema de Gestão Ágil</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {currentUser.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Escolha um aplicativo para começar a trabalhar
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {apps.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(app.path)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${app.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <app.icon className="h-6 w-6 text-white" />
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{app.description}</p>
              
              <div className="space-y-2">
                {app.metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{metric.label}</span>
                    <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Coming Soon Apps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-60">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-gray-500" />
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Em breve</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">RH & Pessoas</h3>
            <p className="text-gray-600 text-sm mb-4">Gestão de recursos humanos e equipes</p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Funcionários</span>
                <span className="text-sm font-medium text-gray-900">-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Avaliações</span>
                <span className="text-sm font-medium text-gray-900">-</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Geral</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalProjects}</div>
              <div className="text-sm text-gray-500">Projetos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.completedTasks}</div>
              <div className="text-sm text-gray-500">Tarefas Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.activeSprints}</div>
              <div className="text-sm text-gray-500">Sprints Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{metrics.teamMembers}</div>
              <div className="text-sm text-gray-500">Membros da Equipe</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

