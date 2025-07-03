import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserMinus,
  Crown,
  Building,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';

const TeamsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('geral');

  // Dados mock das equipes
  const [teams] = useState([
    {
      id: 1,
      name: 'Desenvolvimento Frontend',
      description: 'Equipe responsável pelo desenvolvimento de interfaces e experiência do usuário',
      leader: { id: 1, name: 'Ana Silva', avatar: 'AS' },
      members: [
        { id: 1, name: 'Ana Silva', role: 'Líder', avatar: 'AS' },
        { id: 2, name: 'Carlos Santos', role: 'Desenvolvedor Sênior', avatar: 'CS' },
        { id: 3, name: 'Maria Oliveira', role: 'UX/UI Designer', avatar: 'MO' }
      ],
      base: 'Porto Alegre',
      projects: ['Sistema de E-commerce', 'App Mobile'],
      status: 'Ativa',
      created: '2024-01-15',
      performance: 92
    },
    {
      id: 2,
      name: 'Desenvolvimento Backend',
      description: 'Equipe responsável pela arquitetura e desenvolvimento de APIs e serviços',
      leader: { id: 4, name: 'Pedro Costa', avatar: 'PC' },
      members: [
        { id: 4, name: 'Pedro Costa', role: 'Líder Técnico', avatar: 'PC' },
        { id: 5, name: 'Julia Ferreira', role: 'Desenvolvedora Pleno', avatar: 'JF' }
      ],
      base: 'São Paulo',
      projects: ['Sistema de E-commerce'],
      status: 'Ativa',
      created: '2024-02-01',
      performance: 88
    },
    {
      id: 3,
      name: 'Quality Assurance',
      description: 'Equipe responsável pela qualidade e testes dos produtos',
      leader: { id: 6, name: 'Roberto Lima', avatar: 'RL' },
      members: [
        { id: 6, name: 'Roberto Lima', role: 'QA Lead', avatar: 'RL' },
        { id: 7, name: 'Fernanda Costa', role: 'QA Analyst', avatar: 'FC' }
      ],
      base: 'Mendonça',
      projects: ['Sistema de E-commerce', 'Website Corporativo'],
      status: 'Ativa',
      created: '2024-01-20',
      performance: 95
    },
    {
      id: 4,
      name: 'DevOps & Infraestrutura',
      description: 'Equipe responsável pela infraestrutura e deploy dos sistemas',
      leader: { id: 8, name: 'Lucas Silva', avatar: 'LS' },
      members: [
        { id: 8, name: 'Lucas Silva', role: 'DevOps Engineer', avatar: 'LS' }
      ],
      base: 'Porto Alegre',
      projects: ['Todos os projetos'],
      status: 'Ativa',
      created: '2024-03-01',
      performance: 90
    },
    {
      id: 5,
      name: 'Produto & Design',
      description: 'Equipe responsável pela estratégia de produto e design',
      leader: null,
      members: [],
      base: 'São Paulo',
      projects: [],
      status: 'Inativa',
      created: '2024-04-01',
      performance: 0
    },
    {
      id: 6,
      name: 'Marketing Digital',
      description: 'Equipe responsável pelas estratégias de marketing e comunicação',
      leader: { id: 9, name: 'Carla Mendes', avatar: 'CM' },
      members: [
        { id: 9, name: 'Carla Mendes', role: 'Marketing Manager', avatar: 'CM' },
        { id: 10, name: 'Bruno Santos', role: 'Social Media', avatar: 'BS' }
      ],
      base: 'São Paulo',
      projects: ['Website Corporativo'],
      status: 'Ativa',
      created: '2024-02-15',
      performance: 85
    }
  ]);

  // Dados mock das pessoas disponíveis
  const [availablePeople] = useState([
    { id: 1, name: 'Ana Silva', role: 'Gerente de Projetos', avatar: 'AS' },
    { id: 2, name: 'Carlos Santos', role: 'Desenvolvedor Full Stack', avatar: 'CS' },
    { id: 3, name: 'Maria Oliveira', role: 'UX/UI Designer', avatar: 'MO' },
    { id: 4, name: 'Pedro Costa', role: 'Desenvolvedor Junior', avatar: 'PC' },
    { id: 5, name: 'Julia Ferreira', role: 'Analista de QA', avatar: 'JF' },
    { id: 6, name: 'Roberto Lima', role: 'QA Lead', avatar: 'RL' },
    { id: 7, name: 'Fernanda Costa', role: 'QA Analyst', avatar: 'FC' },
    { id: 8, name: 'Lucas Silva', role: 'DevOps Engineer', avatar: 'LS' },
    { id: 9, name: 'Carla Mendes', role: 'Marketing Manager', avatar: 'CM' },
    { id: 10, name: 'Bruno Santos', role: 'Social Media', avatar: 'BS' }
  ]);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.base.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTeams = teams.filter(team => team.status === 'Ativa');
  const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
  const avgPerformance = Math.round(
    teams.filter(team => team.status === 'Ativa')
         .reduce((sum, team) => sum + team.performance, 0) / activeTeams.length
  );

  const openModal = (team = null) => {
    setSelectedTeam(team);
    setActiveTab('geral');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  const getStatusColor = (status) => {
    return status === 'Ativa' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Equipes</h1>
        <p className="text-gray-600">Gerencie equipes, membros e estrutura organizacional</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Equipe
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Organograma
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Equipes</p>
              <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+1 este mês</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Equipes Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{activeTeams.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">83% do total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Membros</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-blue-600 mt-2">Distribuídos em {activeTeams.length} equipes</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performance Média</p>
              <p className="text-2xl font-bold text-gray-900">{avgPerformance}%</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+3% vs mês anterior</p>
        </div>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Equipes */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Equipes Cadastradas ({filteredTeams.length})
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header da equipe */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                        {team.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{team.description}</p>
                    
                    {/* Informações básicas */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {team.base}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {team.members.length} membros
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Criada em {new Date(team.created).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(team)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Líder */}
                {team.leader && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Líder da Equipe</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {team.leader.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{team.leader.name}</p>
                        <div className="flex items-center gap-1">
                          <Crown className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-500">Líder</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Membros */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Membros da Equipe</p>
                  <div className="flex flex-wrap gap-2">
                    {team.members.slice(0, 5).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"
                      >
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {member.avatar}
                        </div>
                        <span className="text-sm text-gray-700">{member.name}</span>
                      </div>
                    ))}
                    {team.members.length > 5 && (
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm text-gray-500">+{team.members.length - 5} mais</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance


 e Projetos */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Performance</p>
                    <p className={`font-semibold ${getPerformanceColor(team.performance)}`}>
                      {team.performance}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Projetos Ativos</p>
                    <p className="font-semibold text-gray-900">{team.projects.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTeam ? 'Editar Equipe' : 'Nova Equipe'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Abas */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('geral')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'geral'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Informações Gerais
                </button>
                <button
                  onClick={() => setActiveTab('membros')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'membros'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Membros
                </button>
                <button
                  onClick={() => setActiveTab('projetos')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'projetos'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Projetos
                </button>
              </div>

              {/* Conteúdo das abas */}
              {activeTab === 'geral' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Equipe *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Desenvolvimento Frontend"
                        defaultValue={selectedTeam?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base *
                      </label>
                      <select
                        defaultValue={selectedTeam?.base || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione uma base</option>
                        <option value="Porto Alegre">Porto Alegre</option>
                        <option value="São Paulo">São Paulo</option>
                        <option value="Mendonça">Mendonça</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      placeholder="Descreva o propósito e responsabilidades da equipe..."
                      defaultValue={selectedTeam?.description || ''}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Líder da Equipe
                      </label>
                      <select
                        defaultValue={selectedTeam?.leader?.id || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Nenhum líder</option>
                        {availablePeople.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.name} - {person.role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        defaultValue={selectedTeam?.status || 'Ativa'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Ativa">Ativa</option>
                        <option value="Inativa">Inativa</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'membros' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Membros da Equipe</h3>
                    <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm">
                      <UserPlus className="w-4 h-4" />
                      Adicionar Membro
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(selectedTeam?.members || []).map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-800">
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projetos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Projetos Associados</h3>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm">
                      <Plus className="w-4 h-4" />
                      Associar Projeto
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(selectedTeam?.projects || []).map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{project}</p>
                          <p className="text-sm text-gray-500">Projeto ativo</p>
                        </div>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {selectedTeam ? 'Salvar Alterações' : 'Criar Equipe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsManagement;

