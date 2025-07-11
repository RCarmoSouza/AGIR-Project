import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    contractType: '', // Novo campo para tipo de contrato
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

  // Estados para campos inline de histórico
  const [newRateEntry, setNewRateEntry] = useState({ value: '', startDate: '', endDate: '', reason: '', contractType: '' });
  const [newLevelEntry, setNewLevelEntry] = useState({ value: '', startDate: '', endDate: '', reason: '' });
  const [rateMessage, setRateMessage] = useState(null);
  const [levelMessage, setLevelMessage] = useState(null);

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
      // Históricos com datas de início e fim
      rateHistory: [
        { 
          id: 1,
          value: 130, 
          startDate: '2023-01-15', 
          endDate: '2023-06-30',
          reason: 'Admissão',
          contractType: 'efetivo'
        },
        { 
          id: 2,
          value: 150, 
          startDate: '2023-07-01', 
          endDate: null,
          reason: 'Aumento por performance',
          contractType: 'efetivo'
        }
      ],
      levelHistory: [
        { 
          id: 1,
          value: 'pleno', 
          startDate: '2023-01-15', 
          endDate: '2023-09-30',
          reason: 'Admissão' 
        },
        { 
          id: 2,
          value: 'senior', 
          startDate: '2023-10-01', 
          endDate: null,
          reason: 'Promoção' 
        }
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
      // Históricos com datas de início e fim
      rateHistory: [
        { 
          id: 1,
          value: 100, 
          startDate: '2023-03-20', 
          endDate: '2023-08-31',
          reason: 'Admissão',
          contractType: 'efetivo'
        },
        { 
          id: 2,
          value: 120, 
          startDate: '2023-09-01', 
          endDate: null,
          reason: 'Aumento por performance',
          contractType: 'efetivo'
        }
      ],
      levelHistory: [
        { 
          id: 1,
          value: 'junior', 
          startDate: '2023-03-20', 
          endDate: '2023-08-31',
          reason: 'Admissão' 
        },
        { 
          id: 2,
          value: 'pleno', 
          startDate: '2023-09-01', 
          endDate: null,
          reason: 'Promoção' 
        }
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
      // Históricos com datas de início e fim
      rateHistory: [
        { 
          id: 1,
          value: 90, 
          startDate: '2023-02-10', 
          endDate: '2023-08-14',
          reason: 'Admissão',
          contractType: 'meio_turno'
        },
        { 
          id: 2,
          value: 110, 
          startDate: '2023-08-15', 
          endDate: null,
          reason: 'Aumento por performance',
          contractType: 'efetivo'
        }
      ],
      levelHistory: [
        { 
          id: 1,
          value: 'junior', 
          startDate: '2023-02-10', 
          endDate: '2023-08-14',
          reason: 'Admissão' 
        },
        { 
          id: 2,
          value: 'pleno', 
          startDate: '2023-08-15', 
          endDate: null,
          reason: 'Promoção' 
        }
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
      // Históricos com datas de início e fim
      rateHistory: [
        { 
          id: 1,
          value: 80, 
          startDate: '2024-01-08', 
          endDate: null,
          reason: 'Admissão',
          contractType: 'estagio'
        }
      ],
      levelHistory: [
        { 
          id: 1,
          value: 'junior', 
          startDate: '2024-01-08', 
          endDate: null,
          reason: 'Admissão' 
        }
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
      // Históricos com datas de início e fim
      rateHistory: [
        { 
          id: 1,
          value: 85, 
          startDate: '2023-05-15', 
          endDate: '2023-10-31',
          reason: 'Admissão',
          contractType: 'efetivo'
        },
        { 
          id: 2,
          value: 100, 
          startDate: '2023-11-01', 
          endDate: null,
          reason: 'Aumento por performance',
          contractType: 'horista'
        }
      ],
      levelHistory: [
        { 
          id: 1,
          value: 'junior', 
          startDate: '2023-05-15', 
          endDate: '2023-10-31',
          reason: 'Admissão' 
        },
        { 
          id: 2,
          value: 'pleno', 
          startDate: '2023-11-01', 
          endDate: null,
          reason: 'Promoção' 
        }
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
  
  // Tipos de contrato com horas diárias
  const contractTypes = [
    { value: 'efetivo', label: 'Efetivo', dailyHours: 8 },
    { value: 'estagio', label: 'Estágio', dailyHours: 6 },
    { value: 'meio_turno', label: 'Meio Turno', dailyHours: 4 },
    { value: 'horista', label: 'Horista', dailyHours: 0 }
  ];
  
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

  // Funções para calcular valores ativos do histórico
  const getActiveValue = (history) => {
    if (!history || history.length === 0) return null;
    
    // Busca o registro ativo (sem endDate ou com endDate futura)
    const today = new Date().toISOString().split('T')[0];
    const activeRecord = history.find(record => 
      !record.endDate || record.endDate > today
    );
    
    if (activeRecord) return activeRecord.value;
    
    // Se não há registro ativo, pega o mais recente
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    );
    return sortedHistory[0]?.value || null;
  };

  const getActiveHourlyRate = (person) => {
    return getActiveValue(person.rateHistory);
  };

  const getActiveLevel = (person) => {
    return getActiveValue(person.levelHistory);
  };

  const getActiveContractType = (person) => {
    if (!person.rateHistory || person.rateHistory.length === 0) return null;
    
    // Busca o registro ativo (sem endDate ou com endDate futura)
    const today = new Date().toISOString().split('T')[0];
    const activeRecord = person.rateHistory.find(record => 
      !record.endDate || record.endDate > today
    );
    
    if (activeRecord) return activeRecord.contractType;
    
    // Se não há registro ativo, pega o mais recente
    const sortedHistory = [...person.rateHistory].sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    );
    return sortedHistory[0]?.contractType || null;
  };

  const getContractTypeLabel = (contractType) => {
    const contract = contractTypes.find(c => c.value === contractType);
    return contract ? contract.label : contractType;
  };

  // Função para validar se uma nova entrada no histórico é válida
  const validateHistoryEntry = (history, newEntry) => {
    const errors = [];
    
    // Verifica se já existe um registro ativo (sem endDate)
    const activeRecords = history.filter(record => !record.endDate);
    if (!newEntry.endDate && activeRecords.length > 0) {
      errors.push('Já existe um registro ativo. Defina uma data de fim para o registro atual antes de adicionar um novo.');
    }
    
    // Verifica sobreposição de datas
    const overlapping = history.find(record => {
      const recordStart = new Date(record.startDate);
      const recordEnd = record.endDate ? new Date(record.endDate) : new Date('9999-12-31');
      const newStart = new Date(newEntry.startDate);
      const newEnd = newEntry.endDate ? new Date(newEntry.endDate) : new Date('9999-12-31');
      
      return (newStart <= recordEnd && newEnd >= recordStart);
    });
    
    if (overlapping) {
      errors.push('As datas se sobrepõem com um registro existente.');
    }
    
    // Verifica se startDate não é posterior a endDate
    if (newEntry.endDate && new Date(newEntry.startDate) >= new Date(newEntry.endDate)) {
      errors.push('A data de início deve ser anterior à data de fim.');
    }
    
    return errors;
  };
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
      contractType: '', // Incluindo campo de tipo de contrato
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
      // Edição - apenas atualiza os dados básicos
      setPeople(people.map(person => 
        person.id === editingPerson.id 
          ? { ...person, ...formData }
          : person
      ));
    } else {
      // Criação - gera registros iniciais no histórico
      const initialRateHistory = [];
      const initialLevelHistory = [];
      
      // Criar registro inicial de taxa se informado
      if (formData.hourlyRate && formData.hourlyRate > 0 && formData.contractType) {
        initialRateHistory.push({
          id: 1,
          value: formData.hourlyRate,
          startDate: formData.admissionDate,
          endDate: null, // Registro ativo
          reason: 'Admissão',
          contractType: formData.contractType
        });
      }
      
      // Criar registro inicial de nível se informado
      if (formData.level) {
        initialLevelHistory.push({
          id: 1,
          value: formData.level,
          startDate: formData.admissionDate,
          endDate: null, // Registro ativo
          reason: 'Admissão'
        });
      }
      
      const newPerson = {
        id: Date.now(),
        ...formData,
        avatar: null,
        // Históricos iniciais baseados nos valores informados
        rateHistory: initialRateHistory,
        levelHistory: initialLevelHistory,
        employmentHistory: [{
          type: 'admission',
          date: formData.admissionDate,
          reason: 'Contratação inicial'
        }]
      };
      
      setPeople([...people, newPerson]);
      
      // Mostrar mensagem de sucesso
      alert('Pessoa criada com sucesso! Registros iniciais foram adicionados ao histórico com base na data de admissão.');
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

  const handleView = (person) => {
    navigate(`/people/people/${person.id}`);
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
                    Taxa/Hora & Contrato
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
                      <div className="text-sm text-gray-500">
                        {getContractTypeLabel(getActiveContractType(person)) || 'Não definido'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(person.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleView(person)}
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

                      {/* Campo Tipo de Contrato - apenas para criação de novas pessoas */}
                      {!editingPerson && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Contrato *
                          </label>
                          <select
                            required
                            value={formData.contractType || ''}
                            onChange={(e) => setFormData({...formData, contractType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Selecione</option>
                            <option value="efetivo">Efetivo (8h/dia)</option>
                            <option value="estagio">Estágio (6h/dia)</option>
                            <option value="meio_turno">Meio Turno (4h/dia)</option>
                            <option value="horista">Horista (0h/dia)</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nível *
                          {editingPerson && (
                            <span className="text-xs text-blue-600 ml-1">(Calculado do histórico ativo)</span>
                          )}
                        </label>
                        {editingPerson ? (
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                            <span className="text-gray-900">
                              {levels.find(l => l.value === getActiveLevel(editingPerson))?.label || 'Não definido'}
                            </span>
                            <span className="text-xs text-green-600 ml-2">
                              (Valor ativo do histórico)
                            </span>
                          </div>
                        ) : (
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
                        )}
                        {editingPerson && (
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Para alterar, use o histórico de níveis abaixo
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Taxa/Hora (R$) *
                          {editingPerson && (
                            <span className="text-xs text-blue-600 ml-1">(Calculado do histórico ativo)</span>
                          )}
                        </label>
                        {editingPerson ? (
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                            <span className="text-gray-900 font-medium">
                              R$ {getActiveHourlyRate(editingPerson) || 'Não definido'}
                            </span>
                            <span className="text-xs text-green-600 ml-2">
                              (Valor ativo do histórico)
                            </span>
                          </div>
                        ) : (
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                        {editingPerson && (
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Para alterar, use o histórico de taxas abaixo
                          </p>
                        )}
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
                        
                        {/* Histórico de Contratos */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="mb-4">
                            <h4 className="text-md font-medium text-gray-800 mb-3">Histórico de Contratos</h4>
                            
                            {/* Campos inline para adicionar novo registro */}
                            <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="rate-value">
                                    Valor (R$) *
                                  </label>
                                  <input
                                    id="rate-value"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newRateEntry.value || ''}
                                    onChange={(e) => setNewRateEntry({...newRateEntry, value: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="150.00"
                                    aria-describedby="rate-value-help"
                                  />
                                  <div id="rate-value-help" className="sr-only">Digite o valor da taxa por hora em reais</div>
                                </div>
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="rate-contract-type">
                                    Tipo de Contrato *
                                  </label>
                                  <select
                                    id="rate-contract-type"
                                    value={newRateEntry.contractType || ''}
                                    onChange={(e) => setNewRateEntry({...newRateEntry, contractType: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    aria-describedby="rate-contract-type-help"
                                  >
                                    <option value="">Selecione</option>
                                    {contractTypes.map(type => (
                                      <option key={type.value} value={type.value}>
                                        {type.label} ({type.dailyHours}h/dia)
                                      </option>
                                    ))}
                                  </select>
                                  <div id="rate-contract-type-help" className="sr-only">Selecione o tipo de contrato</div>
                                </div>
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="rate-start">
                                    Início *
                                  </label>
                                  <input
                                    id="rate-start"
                                    type="date"
                                    value={newRateEntry.startDate || ''}
                                    onChange={(e) => setNewRateEntry({...newRateEntry, startDate: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    aria-describedby="rate-start-help"
                                  />
                                  <div id="rate-start-help" className="sr-only">Data de início da vigência desta taxa</div>
                                </div>
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="rate-end">
                                    Fim
                                  </label>
                                  <input
                                    id="rate-end"
                                    type="date"
                                    value={newRateEntry.endDate || ''}
                                    onChange={(e) => setNewRateEntry({...newRateEntry, endDate: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    aria-describedby="rate-end-help"
                                  />
                                  <div id="rate-end-help" className="sr-only">Data de fim da vigência desta taxa (opcional)</div>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="rate-reason">
                                    Motivo *
                                  </label>
                                  <input
                                    id="rate-reason"
                                    type="text"
                                    value={newRateEntry.reason || ''}
                                    onChange={(e) => setNewRateEntry({...newRateEntry, reason: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ex: Aumento por performance"
                                    aria-describedby="rate-reason-help"
                                  />
                                  <div id="rate-reason-help" className="sr-only">Motivo da alteração da taxa</div>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!newRateEntry.value || !newRateEntry.startDate || !newRateEntry.reason || !newRateEntry.contractType) {
                                        setRateMessage({ type: 'error', text: 'Valor, Tipo de Contrato, Data de Início e Motivo são obrigatórios' });
                                        return;
                                      }
                                      
                                      const newEntry = {
                                        id: Date.now(),
                                        value: parseFloat(newRateEntry.value),
                                        startDate: newRateEntry.startDate,
                                        endDate: newRateEntry.endDate || null,
                                        reason: newRateEntry.reason,
                                        contractType: newRateEntry.contractType
                                      };
                                      
                                      // Validar entrada
                                      const errors = validateHistoryEntry(formData.rateHistory || [], newEntry);
                                      if (errors.length > 0) {
                                        setRateMessage({ type: 'error', text: errors.join(', ') });
                                        return;
                                      }
                                      
                                      setFormData({
                                        ...formData,
                                        rateHistory: [...(formData.rateHistory || []), newEntry]
                                      });
                                      
                                      // Limpar campos
                                      setNewRateEntry({ value: '', startDate: '', endDate: '', reason: '', contractType: '' });
                                      setRateMessage({ type: 'success', text: 'Registro adicionado com sucesso!' });
                                      
                                      // Limpar mensagem após 3 segundos
                                      setTimeout(() => setRateMessage(null), 3000);
                                    }}
                                    className="w-full text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium transition-colors"
                                    aria-label="Adicionar novo registro de taxa"
                                  >
                                    + Adicionar
                                  </button>
                                </div>
                              </div>
                              
                              {/* Mensagem de feedback */}
                              {rateMessage && (
                                <div className={`mt-2 text-xs px-2 py-1 rounded ${
                                  rateMessage.type === 'success' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {rateMessage.text}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {formData.rateHistory && formData.rateHistory.length > 0 ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-600 border-b pb-2">
                                <div>Valor</div>
                                <div>Tipo Contrato</div>
                                <div>Data Início</div>
                                <div>Data Fim</div>
                                <div>Motivo</div>
                                <div>Ações</div>
                              </div>
                              {formData.rateHistory
                                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                                .map((entry, index) => (
                                <div key={entry.id || index} className="grid grid-cols-6 gap-2 items-center bg-white p-3 rounded border">
                                  <div className="text-sm font-medium">
                                    R$ {entry.value}
                                    {!entry.endDate && (
                                      <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">ATIVO</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {getContractTypeLabel(entry.contractType) || 'Não definido'}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {new Date(entry.startDate).toLocaleDateString('pt-BR')}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {entry.endDate ? new Date(entry.endDate).toLocaleDateString('pt-BR') : '-'}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate" title={entry.reason}>
                                    {entry.reason}
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newValue = prompt('Nova taxa/hora (R$):', entry.value);
                                        const newStartDate = prompt('Data de início (YYYY-MM-DD):', entry.startDate);
                                        const newEndDate = prompt('Data de fim (YYYY-MM-DD) - deixe vazio se for registro ativo:', entry.endDate || '');
                                        const newReason = prompt('Motivo:', entry.reason);
                                        
                                        if (newValue && newStartDate && newReason) {
                                          const updatedEntry = {
                                            ...entry,
                                            value: parseFloat(newValue),
                                            startDate: newStartDate,
                                            endDate: newEndDate || null,
                                            reason: newReason
                                          };
                                          
                                          const updatedHistory = formData.rateHistory.map(h => 
                                            h.id === entry.id ? updatedEntry : h
                                          );
                                          
                                          setFormData({...formData, rateHistory: updatedHistory});
                                        }
                                      }}
                                      className="text-blue-500 hover:text-blue-700 text-xs"
                                      title="Editar registro"
                                    >
                                      <PencilIcon className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm('Tem certeza que deseja remover este registro?')) {
                                          const newHistory = formData.rateHistory.filter(h => h.id !== entry.id);
                                          setFormData({...formData, rateHistory: newHistory});
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                      title="Remover registro"
                                    >
                                      <XMarkIcon className="w-3 h-3" />
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
                          <div className="mb-4">
                            <h4 className="text-md font-medium text-gray-800 mb-3">Histórico de Níveis</h4>
                            
                            {/* Campos inline para adicionar novo registro */}
                            <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="level-value">
                                    Nível *
                                  </label>
                                  <select
                                    id="level-value"
                                    value={newLevelEntry.value || ''}
                                    onChange={(e) => setNewLevelEntry({...newLevelEntry, value: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    aria-describedby="level-value-help"
                                  >
                                    <option value="">Selecione um nível</option>
                                    {levels.map(level => (
                                      <option key={level.value} value={level.value}>{level.label}</option>
                                    ))}
                                  </select>
                                  <div id="level-value-help" className="sr-only">Selecione o nível profissional</div>
                                </div>
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="level-start">
                                    Início *
                                  </label>
                                  <input
                                    id="level-start"
                                    type="date"
                                    value={newLevelEntry.startDate || ''}
                                    onChange={(e) => setNewLevelEntry({...newLevelEntry, startDate: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    aria-describedby="level-start-help"
                                  />
                                  <div id="level-start-help" className="sr-only">Data de início da vigência deste nível</div>
                                </div>
                                <div className="sm:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="level-end">
                                    Fim
                                  </label>
                                  <input
                                    id="level-end"
                                    type="date"
                                    value={newLevelEntry.endDate || ''}
                                    onChange={(e) => setNewLevelEntry({...newLevelEntry, endDate: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    aria-describedby="level-end-help"
                                  />
                                  <div id="level-end-help" className="sr-only">Data de fim da vigência deste nível (opcional)</div>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-1">
                                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="level-reason">
                                    Motivo *
                                  </label>
                                  <input
                                    id="level-reason"
                                    type="text"
                                    value={newLevelEntry.reason || ''}
                                    onChange={(e) => setNewLevelEntry({...newLevelEntry, reason: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ex: Promoção por mérito"
                                    aria-describedby="level-reason-help"
                                  />
                                  <div id="level-reason-help" className="sr-only">Motivo da alteração do nível</div>
                                </div>
                                <div className="sm:col-span-2 lg:col-span-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!newLevelEntry.value || !newLevelEntry.startDate || !newLevelEntry.reason) {
                                        setLevelMessage({ type: 'error', text: 'Nível, Data de Início e Motivo são obrigatórios' });
                                        return;
                                      }
                                      
                                      const newEntry = {
                                        id: Date.now(),
                                        value: newLevelEntry.value,
                                        startDate: newLevelEntry.startDate,
                                        endDate: newLevelEntry.endDate || null,
                                        reason: newLevelEntry.reason
                                      };
                                      
                                      // Validar entrada
                                      const errors = validateHistoryEntry(formData.levelHistory || [], newEntry);
                                      if (errors.length > 0) {
                                        setLevelMessage({ type: 'error', text: errors.join(', ') });
                                        return;
                                      }
                                      
                                      setFormData({
                                        ...formData,
                                        levelHistory: [...(formData.levelHistory || []), newEntry]
                                      });
                                      
                                      // Limpar campos
                                      setNewLevelEntry({ value: '', startDate: '', endDate: '', reason: '' });
                                      setLevelMessage({ type: 'success', text: 'Registro adicionado com sucesso!' });
                                      
                                      // Limpar mensagem após 3 segundos
                                      setTimeout(() => setLevelMessage(null), 3000);
                                    }}
                                    className="w-full text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium transition-colors"
                                    aria-label="Adicionar novo registro de nível"
                                  >
                                    + Adicionar
                                  </button>
                                </div>
                              </div>
                              
                              {/* Mensagem de feedback */}
                              {levelMessage && (
                                <div className={`mt-2 text-xs px-2 py-1 rounded ${
                                  levelMessage.type === 'success' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {levelMessage.text}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {formData.levelHistory && formData.levelHistory.length > 0 ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 border-b pb-2">
                                <div>Nível</div>
                                <div>Data Início</div>
                                <div>Data Fim</div>
                                <div>Motivo</div>
                                <div>Ações</div>
                              </div>
                              {formData.levelHistory
                                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                                .map((entry, index) => (
                                <div key={entry.id || index} className="grid grid-cols-5 gap-2 items-center bg-white p-3 rounded border">
                                  <div className="text-sm font-medium">
                                    {levels.find(l => l.value === entry.value)?.label || entry.value}
                                    {!entry.endDate && (
                                      <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">ATIVO</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {new Date(entry.startDate).toLocaleDateString('pt-BR')}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {entry.endDate ? new Date(entry.endDate).toLocaleDateString('pt-BR') : '-'}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate" title={entry.reason}>
                                    {entry.reason}
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const levelOptions = levels.map(l => `${l.value}: ${l.label}`).join('\n');
                                        const newValue = prompt(`Novo nível:\n${levelOptions}\n\nDigite o valor:`, entry.value);
                                        const newStartDate = prompt('Data de início (YYYY-MM-DD):', entry.startDate);
                                        const newEndDate = prompt('Data de fim (YYYY-MM-DD) - deixe vazio se for registro ativo:', entry.endDate || '');
                                        const newReason = prompt('Motivo:', entry.reason);
                                        
                                        if (newValue && newStartDate && newReason) {
                                          const updatedEntry = {
                                            ...entry,
                                            value: newValue,
                                            startDate: newStartDate,
                                            endDate: newEndDate || null,
                                            reason: newReason
                                          };
                                          
                                          const updatedHistory = formData.levelHistory.map(h => 
                                            h.id === entry.id ? updatedEntry : h
                                          );
                                          
                                          setFormData({...formData, levelHistory: updatedHistory});
                                        }
                                      }}
                                      className="text-blue-500 hover:text-blue-700 text-xs"
                                      title="Editar registro"
                                    >
                                      <PencilIcon className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm('Tem certeza que deseja remover este registro?')) {
                                          const newHistory = formData.levelHistory.filter(h => h.id !== entry.id);
                                          setFormData({...formData, levelHistory: newHistory});
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                      title="Remover registro"
                                    >
                                      <XMarkIcon className="w-3 h-3" />
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

