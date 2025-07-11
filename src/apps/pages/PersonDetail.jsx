import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  TagIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  LightBulbIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para adição de contratos
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [newContract, setNewContract] = useState({
    value: '',
    contractType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Estados para adição de níveis
  const [isAddingLevel, setIsAddingLevel] = useState(false);
  const [newLevel, setNewLevel] = useState({
    level: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Estados para adição de admissões/encerramentos
  const [isAddingEmployment, setIsAddingEmployment] = useState(false);
  const [newEmployment, setNewEmployment] = useState({
    type: '',
    date: '',
    reason: ''
  });

  // Estados para encerramento
  const [isEndingContract, setIsEndingContract] = useState(false);
  const [isEndingLevel, setIsEndingLevel] = useState(false);
  const [isEndingEmployment, setIsEndingEmployment] = useState(false);
  const [endDate, setEndDate] = useState('');

  const contractTypes = ['Efetivo', 'Estágio', 'Meio Turno', 'Horista'];
  const levels = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Líder Técnico', 'Gerente'];
  const employmentTypes = ['Admissão', 'Encerramento', 'Transferência', 'Promoção', 'Retorno'];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setPerson({
        id: 1,
        name: 'Ana Silva',
        position: 'Gerente de Projetos',
        email: 'ana.silva@agir.com',
        phone: '(11) 99999-9999',
        department: 'Tecnologia',
        specialization: 'Gestão de Projetos',
        admissionDate: '2022-01-15',
        status: 'active',
        skills: ['React', 'JavaScript', 'Node.js', 'Python', 'SQL', 'Git', 'Docker', 'AWS'],
        rateHistory: [
          {
            id: 1,
            value: '150.00',
            contractType: 'Efetivo',
            startDate: '2022-01-15',
            endDate: null,
            reason: 'Contratação inicial',
            status: 'active'
          }
        ],
        levelHistory: [
          {
            id: 1,
            value: 'Sênior',
            startDate: '2022-01-15',
            endDate: null,
            reason: 'Contratação inicial'
          }
        ],
        employmentHistory: [
          {
            id: 1,
            type: 'Admissão',
            date: '2022-01-15',
            reason: 'Contratação para equipe de desenvolvimento'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const getContractTypeLabel = (type) => {
    const labels = {
      'Efetivo': 'Efetivo (8h/dia)',
      'Estágio': 'Estágio (6h/dia)',
      'Meio Turno': 'Meio Turno (4h/dia)',
      'Horista': 'Horista'
    };
    return labels[type] || type;
  };

  const getActiveValue = (history) => {
    const active = history?.find(item => !item.endDate);
    return active?.value || 'N/A';
  };

  const getActiveContractType = (person) => {
    const activeContract = person.rateHistory?.find(item => !item.endDate);
    return activeContract?.contractType || 'N/A';
  };

  const handleAddContract = () => {
    // Lógica para adicionar contrato
    console.log('Adicionando contrato:', newContract);
    setIsAddingContract(false);
    setNewContract({
      value: '',
      contractType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const handleAddLevel = () => {
    // Lógica para adicionar nível
    console.log('Adicionando nível:', newLevel);
    setIsAddingLevel(false);
    setNewLevel({
      level: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const handleAddEmployment = () => {
    // Lógica para adicionar admissão/encerramento
    console.log('Adicionando admissão/encerramento:', newEmployment);
    setIsAddingEmployment(false);
    setNewEmployment({
      type: '',
      date: '',
      reason: ''
    });
  };

  const handleEndContract = (contractId) => {
    setIsEndingContract(true);
  };

  const handleEndLevel = (levelId) => {
    setIsEndingLevel(true);
  };

  const handleEndEmployment = (employmentId) => {
    setIsEndingEmployment(true);
  };

  const handleCancelEnd = () => {
    setIsEndingContract(false);
    setIsEndingLevel(false);
    setIsEndingEmployment(false);
    setEndDate('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Pessoa não encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">A pessoa solicitada não existe ou foi removida.</p>
          <button
            onClick={() => navigate('/people/people')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Otimizado */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Link de volta */}
            <button
              onClick={() => navigate('/people/people')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Voltar para lista de pessoas"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Pessoas
            </button>
            
            {/* Título principal */}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {person.name} - {person.position}
              </h1>
              <div className="flex items-center justify-center space-x-3 mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  person.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {person.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Admitido em {new Date(person.admissionDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            
            {/* Botão de edição */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
              title={isEditing ? "Cancelar edição" : "Editar pessoa"}
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Coluna Esquerda (60%) - Informações Principais */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Informações Pessoais */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={person.name}
                          onChange={(e) => setPerson({...person, name: e.target.value})}
                          className="flex-1 text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{person.name}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <div className="flex items-center">
                      <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={person.position}
                          onChange={(e) => setPerson({...person, position: e.target.value})}
                          className="flex-1 text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{person.position}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={person.email}
                          onChange={(e) => setPerson({...person, email: e.target.value})}
                          className="flex-1 text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{person.email}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={person.phone}
                          onChange={(e) => setPerson({...person, phone: e.target.value})}
                          className="flex-1 text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{person.phone}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={person.department}
                          onChange={(e) => setPerson({...person, department: e.target.value})}
                          className="flex-1 text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{person.department}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Especialização</label>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={person.specialization}
                          onChange={(e) => setPerson({...person, specialization: e.target.value})}
                          className="flex-1 text-sm text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{person.specialization}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contratos */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Contratos</h3>
                <button
                  onClick={() => setIsAddingContract(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                  aria-label="Adicionar novo contrato"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {person.rateHistory?.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.startDate).toLocaleDateString('pt-BR')} - {record.endDate ? new Date(record.endDate).toLocaleDateString('pt-BR') : 'Atual'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {record.value}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {getContractTypeLabel(record.contractType)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={record.reason}>
                          {record.reason}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {record.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {record.status === 'active' && (
                            <button
                              onClick={() => handleEndContract(record.id)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                              title="Encerrar contrato"
                              aria-label="Encerrar contrato ativo"
                            >
                              <XMarkIcon className="h-3 w-3 mr-1" />
                              Encerrar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Níveis */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Níveis</h3>
                <button
                  onClick={() => setIsAddingLevel(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                  aria-label="Adicionar novo nível"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nível
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {person.levelHistory?.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.startDate).toLocaleDateString('pt-BR')} - {record.endDate ? new Date(record.endDate).toLocaleDateString('pt-BR') : 'Atual'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.value}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={record.reason}>
                          {record.reason}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            !record.endDate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {!record.endDate ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {!record.endDate && (
                            <button
                              onClick={() => handleEndLevel(record.id)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                              title="Encerrar nível"
                              aria-label="Encerrar nível ativo"
                            >
                              <XMarkIcon className="h-3 w-3 mr-1" />
                              Encerrar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Admissões e Encerramentos */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Admissões e Encerramentos</h3>
                <button
                  onClick={() => setIsAddingEmployment(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                  aria-label="Adicionar novo registro"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {person.employmentHistory?.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.type === 'Admissão' ? 'bg-green-100 text-green-800' :
                            record.type === 'Encerramento' ? 'bg-red-100 text-red-800' :
                            record.type === 'Transferência' ? 'bg-blue-100 text-blue-800' :
                            record.type === 'Promoção' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={record.reason}>
                          {record.reason}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {record.type === 'Admissão' && (
                            <button
                              onClick={() => handleEndEmployment(record.id)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                              title="Encerrar admissão"
                              aria-label="Encerrar admissão ativa"
                            >
                              <XMarkIcon className="h-3 w-3 mr-1" />
                              Encerrar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Coluna Direita (40%) - Skills + Status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skills como Tags */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900" id="skills-section">Skills</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2" role="list" aria-labelledby="skills-section">
                  {person.skills?.slice(0, 6).map((skill, index) => (
                    <span
                      key={index}
                      role="listitem"
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      title={`Skill: ${skill}`}
                      tabIndex="0"
                      aria-label={`Skill ${skill}`}
                    >
                      {skill}
                    </span>
                  ))}
                  {person.skills?.length > 6 && (
                    <button 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      aria-label={`Ver mais ${person.skills.length - 6} skills`}
                    >
                      +{person.skills.length - 6} mais
                    </button>
                  )}
                </div>
                {isEditing && (
                  <div className="mt-4">
                    <button 
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      aria-label="Adicionar nova skill"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      Adicionar Skill
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Informações Profissionais Calculadas */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Informações Profissionais</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Nível Atual</span>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {getActiveValue(person.levelHistory)}
                    </span>
                    <LightBulbIcon className="h-4 w-4 text-gray-400 ml-2" title="Campo calculado automaticamente" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Taxa/Hora Atual</span>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      R$ {getActiveValue(person.rateHistory)}
                    </span>
                    <LightBulbIcon className="h-4 w-4 text-gray-400 ml-2" title="Campo calculado automaticamente" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tipo de Contrato</span>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {getContractTypeLabel(getActiveContractType(person))}
                    </span>
                    <LightBulbIcon className="h-4 w-4 text-gray-400 ml-2" title="Campo calculado automaticamente" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Encerramento de Contrato */}
      {isEndingContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Encerrar Contrato</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Encerramento *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelEnd}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log('Encerrando contrato em:', endDate);
                    handleCancelEnd();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Encerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Encerramento de Nível */}
      {isEndingLevel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Encerrar Nível</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Encerramento *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelEnd}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log('Encerrando nível em:', endDate);
                    handleCancelEnd();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Encerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Encerramento de Admissão */}
      {isEndingEmployment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Encerrar Admissão</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Encerramento *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelEnd}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log('Encerrando admissão em:', endDate);
                    handleCancelEnd();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Encerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonDetail;

