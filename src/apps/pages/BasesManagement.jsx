import React, { useState } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const BasesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBase, setEditingBase] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    defaultCalendar: '',
    description: ''
  });

  // Mock data - em produção viria de uma API
  const [bases, setBases] = useState([
    {
      id: 1,
      name: 'Porto Alegre',
      defaultCalendar: 'Padrão Porto Alegre',
      description: 'Base principal no Rio Grande do Sul',
      peopleCount: 12,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'São Paulo',
      defaultCalendar: 'Padrão São Paulo',
      description: 'Base comercial em São Paulo',
      peopleCount: 8,
      createdAt: '2024-02-20'
    },
    {
      id: 3,
      name: 'Mendonça',
      defaultCalendar: 'Padrão Interior',
      description: 'Base de desenvolvimento no interior',
      peopleCount: 4,
      createdAt: '2024-03-10'
    }
  ]);

  const calendars = [
    'Padrão Porto Alegre',
    'Padrão São Paulo', 
    'Padrão Interior',
    'Calendário Flexível',
    'Calendário Reduzido'
  ];

  const filteredBases = bases.filter(base =>
    base.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    base.defaultCalendar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingBase) {
      setBases(bases.map(base => 
        base.id === editingBase.id 
          ? { ...base, ...formData }
          : base
      ));
    } else {
      const newBase = {
        id: Date.now(),
        ...formData,
        peopleCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBases([...bases, newBase]);
    }
    
    setShowModal(false);
    setEditingBase(null);
    setFormData({ name: '', defaultCalendar: '', description: '' });
  };

  const handleEdit = (base) => {
    setEditingBase(base);
    setFormData({
      name: base.name,
      defaultCalendar: base.defaultCalendar,
      description: base.description
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta base?')) {
      setBases(bases.filter(base => base.id !== id));
    }
  };

  const openModal = () => {
    setEditingBase(null);
    setFormData({ name: '', defaultCalendar: '', description: '' });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Bases</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie as bases (cidades) onde as pessoas estão localizadas
            </p>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Base
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou calendário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bases List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Bases Cadastradas ({filteredBases.length})
          </h3>
        </div>
        
        {filteredBases.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma base encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova base.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome da Base
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calendário Padrão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoas
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
                {filteredBases.map((base) => (
                  <tr key={base.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{base.name}</div>
                        {base.description && (
                          <div className="text-sm text-gray-500">{base.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {base.defaultCalendar}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {base.peopleCount} pessoas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(base.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(base)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(base.id)}
                        className="text-red-600 hover:text-red-900"
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
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingBase ? 'Editar Base' : 'Nova Base'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Base *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Porto Alegre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calendário Padrão *
                  </label>
                  <select
                    required
                    value={formData.defaultCalendar}
                    onChange={(e) => setFormData({...formData, defaultCalendar: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um calendário</option>
                    {calendars.map((calendar) => (
                      <option key={calendar} value={calendar}>{calendar}</option>
                    ))}
                  </select>
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
                    placeholder="Descrição opcional da base"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
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
                    {editingBase ? 'Salvar' : 'Criar'}
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

export default BasesManagement;

