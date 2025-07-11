import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ContractsManagement = () => {
  // Estados principais
  const [contracts, setContracts] = useState([
    {
      id: 1,
      name: 'Efetivo',
      dailyHours: 8,
      description: 'Contrato de trabalho efetivo com jornada completa',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Estágio',
      dailyHours: 6,
      description: 'Contrato de estágio com jornada reduzida',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Meio Turno',
      dailyHours: 4,
      description: 'Contrato de meio período',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: 4,
      name: 'Horista',
      dailyHours: 0,
      description: 'Contrato por horas trabalhadas, sem jornada fixa',
      isActive: true,
      createdAt: '2024-01-01'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dailyHours: '',
    description: '',
    isActive: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  // Filtrar contratos baseado na busca
  const filteredContracts = contracts.filter(contract =>
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para abrir modal de criação
  const handleCreate = () => {
    setEditingContract(null);
    setFormData({
      name: '',
      dailyHours: '',
      description: '',
      isActive: true
    });
    setShowModal(true);
  };

  // Função para abrir modal de edição
  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      name: contract.name,
      dailyHours: contract.dailyHours,
      description: contract.description,
      isActive: contract.isActive
    });
    setShowModal(true);
  };

  // Função para salvar contrato
  const handleSave = () => {
    // Validações
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Nome do contrato é obrigatório' });
      return;
    }

    if (formData.dailyHours === '' || formData.dailyHours < 0) {
      setMessage({ type: 'error', text: 'Horas diárias deve ser um número válido (0 ou maior)' });
      return;
    }

    // Verificar se já existe um contrato com o mesmo nome (exceto o que está sendo editado)
    const existingContract = contracts.find(c => 
      c.name.toLowerCase() === formData.name.toLowerCase() && 
      c.id !== editingContract?.id
    );

    if (existingContract) {
      setMessage({ type: 'error', text: 'Já existe um contrato com este nome' });
      return;
    }

    if (editingContract) {
      // Editar contrato existente
      setContracts(contracts.map(contract =>
        contract.id === editingContract.id
          ? { ...contract, ...formData, dailyHours: parseFloat(formData.dailyHours) }
          : contract
      ));
      setMessage({ type: 'success', text: 'Contrato atualizado com sucesso!' });
    } else {
      // Criar novo contrato
      const newContract = {
        id: Date.now(),
        ...formData,
        dailyHours: parseFloat(formData.dailyHours),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setContracts([...contracts, newContract]);
      setMessage({ type: 'success', text: 'Contrato criado com sucesso!' });
    }

    setShowModal(false);
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => setMessage(null), 3000);
  };

  // Função para excluir contrato
  const handleDelete = (contractId) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      setContracts(contracts.filter(contract => contract.id !== contractId));
      setMessage({ type: 'success', text: 'Contrato excluído com sucesso!' });
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Função para alternar status ativo/inativo
  const toggleStatus = (contractId) => {
    setContracts(contracts.map(contract =>
      contract.id === contractId
        ? { ...contract, isActive: !contract.isActive }
        : contract
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Contratos</h1>
        <p className="text-gray-600">Gerencie os tipos de contrato e suas configurações</p>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Barra de ações */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Contrato
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Contratos</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inativos</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => !c.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Média de Horas</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.length > 0 
                  ? (contracts.reduce((sum, c) => sum + c.dailyHours, 0) / contracts.length).toFixed(1)
                  : '0'
                }h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de contratos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contrato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Diárias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {contract.dailyHours === 0 ? 'Variável' : `${contract.dailyHours}h`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={contract.description}>
                      {contract.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(contract.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contract.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {contract.isActive ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(contract)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Editar contrato"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contract.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Excluir contrato"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum contrato encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo tipo de contrato.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Contrato *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Efetivo, Estágio, Freelancer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Diárias *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.dailyHours}
                  onChange={(e) => setFormData({...formData, dailyHours: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 8, 6, 4, 0..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use 0 para contratos sem jornada fixa (ex: Horista)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva as características deste tipo de contrato..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Contrato ativo
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                {editingContract ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsManagement;

