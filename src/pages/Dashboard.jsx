import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../stores/appStore';
import Header from '../components/Header';
import {
  FolderIcon,
  ViewColumnsIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import userService from '../services/userService';
import timesheetService from '../services/timesheetService';

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAppStore();
  
  console.log('Dashboard - Renderizando:', {
    isAuthenticated,
    currentUser: currentUser?.name,
    hasCurrentUser: !!currentUser
  });
  
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalHours: 0,
    totalCost: 0,
    teamMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Dashboard useEffect - carregando dados com tratamento robusto');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando carregamento de dados do dashboard...');
      
      // Carregar dados em paralelo com tratamento individual de erros
      const results = await Promise.allSettled([
        projectService.getProjects().catch(err => {
          console.log('Erro ao carregar projetos (ignorado):', err);
          return [];
        }),
        taskService.getTasks().catch(err => {
          console.log('Erro ao carregar tarefas (ignorado):', err);
          return [];
        }),
        userService.getUsers().catch(err => {
          console.log('Erro ao carregar usuários (ignorado):', err);
          return [];
        }),
        timesheetService.getTimeEntries().catch(err => {
          console.log('Erro ao carregar timesheet (ignorado):', err);
          return [];
        })
      ]);

      // Extrair dados dos resultados, usando arrays vazios como fallback
      const projectsData = results[0].status === 'fulfilled' ? results[0].value : [];
      const tasksData = results[1].status === 'fulfilled' ? results[1].value : [];
      const usersData = results[2].status === 'fulfilled' ? results[2].value : [];
      const timeEntriesData = results[3].status === 'fulfilled' ? results[3].value : [];

      console.log('Dados carregados:', {
        projetos: projectsData.length,
        tarefas: tasksData.length,
        usuarios: usersData.length,
        timeEntries: timeEntriesData.length
      });

      setMetrics({
        totalProjects: Array.isArray(projectsData) ? projectsData.length : 0,
        activeProjects: Array.isArray(projectsData) ? projectsData.filter(p => p.status === 'Active').length : 0,
        totalTasks: Array.isArray(tasksData) ? tasksData.length : 0,
        completedTasks: Array.isArray(tasksData) ? tasksData.filter(t => t.status === 'Concluído').length : 0,
        totalHours: Array.isArray(timeEntriesData) ? timeEntriesData.reduce((sum, e) => sum + (e.hours || 0), 0) : 0,
        totalCost: Array.isArray(timeEntriesData) ? timeEntriesData.reduce((sum, e) => sum + (e.cost || 0), 0) : 0,
        teamMembers: Array.isArray(usersData) ? usersData.filter(u => u.status === 'ACTIVE').length : 0
      });

      console.log('Dashboard carregado com sucesso!');

    } catch (error) {
      console.error('Erro geral ao carregar dados do dashboard:', error);
      // NÃO definir erro que possa causar redirecionamento
      // setError('Erro ao carregar dados. Verifique se o backend está rodando.');
      console.log('Continuando execução mesmo com erro...');
    } finally {
      setLoading(false);
      console.log('Loading finalizado');
    }
  };

  // Verificação de autenticação agora é feita no ProtectedRoute

  const modules = [
    {
      name: 'Projetos',
      description: 'Gerencie projetos, equipes e sprints',
      icon: FolderIcon,
      color: 'bg-blue-500',
      link: '/projects',
      stats: [
        { label: 'Projetos Ativos', value: metrics.activeProjects },
        { label: 'Total de Tarefas', value: metrics.totalTasks }
      ]
    },
    {
      name: 'Kanban',
      description: 'Visualização centralizada de todas as tarefas',
      icon: ViewColumnsIcon,
      color: 'bg-indigo-500',
      link: '/kanban',
      stats: [
        { label: 'Minhas Tarefas', value: 0 },
        { label: 'Em Andamento', value: 0 }
      ]
    },
    {
      name: 'Timesheet',
      description: 'Controle de horas e aprovações',
      icon: ClockIcon,
      color: 'bg-green-500',
      link: '/timesheet',
      stats: [
        { label: 'Horas Registradas', value: `${metrics.totalHours}h` },
        { label: 'Custo Total', value: `R$ ${metrics.totalCost}` }
      ]
    },
    {
      name: 'Pessoas',
      description: 'Gestão de pessoas, equipes e recursos',
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      link: '/people',
      stats: [
        { label: 'Total de Pessoas', value: 24 },
        { label: 'Equipes Ativas', value: 6 }
      ]
    },
    {
      name: 'Segurança',
      description: 'Gestão de usuários, perfis e configurações de segurança',
      icon: ShieldCheckIcon,
      color: 'bg-red-500',
      link: '/security',
      stats: [
        { label: 'Usuários Ativos', value: metrics.teamMembers },
        { label: 'Perfis Configurados', value: 4 }
      ]
    },
    {
      name: 'RH & Pessoas',
      description: 'Gestão de recursos humanos e equipes',
      icon: UserGroupIcon,
      color: 'bg-gray-500',
      link: '/hr',
      stats: [
        { label: 'Funcionários', value: '-' },
        { label: 'Avaliações', value: '-' }
      ],
      disabled: true,
      comingSoon: 'Em breve'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro de Conexão</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Padronizado */}
      <Header showMenuButton={false} />
      
      {/* Conteúdo Principal */}
      <main className="pt-20 px-6">
        <div className="space-y-8">
          {/* Título de Boas-vindas */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Bem-vindo, {currentUser.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Escolha um aplicativo para começar a trabalhar</p>
          </div>

          {/* Módulos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              
              if (module.disabled) {
                return (
                  <div
                    key={module.name}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${module.color} bg-opacity-20`}>
                        <IconComponent className={`h-6 w-6 text-gray-400`} />
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {module.comingSoon}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">{module.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                    
                    <div className="space-y-2">
                      {module.stats.map((stat, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400">{stat.label}</span>
                          <span className="font-medium text-gray-400">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
            );
          }

          return (
            <Link
              key={module.name}
              to={module.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${module.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              
              <div className="space-y-2">
                {module.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-500">{stat.label}</span>
                    <span className="font-medium text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

          {/* Resumo Geral */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo Geral</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{metrics.totalProjects}</div>
                <div className="text-sm text-gray-500">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.completedTasks}</div>
                <div className="text-sm text-gray-500">Tarefas Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">1</div>
                <div className="text-sm text-gray-500">Sprints Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{metrics.teamMembers}</div>
                <div className="text-sm text-gray-500">Membros da Equipe</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

