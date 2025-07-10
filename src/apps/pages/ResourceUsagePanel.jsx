import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const ResourceUsagePanel = () => {
  const navigate = useNavigate();
  
  // Estado para controlar os filtros
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

  // Estado para controlar a visualização (por pessoa ou por especialização)
  const [viewMode, setViewMode] = useState('person'); // 'person' ou 'specialization'

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
        activeContractType: 'efetivo', // Tipo de contrato ativo
        calendarId: 1 // ID do calendário associado
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
        activeContractType: 'efetivo',
        calendarId: 2
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
        activeContractType: 'meio_turno',
        calendarId: 3
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
        activeContractType: 'estagio',
        calendarId: 1
      }
    ],
    // Dados dos calendários com horários por contrato
    calendars: [
      {
        id: 1,
        name: 'Padrão Porto Alegre',
        contractSchedules: {
          efetivo: { dailyHours: 8, enabled: true },
          estagio: { dailyHours: 6, enabled: true },
          meio_turno: { dailyHours: 4, enabled: true },
          horista: { dailyHours: 0, enabled: false }
        }
      },
      {
        id: 2,
        name: 'Padrão São Paulo',
        contractSchedules: {
          efetivo: { dailyHours: 8, enabled: true },
          estagio: { dailyHours: 6, enabled: true },
          meio_turno: { dailyHours: 4, enabled: true },
          horista: { dailyHours: 0, enabled: false }
        }
      },
      {
        id: 3,
        name: 'Calendário Flexível',
        contractSchedules: {
          efetivo: { dailyHours: 6, enabled: true },
          estagio: { dailyHours: 4, enabled: true },
          meio_turno: { dailyHours: 3, enabled: true },
          horista: { dailyHours: 0, enabled: false }
        }
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

  // Função para calcular horas contratuais baseado no período, contrato ativo e calendário
  const calculateContractHours = (person, startDate, endDate) => {
    if (person.status !== 'active') return 0;
    
    // Buscar o calendário da pessoa
    const calendar = mockData.calendars.find(c => c.id === person.calendarId);
    if (!calendar) return 0;
    
    // Buscar o horário específico para o tipo de contrato ativo
    const contractSchedule = calendar.contractSchedules[person.activeContractType];
    if (!contractSchedule || !contractSchedule.enabled) return 0;
    
    // Para contratos horistas (dailyHours = 0), retornar 0 horas contratuais
    if (contractSchedule.dailyHours === 0) return 0;
    
    const workingDays = calculateWorkingDays(startDate, endDate);
    const hoursPerDay = contractSchedule.dailyHours;
    
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

  // Dados agregados por especialização
  const specializationData = useMemo(() => {
    const data = {};
    
    // Agrupar pessoas por especialização
    filteredPeople.forEach(person => {
      if (!data[person.specialization]) {
        data[person.specialization] = {
          specialization: person.specialization,
          people: [],
          contractHours: 0,
          allocatedHours: 0,
          availableHours: 0,
          utilization: 0,
          averageRate: 0
        };
      }
      
      data[person.specialization].people.push(person);
    });
    
    // Calcular métricas para cada especialização
    Object.values(data).forEach(item => {
      const activePeople = item.people.filter(p => p.status === 'active');
      
      item.people.forEach(person => {
        const contractHours = calculateContractHours(person, filters.startDate, filters.endDate);
        const allocatedHours = calculateAllocatedHours(person, filters.startDate, filters.endDate);
        const availableHours = calculateAvailableHours(person, filters.startDate, filters.endDate);
        
        item.contractHours += contractHours;
        item.allocatedHours += allocatedHours;
        item.availableHours += availableHours;
      });
      
      item.utilization = item.contractHours > 0 ? Math.round((item.allocatedHours / item.contractHours) * 100) : 0;
      item.averageRate = activePeople.length > 0 ? Math.round(activePeople.reduce((sum, p) => sum + p.hourlyRate, 0) / activePeople.length) : 0;
      item.estimatedAvailabilityCost = item.availableHours * item.averageRate;
    });
    
    return Object.values(data);
  }, [filteredPeople, filters.startDate, filters.endDate]);

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

  // Função para navegar para a página de detalhamento
  const navigateToDetail = (specialization) => {
    // Em uma aplicação real, isso seria uma navegação para outra rota
    // Por enquanto, vamos apenas simular alterando o filtro de especialização
    handleFilterChange('specialization', specialization);
    // E alterando a visualização para pessoas
    setViewMode('person');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel de Uso de Recursos</h1>
          <p className="text-gray-600">Visualize e gerencie a alocação de recursos em projetos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">De:</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Até:</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Filtros Avançados</h2>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded"
          >
            Limpar Filtros
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Base</label>
            <select
              value={filters.base}
              onChange={(e) => handleFilterChange('base', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Todas as bases</option>
              {mockData.bases.map((base, index) => (
                <option key={index} value={base}>{base}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Equipe</label>
            <select
              value={filters.team}
              onChange={(e) => handleFilterChange('team', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Todas as equipes</option>
              {mockData.teams.map((team, index) => (
                <option key={index} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Especialização</label>
            <select
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Todas as especializações</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Pessoa</label>
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={filters.person}
              onChange={(e) => handleFilterChange('person', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Projeto</label>
            <select
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Todos os projetos</option>
              {mockData.projects.map((project, index) => (
                <option key={index} value={project.name}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-gray-100 p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Pessoas</p>
            <p className="text-xl font-bold">{metrics.totalPeople}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pessoas Ativas</p>
            <p className="text-xl font-bold">{metrics.activePeople}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Utilização Média</p>
            <p className="text-xl font-bold">{metrics.utilization}%</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Horas</p>
            <p className="text-xl font-bold">{metrics.totalContractHours}h</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Taxa Média/Hora</p>
            <p className="text-xl font-bold">R$ {metrics.averageRate}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Custo Total</p>
            <p className="text-xl font-bold">R$ {metrics.totalCost.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Utilização por Pessoa */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Utilização por Pessoa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.utilizationByPerson}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilização']} />
                <Bar dataKey="utilization" fill="#8884d8">
                  {chartData.utilizationByPerson.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.utilization >= 100 ? '#ef4444' : 
                        entry.utilization >= 80 ? '#f59e0b' : '#22c55e'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Distribuição de Horas */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Horas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.hoursDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.hoursDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}h`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Horas por Especialização */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Horas por Especialização</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.hoursPerSpecialization}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}h`, 'Horas']} />
                <Bar dataKey="hours" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seletor de Visualização */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Grade de Alocação</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('person')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'person' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Por Pessoa
            </button>
            <button
              onClick={() => setViewMode('specialization')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'specialization' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Por Especialização
            </button>
          </div>
        </div>

        {/* Grade de Alocação por Pessoa */}
        {viewMode === 'person' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informações Profissionais
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas Contratuais
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas Alocadas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas Disponíveis
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilização
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo Estimado de Disponibilidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeople.map(person => {
                  const contractHours = calculateContractHours(person, filters.startDate, filters.endDate);
                  const allocatedHours = calculateAllocatedHours(person, filters.startDate, filters.endDate);
                  const availableHours = calculateAvailableHours(person, filters.startDate, filters.endDate);
                  const utilization = contractHours > 0 ? Math.round((allocatedHours / contractHours) * 100) : 0;
                  const workingDays = calculateWorkingDays(filters.startDate, filters.endDate);
                  const estimatedAvailabilityCost = availableHours * person.hourlyRate;

                  return (
                    <tr key={person.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {person.name}
                                </div>
                                <div className={`text-xs ${person.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                  {person.status === 'active' ? 'Ativo' : 'Inativo'}
                                </div>
                              </div>
                              <button
                                onClick={() => navigate(`/people/people/${person.id}`)}
                                className="ml-2 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Visualizar pessoa"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
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

        {/* Grade de Alocação por Especialização */}
        {viewMode === 'specialization' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialização
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas Contratuais
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas Alocadas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas Disponíveis
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilização
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo Estimado de Disponibilidade
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {specializationData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.specialization}</div>
                      <div className="text-xs text-gray-500">{item.people.length} pessoas</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.contractHours}h
                        <div className="text-xs text-gray-500">
                          {calculateWorkingDays(filters.startDate, filters.endDate)} dias úteis
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.allocatedHours}h
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              item.utilization >= 100 ? 'bg-red-500' : 
                              item.utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(item.utilization, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.availableHours}h
                        <div className="text-xs text-gray-500">
                          {item.contractHours > 0 ? `${Math.round((item.availableHours / item.contractHours) * 100)}% livre` : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        item.utilization >= 100 ? 'text-red-600' : 
                        item.utilization >= 80 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.utilization}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        R$ {item.estimatedAvailabilityCost.toLocaleString()}
                        <div className="text-xs text-gray-500">
                          {item.availableHours}h × R$ {item.averageRate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigateToDetail(item.specialization)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded"
                      >
                        Detalhar
                      </button>
                    </td>
                  </tr>
                ))}
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

