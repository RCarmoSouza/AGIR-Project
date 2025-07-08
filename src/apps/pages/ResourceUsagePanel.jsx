import React, { useState, useMemo } from 'react';
import { 
  UserGroupIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ResourceUsagePanel = () => {
  // Estados para filtros
  const [filters, setFilters] = useState({
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    base: '',
    team: '',
    specialization: '',
    person: '',
    project: '',
    status: 'active'
  });

  // Dados mock para demonstração
  const mockData = {
    people: [
      { 
        id: 1, 
        name: 'Ana Silva', 
        role: 'Gerente de Projetos', 
        base: 'Porto Alegre', 
        team: 'Desenvolvimento Frontend',
        specialization: 'Gestão de Projetos',
        hourlyRate: 150, 
        status: 'active',
        hoursPerDay: 8
      },
      { 
        id: 2, 
        name: 'Carlos Santos', 
        role: 'Desenvolvedor Senior', 
        base: 'São Paulo', 
        team: 'Desenvolvimento Backend',
        specialization: 'Full Stack',
        hourlyRate: 120, 
        status: 'active',
        hoursPerDay: 8
      },
      { 
        id: 3, 
        name: 'Maria Costa', 
        role: 'Designer UX/UI', 
        base: 'Rio de Janeiro', 
        team: 'Design',
        specialization: 'UI/UX Design',
        hourlyRate: 100, 
        status: 'inactive',
        hoursPerDay: 8
      },
      { 
        id: 4, 
        name: 'João Oliveira', 
        role: 'Desenvolvedor Junior', 
        base: 'Porto Alegre', 
        team: 'Desenvolvimento Frontend',
        specialization: 'Front-End',
        hourlyRate: 80, 
        status: 'active',
        hoursPerDay: 8
      }
    ],
    bases: ['Porto Alegre', 'São Paulo', 'Rio de Janeiro'],
    teams: ['Desenvolvimento Frontend', 'Desenvolvimento Backend', 'Design', 'QA'],
    projects: [
      { id: 1, name: 'Sistema ERP', priority: 'high' },
      { id: 2, name: 'App Mobile', priority: 'medium' },
      { id: 3, name: 'Portal Cliente', priority: 'low' }
    ],
    allocations: [
      { personId: 1, projectId: 1, hours: 32 },
      { personId: 2, projectId: 1, hours: 40 },
      { personId: 2, projectId: 2, hours: 8 },
      { personId: 3, projectId: 3, hours: 0 }
      // João Oliveira (id: 4) não está alocado em nenhum projeto
    ]
  };

  // Lista de especializações
  const specializations = [
    'Full Stack', 'Front-End', 'Back-End', 'UI/UX Design', 'DevOps',
    'Mobile', 'Data Science', 'QA/Testing', 'Gestão de Projetos',
    'Arquitetura de Software', 'Segurança', 'Cloud Computing',
    'Machine Learning', 'Blockchain', 'IoT', 'Game Development',
    'Business Intelligence', 'Consultoria Técnica', 'Suporte Técnico'
  ];

  // Função para calcular dias úteis
  const calculateWorkingDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Não é domingo (0) nem sábado (6)
        workingDays++;
      }
    }
    
    return workingDays;
  };

  // Função para calcular horas contratuais baseado no período
  const calculateContractHours = (person, startDate, endDate) => {
    if (person.status !== 'active') return 0;
    
    const workingDays = calculateWorkingDays(startDate, endDate);
    const hoursPerDay = person.hoursPerDay || 8;
    
    return workingDays * hoursPerDay;
  };

  // Função para calcular horas alocadas baseado no período
  const calculateAllocatedHours = (person, startDate, endDate) => {
    const personAllocations = mockData.allocations.filter(a => a.personId === person.id);
    
    const totalAllocatedHours = personAllocations.reduce((sum, allocation) => {
      const workingDays = calculateWorkingDays(startDate, endDate);
      const dailyAllocation = allocation.hours / 5; // Assumindo distribuição semanal
      return sum + (dailyAllocation * workingDays);
    }, 0);
    
    return Math.round(totalAllocatedHours);
  };

  // Função para calcular horas disponíveis (Horas Contratuais - Horas Alocadas)
  const calculateAvailableHours = (person, startDate, endDate) => {
    const contractHours = calculateContractHours(person, startDate, endDate);
    const allocatedHours = calculateAllocatedHours(person, startDate, endDate);
    
    return Math.max(0, contractHours - allocatedHours);
  };

  // Função para verificar se uma pessoa está alocada em um projeto específico
  const isPersonAllocatedToProject = (personId, projectId) => {
    return mockData.allocations.some(a => a.personId === personId && a.projectId === parseInt(projectId));
  };

  // Filtrar dados baseado nos filtros
  const filteredPeople = useMemo(() => {
    return mockData.people.filter(person => {
      // Filtros básicos
      if (filters.base && person.base !== filters.base) return false;
      if (filters.team && person.team !== filters.team) return false;
      if (filters.specialization && person.specialization !== filters.specialization) return false;
      if (filters.person && !person.name.toLowerCase().includes(filters.person.toLowerCase())) return false;
      if (filters.status && person.status !== filters.status) return false;
      
      // Filtro por projeto - apenas se um projeto específico for selecionado
      if (filters.project) {
        const projectId = mockData.projects.find(p => p.name === filters.project)?.id;
        if (projectId) {
          return isPersonAllocatedToProject(person.id, projectId);
        }
      }
      
      return true;
    });
  }, [filters]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalPeople = filteredPeople.length;
    const activePeople = filteredPeople.filter(p => p.status === 'active').length;
    
    let totalContractHours = 0;
    let totalAllocatedHours = 0;
    let totalAvailableHours = 0;
    let totalCost = 0;
    
    filteredPeople.forEach(person => {
      const contractHours = calculateContractHours(person, filters.startDate, filters.endDate);
      const allocatedHours = calculateAllocatedHours(person, filters.startDate, filters.endDate);
      const availableHours = calculateAvailableHours(person, filters.startDate, filters.endDate);
      
      totalContractHours += contractHours;
      totalAllocatedHours += allocatedHours;
      totalAvailableHours += availableHours;
      totalCost += person.hourlyRate * contractHours;
    });
    
    const utilization = totalContractHours > 0 ? Math.round((totalAllocatedHours / totalContractHours) * 100) : 0;
    const averageRate = activePeople > 0 ? Math.round(filteredPeople.filter(p => p.status === 'active').reduce((sum, p) => sum + p.hourlyRate, 0) / activePeople) : 0;
    
    return {
      totalPeople,
      activePeople,
      utilization,
      totalContractHours,
      totalAllocatedHours,
      totalAvailableHours,
      averageRate,
      totalCost
    };
  }, [filteredPeople, filters.startDate, filters.endDate]);

  // Dados para gráficos
  const chartData = useMemo(() => {
    // Dados para gráfico de utilização por pessoa
    const utilizationByPerson = filteredPeople.map(person => {
      const contractHours = calculateContractHours(person, filters.startDate, filters.endDate);
      const allocatedHours = calculateAllocatedHours(person, filters.startDate, filters.endDate);
      const utilization = contractHours > 0 ? Math.round((allocatedHours / contractHours) * 100) : 0;
      
      return {
        name: person.name,
        utilization: utilization
      };
    });

    // Dados para gráfico de distribuição de horas
    const hoursDistribution = [
      { name: 'Alocadas', value: metrics.totalAllocatedHours },
      { name: 'Disponíveis', value: metrics.totalAvailableHours }
    ];

    // Dados para gráfico de distribuição por especialização
    const specializationGroups = {};
    filteredPeople.forEach(person => {
      if (!specializationGroups[person.specialization]) {
        specializationGroups[person.specialization] = 0;
      }
      specializationGroups[person.specialization] += calculateContractHours(person, filters.startDate, filters.endDate);
    });

    const hoursPerSpecialization = Object.keys(specializationGroups).map(spec => ({
      name: spec,
      hours: specializationGroups[spec]
    }));

    return {
      utilizationByPerson,
      hoursDistribution,
      hoursPerSpecialization
    };
  }, [filteredPeople, filters.startDate, filters.endDate, metrics]);

  // Cores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      base: '',
      team: '',
      specialization: '',
      person: '',
      project: '',
      status: 'active'
    });
  };

  // Função para atualizar filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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
          {/* Período - Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">De:</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Período - Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Até:</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filtros Avançados - Sempre Visíveis */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Filtro por Base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipe</label>
            <select
              value={filters.team}
              onChange={(e) => handleFilterChange('team', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="">Todas as equipes</option>
              {mockData.teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Especialização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialização</label>
            <select
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="">Todas as especializações</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Pessoa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa</label>
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={filters.person}
              onChange={(e) => handleFilterChange('person', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filtro por Projeto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Projeto</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Total de Pessoas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Pessoas</dt>
                  <dd className="text-lg font-medium text-gray-900">{metrics.totalPeople}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Pessoas Ativas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pessoas Ativas</dt>
                  <dd className="text-lg font-medium text-gray-900">{metrics.activePeople}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Utilização Média */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Utilização Média</dt>
                  <dd className="flex items-center">
                    <span className="text-lg font-medium text-gray-900">{metrics.utilization}%</span>
                    {metrics.utilization >= 80 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 ml-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 ml-1" />
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total de Horas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Horas</dt>
                  <dd className="text-lg font-medium text-gray-900">{metrics.totalContractHours}h</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Taxa Média/Hora */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Taxa Média/Hora</dt>
                  <dd className="text-lg font-medium text-gray-900">R$ {metrics.averageRate}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Custo Total */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Custo Total</dt>
                  <dd className="text-lg font-medium text-gray-900">R$ {metrics.totalCost.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Utilização por Pessoa */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Utilização por Pessoa</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.utilizationByPerson}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilização']} />
                <Legend />
                <Bar 
                  dataKey="utilization" 
                  name="Utilização" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Distribuição de Horas */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Horas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.hoursDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.hoursDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}h`, 'Horas']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Horas por Especialização */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Horas por Especialização</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.hoursPerSpecialization}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="h" />
                <Tooltip formatter={(value) => [`${value}h`, 'Horas']} />
                <Legend />
                <Bar 
                  dataKey="hours" 
                  name="Horas" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grade de Alocação */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Grade de Alocação</h3>
          </div>
        </div>
        
        {filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma pessoa encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">Ajuste os filtros para ver os resultados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pessoa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Informações Profissionais</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas Contratuais</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas Alocadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas Disponíveis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilização</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custo Estimado de Disponibilidade</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeople.map((person) => {
                  const contractHours = calculateContractHours(person, filters.startDate, filters.endDate);
                  const allocatedHours = calculateAllocatedHours(person, filters.startDate, filters.endDate);
                  const availableHours = calculateAvailableHours(person, filters.startDate, filters.endDate);
                  const utilization = contractHours > 0 ? Math.round((allocatedHours / contractHours) * 100) : 0;
                  // Alterado: Custo estimado de disponibilidade = Taxa × Horas Disponíveis
                  const estimatedAvailabilityCost = person.hourlyRate * availableHours;
                  const workingDays = calculateWorkingDays(filters.startDate, filters.endDate);

                  return (
                    <tr key={person.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                person.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {person.status === 'active' ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{person.role}</div>
                        <div className="text-xs text-gray-500">{person.team}</div>
                        <div className="text-xs text-gray-500">{person.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{person.base}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contractHours}h
                          <div className="text-xs text-gray-500">
                            {person.status === 'active' ? `${workingDays} dias úteis` : 'Inativo'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {allocatedHours}h
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                utilization >= 100 ? 'bg-red-500' : 
                                utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {availableHours}h
                          <div className="text-xs text-gray-500">
                            {contractHours > 0 ? `${Math.round((availableHours / contractHours) * 100)}% livre` : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          utilization >= 100 ? 'text-red-600' : 
                          utilization >= 80 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {utilization}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          R$ {estimatedAvailabilityCost.toLocaleString()}
                          <div className="text-xs text-gray-500">
                            {availableHours}h × R$ {person.hourlyRate}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo do Rodapé */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo de Alocação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Horas Contratuais</h4>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalContractHours}h</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Horas Alocadas</h4>
              <p className="text-2xl font-bold text-blue-600">{metrics.totalAllocatedHours}h</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Horas Disponíveis</h4>
              <p className="text-2xl font-bold text-green-600">{metrics.totalAvailableHours}h</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Utilização Média</h4>
              <p className="text-2xl font-bold text-gray-900">{metrics.utilization}%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Taxa Média/Hora</h4>
              <p className="text-2xl font-bold text-gray-900">R$ {metrics.averageRate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Custo Total</h4>
              <p className="text-2xl font-bold text-red-600">R$ {metrics.totalCost.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Período</h4>
              <p className="text-lg font-medium text-gray-900">
                {new Date(filters.startDate).toLocaleDateString('pt-BR')} a {new Date(filters.endDate).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500">
                {calculateWorkingDays(filters.startDate, filters.endDate)} dias úteis
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Pessoas Ativas</h4>
              <p className="text-lg font-medium text-gray-900">
                {metrics.activePeople} de {metrics.totalPeople} ({Math.round((metrics.activePeople / metrics.totalPeople) * 100)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsagePanel;

