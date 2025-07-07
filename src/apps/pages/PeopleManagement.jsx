import React, { useState } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
  FunnelIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const PeopleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [activeTab, setActiveTab] = useState('personal'); // personal, professional, hierarchy
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    base: '',
    status: '',
    level: '',
    skills: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    level: 'junior',
    specialization: '',
    base: '',
    calendar: '',
    skills: [],
    hourlyRate: 0,
    leader: '',
    status: 'active',
    admissionDate: '',
    dismissalDate: '',
    notes: '',
    // Históricos
    rateHistory: [],
    levelHistory: [],
    employmentHistory: []
  });

  // Mock data - em produção viria de uma API
  const [people, setPeople] = useState([
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      phone: '(11) 99999-1111',
      position: 'Gerente de Projetos',
      level: 'senior',
      specialization: 'Gestão de Projetos',
      base: 'Porto Alegre',
      calendar: 'Padrão Porto Alegre',
      skills: ['Gestão de Projetos', 'Scrum', 'Liderança'],
      hourlyRate: 150,
      leader: null,
      status: 'active',
      admissionDate: '2023-01-15',
      dismissalDate: null,
      notes: 'Gerente experiente com foco em metodologias ágeis',
      avatar: null,
      // Históricos
      rateHistory: [
        { date: '2023-01-15', oldRate: null, newRate: 130, reason: 'Admissão' },
        { date: '2023-07-01', oldRate: 130, newRate: 150, reason: 'Aumento por performance' }
      ],
      levelHistory: [
        { date: '2023-01-15', oldLevel: null, newLevel: 'pleno', reason: 'Admissão' },
        { date: '2023-10-01', oldLevel: 'pleno', newLevel: 'senior', reason: 'Promoção' }
      ],
      employmentHistory: [
        { type: 'admission', date: '2023-01-15', reason: 'Contratação inicial' }
      ]
    },
    {
      id: 2,
      name: 'Carlos Santos',
      email: 'carlos.santos@empresa.com',
      phone: '(11) 99999-2222',
      position: 'Desenvolvedor Full Stack',
      level: 'pleno',
      specialization: 'Full Stack',
      base: 'Porto Alegre',
      calendar: 'Padrão Porto Alegre',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      hourlyRate: 120,
      leader: 'Ana Silva',
      status: 'active',
      admissionDate: '2023-03-20',
      dismissalDate: null,
      notes: 'Desenvolvedor versátil com experiência em projetos complexos',
      avatar: null,
      // Históricos
      rateHistory: [
        { date: '2023-03-20', oldRate: null, newRate: 100, reason: 'Admissão' },
        { date: '2023-09-01', oldRate: 100, newRate: 120, reason: 'Aumento por performance' }
      ],
      levelHistory: [
        { date: '2023-03-20', oldLevel: null, newLevel: 'junior', reason: 'Admissão' },
        { date: '2023-09-01', oldLevel: 'junior', newLevel: 'pleno', reason: 'Promoção' }
      ],
      employmentHistory: [
        { type: 'admission', date: '2023-03-20', reason: 'Contratação inicial' }
      ]
    },
    {
      id: 3,
      name: 'Maria Oliveira',
      email: 'maria.oliveira@empresa.com',
      phone: '(11) 99999-3333',
      position: 'UX/UI Designer',
      level: 'pleno',
      specialization: 'UI/UX Design',
      base: 'São Paulo',
      calendar: 'Padrão São Paulo',
      skills: ['Figma', 'Adobe XD', 'Design System', 'Prototipagem'],
      hourlyRate: 110,
      leader: 'Ana Silva',
      status: 'active',
      admissionDate: '2023-02-10',
      dismissalDate: null,
      notes: 'Designer criativa com foco em experiência do usuário',
      avatar: null,
      // Históricos
      rateHistory: [
        { date: '2023-02-10', oldRate: null, newRate: 90, reason: 'Admissão' },
        { date: '2023-08-15', oldRate: 90, newRate: 110, reason: 'Aumento por performance' }
      ],
      levelHistory: [
        { date: '2023-02-10', oldLevel: null, newLevel: 'junior', reason: 'Admissão' },
        { date: '2023-08-15', oldLevel: 'junior', newLevel: 'pleno', reason: 'Promoção' }
      ],
      employmentHistory: [
        { type: 'admission', date: '2023-02-10', reason: 'Contratação inicial' }
      ]
    },
    {
      id: 4,
      name: 'Pedro Costa',
      email: 'pedro.costa@empresa.com',
      phone: '(11) 99999-4444',
      position: 'Desenvolvedor Junior',
      level: 'junior',
      specialization: 'Front-End',
      base: 'Mendonça',
      calendar: 'Padrão Interior',
      skills: ['JavaScript', 'HTML', 'CSS', 'Git'],
      hourlyRate: 80,
      leader: 'Carlos Santos',
      status: 'active',
      admissionDate: '2024-01-08',
      dismissalDate: null,
      notes: 'Desenvolvedor em início de carreira, muito dedicado',
      avatar: null,
      // Históricos
      rateHistory: [
        { date: '2024-01-08', oldRate: null, newRate: 80, reason: 'Admissão' }
      ],
      levelHistory: [
        { date: '2024-01-08', oldLevel: null, newLevel: 'junior', reason: 'Admissão' }
      ],
      employmentHistory: [
        { type: 'admission', date: '2024-01-08', reason: 'Contratação inicial' }
      ]
    },
    {
      id: 5,
      name: 'Julia Ferreira',
      email: 'julia.ferreira@empresa.com',
      phone: '(11) 99999-5555',
      position: 'Analista de QA',
      level: 'pleno',
      specialization: 'Testes e QA',
      base: 'São Paulo',
      calendar: 'Calendário Flexível',
      skills: ['Testes Automatizados', 'Selenium', 'Jest', 'Cypress'],
      hourlyRate: 100,
      leader: 'Ana Silva',
      status: 'inactive',
      admissionDate: '2023-05-15',
      dismissalDate: '2024-12-20',
      notes: 'Especialista em qualidade de software',
      avatar: null,
      // Históricos
      rateHistory: [
        { date: '2023-05-15', oldRate: null, newRate: 85, reason: 'Admissão' },
        { date: '2023-11-01', oldRate: 85, newRate: 100, reason: 'Aumento por performance' }
      ],
      levelHistory: [
        { date: '2023-05-15', oldLevel: null, newLevel: 'junior', reason: 'Admissão' },
        { date: '2023-11-01', oldLevel: 'junior', newLevel: 'pleno', reason: 'Promoção' }
      ],
      employmentHistory: [
        { type: 'admission', date: '2023-05-15', reason: 'Contratação inicial' },
        { type: 'dismissal', date: '2024-12-20', reason: 'Mudança para outra empresa' }
      ]
    }
  ]);

  // Dados auxiliares
  const bases = ['Porto Alegre', 'São Paulo', 'Mendonça'];
  const calendars = ['Padrão Porto Alegre', 'Padrão São Paulo', 'Padrão Interior', 'Calendário Flexível'];
  const specializations = [
    'Full Stack',
    'Front-End',
    'Back-End',
    'Mobile',
    'DevOps',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'Product Design',
    'Scrum Master',
    'Product Owner',
    'Arquitetura de Software',
    'Segurança da Informação',
    'Cloud Computing',
    'Business Intelligence',
    'Análise de Dados',
    'Testes e QA',
    'Infraestrutura',
    'Gestão de Projetos',
    'Consultoria Técnica'
  ];
  const levels = [
    { value: 'intern', label: 'Estágio' },
    { value: 'junior', label: 'Júnior' },
    { value: 'pleno', label: 'Pleno' },
    { value: 'senior', label: 'Sênior' },
    { value: 'specialist', label: 'Especialista' },
    { value: 'lead', label: 'Líder Técnico' },
    { value: 'manager', label: 'Gerente' }
  ];
  const skillsList = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java',
    'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'Gestão de Projetos', 'Scrum', 'Kanban', 'Liderança',
    'Figma', 'Adobe XD', 'Design System', 'Prototipagem',
    'Testes Automatizados', 'Selenium', 'Jest', 'Cypress'
  ];

  const activePeople = people.filter(person => person.status === 'active');
  const inactivePeople = people.filter(person => person.status === 'inactive');

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBase = !filters.base || person.base === filters.base;
    const matchesStatus = !filters.status || person.status === filters.status;
    const matchesLevel = !filters.level || person.level === filters.level;
    const matchesSkills = !filters.skills || person.skills.some(skill => 
      skill.toLowerCase().includes(filters.skills.toLowerCase())
    );

    return matchesSearch && matchesBase && matchesStatus && matchesLevel && matchesSkills;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      level: 'junior',
      specialization: '',
      base: '',
      calendar: '',
      skills: [],
      hourlyRate: 0,
      leader: '',
      status: 'active',
      admissionDate: '',
      dismissalDate: '',
      notes: '',
      // Históricos
      rateHistory: [],
      levelHistory: [],
      employmentHistory: []
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPerson) {
      setPeople(people.map(person => 
        person.id === editingPerson.id 
          ? { ...person, ...formData }
          : person
      ));
    } else {
      const newPerson = {
        id: Date.now(),
        ...formData,
        avatar: null
      };
      setPeople([...people, newPerson]);
    }
    
    setShowModal(false);
    setEditingPerson(null);
    resetForm();
    setActiveTab('personal');
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      email: person.email,
      phone: person.phone,
      position: person.position,
      level: person.level,
      specialization: person.specialization || '',
      base: person.base,
      calendar: person.calendar,
      skills: person.skills,
      hourlyRate: person.hourlyRate,
      leader: person.leader,
      status: person.status,
      admissionDate: person.admissionDate,
      dismissalDate: person.dismissalDate || '',
      notes: person.notes,
      // Históricos (inicializar se não existirem)
      rateHistory: person.rateHistory || [],
      levelHistory: person.levelHistory || [],
      employmentHistory: person.employmentHistory || []
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      setPeople(people.filter(person => person.id !== id));
    }
  };

  const openModal = () => {
    setEditingPerson(null);
    resetForm();
    setActiveTab('personal');
    setShowModal(true);
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Ativo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Inativo
        </span>
      );
    }
  };

  const getLevelLabel = (level) => {
    const levelObj = levels.find(l => l.value === level);
    return levelObj ? levelObj.label : level;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Pessoas</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie informações de colaboradores, skills e hierarquia
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtros
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
              Importar
            </button>
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Nova Pessoa
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Pessoas</dt>
                  <dd className="text-lg font-medium text-gray-900">{people.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ativos</dt>
                  <dd className="text-lg font-medium text-gray-900">{activePeople.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inativos</dt>
                  <dd className="text-lg font-medium text-gray-900">{inactivePeople.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Taxa Média/Hora</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {Math.round(activePeople.reduce((acc, p) => acc + p.hourlyRate, 0) / activePeople.length)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
              <select
                value={filters.base}
                onChange={(e) => setFilters({...filters, base: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as bases</option>
                {bases.map(base => (
                  <option key={base} value={base}>{base}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os níveis</option>
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) => setFilters({...filters, skills: e.target.value})}
                placeholder="Buscar por skill..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* People List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Pessoas Cadastradas ({filteredPeople.length})
          </h3>
        </div>
        
        {filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma pessoa encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(f => f) ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando uma nova pessoa.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo / Nível
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base / Calendário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.position}</div>
                      <div className="text-sm text-gray-500">{getLevelLabel(person.level)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.base}</div>
                      <div className="text-sm text-gray-500">{person.calendar}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {person.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                        {person.skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{person.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">R$ {person.hourlyRate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(person.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Visualizar pessoa"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar pessoa"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir pessoa"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingPerson ? 'Editar Pessoa' : 'Nova Pessoa'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'personal'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Dados Pessoais
                  </button>
                  <button
                    onClick={() => setActiveTab('professional')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'professional'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Informações Profissionais
                  </button>
                  <button
                    onClick={() => setActiveTab('hierarchy')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'hierarchy'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Hierarquia & Status
                  </button>
                </nav>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Tab: Dados Pessoais */}
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Ana Silva"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="ana.silva@empresa.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(11) 99999-9999"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cargo *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Desenvolvedor Full Stack"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Base *
                        </label>
                        <select
                          required
                          value={formData.base}
                          onChange={(e) => setFormData({...formData, base: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione uma base</option>
                          {bases.map(base => (
                            <option key={base} value={base}>{base}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Calendário *
                        </label>
                        <select
                          required
                          value={formData.calendar}
                          onChange={(e) => setFormData({...formData, calendar: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione um calendário</option>
                          {calendars.map(calendar => (
                            <option key={calendar} value={calendar}>{calendar}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Informações Profissionais */}
                {activeTab === 'professional' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especialização
                        </label>
                        <select
                          value={formData.specialization}
                          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione uma especialização</option>
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nível *
                        </label>
                        <select
                          required
                          value={formData.level}
                          onChange={(e) => setFormData({...formData, level: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          {levels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Taxa/Hora (R$) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills
                      </label>
                      <div className="space-y-3">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addSkill(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione uma skill para adicionar</option>
                          {skillsList.filter(skill => !formData.skills.includes(skill)).map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                        </select>
                        
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observações
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Informações adicionais sobre a pessoa..."
                      />
                    </div>

                    {/* Históricos - Apenas para edição */}
                    {editingPerson && (
                      <div className="space-y-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Históricos</h3>
                        
                        {/* Histórico de Taxas */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-medium text-gray-800">Histórico de Taxas</h4>
                            <button
                              type="button"
                              onClick={() => {
                                const reason = prompt('Motivo da alteração de taxa:');
                                if (reason) {
                                  const newEntry = {
                                    date: new Date().toISOString().split('T')[0],
                                    oldRate: formData.hourlyRate,
                                    newRate: formData.hourlyRate,
                                    reason: reason
                                  };
                                  setFormData({
                                    ...formData,
                                    rateHistory: [...(formData.rateHistory || []), newEntry]
                                  });
                                }
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Adicionar Registro
                            </button>
                          </div>
                          {formData.rateHistory && formData.rateHistory.length > 0 ? (
                            <div className="space-y-2">
                              {formData.rateHistory.map((entry, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                                  <div>
                                    <span className="text-sm font-medium">
                                      {entry.oldRate ? `R$ ${entry.oldRate}` : 'Inicial'} → R$ {entry.newRate}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">({entry.reason})</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-400">
                                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newHistory = formData.rateHistory.filter((_, i) => i !== index);
                                        setFormData({...formData, rateHistory: newHistory});
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                      title="Remover registro"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum histórico de alteração de taxa</p>
                          )}
                        </div>

                        {/* Histórico de Níveis */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-medium text-gray-800">Histórico de Níveis</h4>
                            <button
                              type="button"
                              onClick={() => {
                                const reason = prompt('Motivo da alteração de nível:');
                                if (reason) {
                                  const newEntry = {
                                    date: new Date().toISOString().split('T')[0],
                                    oldLevel: formData.level,
                                    newLevel: formData.level,
                                    reason: reason
                                  };
                                  setFormData({
                                    ...formData,
                                    levelHistory: [...(formData.levelHistory || []), newEntry]
                                  });
                                }
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Adicionar Registro
                            </button>
                          </div>
                          {formData.levelHistory && formData.levelHistory.length > 0 ? (
                            <div className="space-y-2">
                              {formData.levelHistory.map((entry, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                                  <div>
                                    <span className="text-sm font-medium">
                                      {entry.oldLevel ? levels.find(l => l.value === entry.oldLevel)?.label || entry.oldLevel : 'Inicial'} → {levels.find(l => l.value === entry.newLevel)?.label || entry.newLevel}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">({entry.reason})</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-400">
                                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newHistory = formData.levelHistory.filter((_, i) => i !== index);
                                        setFormData({...formData, levelHistory: newHistory});
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                      title="Remover registro"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum histórico de alteração de nível</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Hierarquia & Status */}
                {activeTab === 'hierarchy' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Líder Direto
                        </label>
                        <select
                          value={formData.leader}
                          onChange={(e) => setFormData({...formData, leader: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Nenhum líder</option>
                          {people.filter(p => p.id !== editingPerson?.id).map(person => (
                            <option key={person.id} value={person.name}>{person.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status *
                        </label>
                        <select
                          required
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Admissão *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.admissionDate}
                          onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {formData.status === 'inactive' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data de Encerramento
                          </label>
                          <input
                            type="date"
                            value={formData.dismissalDate}
                            onChange={(e) => setFormData({...formData, dismissalDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Histórico de Admissões/Encerramentos - Apenas para edição */}
                    {editingPerson && (
                      <div className="space-y-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Histórico de Admissões/Encerramentos</h3>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-medium text-gray-800">Histórico de Vínculos</h4>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const reason = prompt('Motivo da admissão:');
                                  if (reason) {
                                    const newEntry = {
                                      type: 'admission',
                                      date: new Date().toISOString().split('T')[0],
                                      reason: reason
                                    };
                                    setFormData({
                                      ...formData,
                                      employmentHistory: [...(formData.employmentHistory || []), newEntry]
                                    });
                                  }
                                }}
                                className="text-sm text-green-600 hover:text-green-800 font-medium"
                              >
                                + Admissão
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const reason = prompt('Motivo do encerramento:');
                                  if (reason) {
                                    const newEntry = {
                                      type: 'dismissal',
                                      date: new Date().toISOString().split('T')[0],
                                      reason: reason
                                    };
                                    setFormData({
                                      ...formData,
                                      employmentHistory: [...(formData.employmentHistory || []), newEntry]
                                    });
                                  }
                                }}
                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                              >
                                + Encerramento
                              </button>
                            </div>
                          </div>
                          {formData.employmentHistory && formData.employmentHistory.length > 0 ? (
                            <div className="space-y-2">
                              {formData.employmentHistory.map((entry, index) => (
                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                                  <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      entry.type === 'admission' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {entry.type === 'admission' ? 'Admissão' : 'Encerramento'}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">({entry.reason})</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-400">
                                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newHistory = formData.employmentHistory.filter((_, i) => i !== index);
                                        setFormData({...formData, employmentHistory: newHistory});
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                      title="Remover registro"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum histórico de admissão/encerramento</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {editingPerson ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleManagement;

