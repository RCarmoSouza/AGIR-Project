import React, { useState, useMemo } from 'react';
import { 
  ChartBarIcon,
  FunnelIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UsersIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentChartBarIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const ResourceUsagePanel = () => {
  const [selectedView, setSelectedView] = useState('monthly'); // monthly, weekly, daily
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    base: '',
    team: '',
    person: '',
    project: '',
    status: 'active'
  });

  // Dados mock para demonstração
  const mockData = {
    people: [
      { id: 1, name: 'Ana Silva', position: 'Gerente de Projetos', base: 'Porto Alegre', team: 'Desenvolvimento Frontend', hourlyRate: 150, status: 'active' },
      { id: 2, name: 'Carlos Santos', position: 'Desenvolvedor Full Stack', base: 'Porto Alegre', team: 'Desenvolvimento Frontend', hourlyRate: 120, status: 'active' },
      { id: 3, name: 'Maria Oliveira', position: 'UX/UI Designer', base: 'São Paulo', team: 'Desenvolvimento Frontend', hourlyRate: 110, status: 'active' },
      { id: 4, name: 'Pedro Costa', position: 'Desenvolvedor Junior', base: 'Mendonça', team: 'Desenvolvimento Backend', hourlyRate: 80, status: 'active' },
      { id: 5, name: 'Julia Ferreira', position: 'Analista de QA', base: 'São Paulo', team: 'Quality Assurance', hourlyRate: 100, status: 'inactive' }
    ],
    projects: [
      { id: 1, name: 'Sistema de E-commerce', status: 'active', priority: 'high' },
      { id: 2, name: 'App Mobile', status: 'active', priority: 'medium' },
      { id: 3, name: 'Website Corporativo', status: 'active', priority: 'low' }
    ],
    teams: [
      { id: 1, name: 'Desenvolvimento Frontend', base: 'Porto Alegre' },
      { id: 2, name: 'Desenvolvimento Backend', base: 'São Paulo' },
      { id: 3, name: 'Quality Assurance', base: 'Mendonça' },
      { id: 4, name: 'DevOps & Infraestrutura', base: 'Porto Alegre' }
    ],
    bases: ['Porto Alegre', 'São Paulo', 'Mendonça'],
    allocations: [
      { personId: 1, projectId: 1, hours: 40, week: '2025-01-06', utilization: 100 },
      { personId: 1, projectId: 2, hours: 0, week: '2025-01-06', utilization: 0 },
      { personId: 2, projectId: 1, hours: 32, week: '2025-01-06', utilization: 80 },
      { personId: 2, projectId: 2, hours: 8, week: '2025-01-06', utilization: 20 },
      { personId: 3, projectId: 1, hours: 24, week: '2025-01-06', utilization: 60 },
      { personId: 3, projectId: 2, hours: 16, week: '2025-01-06', utilization: 40 },
      { personId: 4, projectId: 1, hours: 40, week: '2025-01-06', utilization: 100 }
    ],
    // Dados históricos para gráficos de tendência
    historicalData: [
      { period: 'Dez 2024', utilization: 75, hours: 320, cost: 38400 },
      { period: 'Jan 2025', utilization: 82, hours: 344, cost: 41280 },
      { period: 'Fev 2025', utilization: 78, hours: 336, cost: 40320 },
      { period: 'Mar 2025', utilization: 85, hours: 360, cost: 43200 }
    ],
    // Dados de utilização por base
    utilizationByBase: [
      { base: 'Porto Alegre', utilization: 85, people: 2, hours: 72 },
      { base: 'São Paulo', utilization: 50, people: 1, hours: 24 },
      { base: 'Mendonça', utilization: 100, people: 1, hours: 40 }
    ],
    // Dados de distribuição por equipe
    teamDistribution: [
      { team: 'Frontend', people: 3, utilization: 75, color: '#3B82F6' },
      { team: 'Backend', people: 1, utilization: 100, color: '#10B981' },
      { team: 'QA', people: 1, utilization: 0, color: '#F59E0B' },
      { team: 'DevOps', people: 0, utilization: 0, color: '#EF4444' }
    ]
  };

  // Filtrar dados baseado nos filtros selecionados
  const filteredPeople = useMemo(() => {
    return mockData.people.filter(person => {
      if (filters.base && person.base !== filters.base) return false;
      if (filters.team && person.team !== filters.team) return false;
      if (filters.person && !person.name.toLowerCase().includes(filters.person.toLowerCase())) return false;
      if (filters.status && person.status !== filters.status) return false;
      return true;
    });
  }, [filters, mockData.people]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalPeople = filteredPeople.length;
    const activePeople = filteredPeople.filter(p => p.status === 'active').length;
    const totalAllocations = mockData.allocations.filter(a => 
      filteredPeople.some(p => p.id === a.personId)
    );
    const avgUtilization = totalAllocations.length > 0 
      ? totalAllocations.reduce((sum, a) => sum + a.utilization, 0) / totalAllocations.length 
      : 0;
    const totalHours = totalAllocations.reduce((sum, a) => sum + a.hours, 0);
    const avgHourlyRate = filteredPeople.length > 0 
      ? filteredPeople.reduce((sum, p) => sum + p.hourlyRate, 0) / filteredPeople.length 
      : 0;

    return {
      totalPeople,
      activePeople,
      avgUtilization: Math.round(avgUtilization),
      totalHours,
      avgHourlyRate: Math.round(avgHourlyRate),
      totalCost: Math.round(totalHours * avgHourlyRate)
    };
  }, [filteredPeople, mockData.allocations]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      base: '',
      team: '',
      person: '',
      project: '',
      status: 'active'
    });
  };

  const viewOptions = [
    { value: 'monthly', label: 'Visão Mensal', icon: CalendarDaysIcon },
    { value: 'weekly', label: 'Visão Semanal', icon: CalendarDaysIcon },
    { value: 'daily', label: 'Visão Diária', icon: ClockIcon }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel de Uso de Recursos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize e gerencie a alocação de recursos em projetos
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* Seletor de Visualização */}
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            {viewOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Seletor de Período */}
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />

          {/* Botão de Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              showFilters ? 'bg-gray-50' : ''
            }`}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
            {showFilters ? (
              <ChevronUpIcon className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Pessoas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {metrics.totalPeople}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pessoas Ativas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {metrics.activePeople}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Utilização Média
                  </dt>
                  <dd className="flex items-center text-lg font-medium text-gray-900">
                    {metrics.avgUtilization}%
                    {metrics.avgUtilization >= 80 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 ml-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 ml-1" />
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Horas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {metrics.totalHours}h
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taxa Média/Hora
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {metrics.avgHourlyRate}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Custo Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {metrics.totalCost.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Expansíveis */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filtros Avançados</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Limpar Filtros
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filtro por Base */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base
              </label>
              <select
                value={filters.base}
                onChange={(e) => handleFilterChange('base', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Todas as bases</option>
                {mockData.bases.map(base => (
                  <option key={base} value={base}>{base}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Equipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipe
              </label>
              <select
                value={filters.team}
                onChange={(e) => handleFilterChange('team', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Todas as equipes</option>
                {mockData.teams.map(team => (
                  <option key={team.id} value={team.name}>{team.name}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Pessoa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pessoa
              </label>
              <input
                type="text"
                value={filters.person}
                onChange={(e) => handleFilterChange('person', e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Filtro por Projeto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Projeto
              </label>
              <select
                value={filters.project}
                onChange={(e) => handleFilterChange('project', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Todos os projetos</option>
                {mockData.projects.map(project => (
                  <option key={project.id} value={project.name}>{project.name}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grade de Alocação */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Grade de Alocação</h3>
            <div className="flex items-center space-x-2">
              <EyeIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                Visualização: {viewOptions.find(v => v.value === selectedView)?.label}
              </span>
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma pessoa encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Ajuste os filtros para visualizar os recursos
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Pessoa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipe
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa/Hora
                  </th>
                  {mockData.projects.map(project => (
                    <th key={project.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      <div className="flex flex-col items-center">
                        <span className="truncate max-w-[100px]" title={project.name}>
                          {project.name}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          project.priority === 'high' ? 'bg-red-100 text-red-800' :
                          project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.priority === 'high' ? 'Alta' : 
                           project.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilização
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Horas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeople.map((person) => {
                  const personAllocations = mockData.allocations.filter(a => a.personId === person.id);
                  const totalHours = personAllocations.reduce((sum, a) => sum + a.hours, 0);
                  const totalUtilization = personAllocations.reduce((sum, a) => sum + a.utilization, 0);
                  
                  return (
                    <tr key={person.id} className={`hover:bg-gray-50 ${person.status === 'inactive' ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {person.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {person.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {person.status === 'active' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Ativo
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Inativo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {person.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.base}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.team}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        R$ {person.hourlyRate}
                      </td>
                      {mockData.projects.map(project => {
                        const allocation = personAllocations.find(a => a.projectId === project.id);
                        const hours = allocation ? allocation.hours : 0;
                        const utilization = allocation ? allocation.utilization : 0;
                        
                        return (
                          <td key={project.id} className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">
                                {hours}h
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    utilization === 0 ? 'bg-gray-300' :
                                    utilization <= 25 ? 'bg-red-400' :
                                    utilization <= 50 ? 'bg-yellow-400' :
                                    utilization <= 75 ? 'bg-blue-400' :
                                    'bg-green-400'
                                  }`}
                                  style={{ width: `${Math.min(utilization, 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {utilization}%
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-medium ${
                            totalUtilization === 0 ? 'text-gray-500' :
                            totalUtilization <= 50 ? 'text-red-600' :
                            totalUtilization <= 80 ? 'text-yellow-600' :
                            totalUtilization <= 100 ? 'text-green-600' :
                            'text-red-600'
                          }`}>
                            {totalUtilization}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                totalUtilization === 0 ? 'bg-gray-300' :
                                totalUtilization <= 50 ? 'bg-red-400' :
                                totalUtilization <= 80 ? 'bg-yellow-400' :
                                totalUtilization <= 100 ? 'bg-green-400' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(totalUtilization, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {totalHours}h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo por Projeto */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo por Projeto</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockData.projects.map(project => {
            const projectAllocations = mockData.allocations.filter(a => a.projectId === project.id);
            const totalHours = projectAllocations.reduce((sum, a) => sum + a.hours, 0);
            const avgUtilization = projectAllocations.length > 0 
              ? projectAllocations.reduce((sum, a) => sum + a.utilization, 0) / projectAllocations.length 
              : 0;
            const peopleCount = new Set(projectAllocations.map(a => a.personId)).size;
            
            return (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate" title={project.name}>
                    {project.name}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    project.priority === 'high' ? 'bg-red-100 text-red-800' :
                    project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {project.priority === 'high' ? 'Alta' : 
                     project.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pessoas:</span>
                    <span className="font-medium">{peopleCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Horas:</span>
                    <span className="font-medium">{totalHours}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utilização Média:</span>
                    <span className={`font-medium ${
                      avgUtilization <= 50 ? 'text-red-600' :
                      avgUtilization <= 80 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {Math.round(avgUtilization)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        avgUtilization <= 50 ? 'bg-red-400' :
                        avgUtilization <= 80 ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}
                      style={{ width: `${Math.min(avgUtilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relatórios e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Utilização */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Tendência de Utilização</h3>
            <PresentationChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'utilization' ? `${value}%` : 
                    name === 'hours' ? `${value}h` : 
                    `R$ ${value.toLocaleString()}`,
                    name === 'utilization' ? 'Utilização' :
                    name === 'hours' ? 'Horas' : 'Custo'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Equipe */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Distribuição por Equipe</h3>
            <DocumentChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.teamDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="people"
                  label={({ team, people }) => `${team}: ${people}`}
                >
                  {mockData.teamDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} pessoas`, 'Quantidade']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilização por Base */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Utilização por Base</h3>
            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.utilizationByBase}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="base" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'utilization' ? `${value}%` : 
                    name === 'people' ? `${value} pessoas` : 
                    `${value}h`,
                    name === 'utilization' ? 'Utilização' :
                    name === 'people' ? 'Pessoas' : 'Horas'
                  ]}
                />
                <Bar dataKey="utilization" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolução de Custos */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Evolução de Custos</h3>
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Custo Total']}
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Análise Detalhada */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Análise Detalhada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Indicadores de Performance */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Indicadores de Performance</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Taxa de Ocupação</span>
                <span className="text-sm font-medium text-green-600">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Eficiência de Alocação</span>
                <span className="text-sm font-medium text-blue-600">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Recursos Subutilizados</span>
                <span className="text-sm font-medium text-red-600">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Recursos Sobrecarregados</span>
                <span className="text-sm font-medium text-yellow-600">0</span>
              </div>
            </div>
          </div>

          {/* Alertas e Recomendações */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Alertas e Recomendações</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Maria Oliveira está subutilizada (50%)</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Equipe Frontend bem balanceada</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-600">Considere redistribuir tarefas do E-commerce</span>
              </div>
            </div>
          </div>

          {/* Capacidade vs Demanda */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Capacidade vs Demanda</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Capacidade Total</span>
                <span className="text-sm font-medium text-gray-900">160h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Demanda Atual</span>
                <span className="text-sm font-medium text-gray-900">136h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Capacidade Ociosa</span>
                <span className="text-sm font-medium text-green-600">24h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Projeções */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Projeções</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Próximo Mês</span>
                <span className="text-sm font-medium text-blue-600">88%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Custo Estimado</span>
                <span className="text-sm font-medium text-gray-900">R$ 44.800</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tendência</span>
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsagePanel;

