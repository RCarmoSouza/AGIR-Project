import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const PeopleDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total de Pessoas',
      value: '24',
      change: '+2 este mês',
      changeType: 'positive',
      icon: UsersIcon
    },
    {
      name: 'Equipes Ativas',
      value: '6',
      change: '+1 esta semana',
      changeType: 'positive',
      icon: UserGroupIcon
    },
    {
      name: 'Bases',
      value: '3',
      change: 'Porto Alegre, São Paulo, Mendonça',
      changeType: 'neutral',
      icon: BuildingOfficeIcon
    },
    {
      name: 'Taxa de Utilização',
      value: '78%',
      change: '+5% vs mês anterior',
      changeType: 'positive',
      icon: ChartBarIcon
    }
  ];

  const quickActions = [
    {
      name: 'Nova Pessoa',
      description: 'Cadastrar nova pessoa na equipe',
      href: '/people/people',
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Nova Equipe',
      description: 'Criar nova equipe de trabalho',
      href: '/people/teams',
      icon: UserGroupIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Nova Base',
      description: 'Cadastrar nova base/localização',
      href: '/people/bases',
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Novo Calendário',
      description: 'Criar calendário de disponibilidade',
      href: '/people/calendars',
      icon: CalendarDaysIcon,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      person: 'Ana Silva',
      action: 'foi adicionada à equipe',
      team: 'Desenvolvimento Frontend',
      time: '2 horas atrás',
      avatar: 'AS'
    },
    {
      id: 2,
      person: 'Carlos Santos',
      action: 'teve sua taxa horária atualizada',
      team: 'R$ 120/hora',
      time: '1 dia atrás',
      avatar: 'CS'
    },
    {
      id: 3,
      person: 'Maria Oliveira',
      action: 'foi promovida para',
      team: 'Líder da Equipe Backend',
      time: '3 dias atrás',
      avatar: 'MO'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Pessoas</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visão geral da gestão de pessoas e recursos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => navigate(action.href)}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex-shrink-0 w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-medium text-gray-900">{action.name}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <PlusIcon className="ml-auto w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                            {activity.avatar}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.person}</span>{' '}
                              {activity.action}{' '}
                              <span className="font-medium text-gray-900">{activity.team}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleDashboard;

