import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  XMarkIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import useAppStore from '../../stores/appStore';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { addProject, currentUser } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    hasSprintSupport: true,
    color: '#3B82F6'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cores predefinidas para projetos
  const projectColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ];

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório';
    }
    
    if (!formData.acronym.trim()) {
      newErrors.acronym = 'Sigla do projeto é obrigatória';
    } else if (formData.acronym.length < 2 || formData.acronym.length > 5) {
      newErrors.acronym = 'Sigla deve ter entre 2 e 5 caracteres';
    } else if (!/^[A-Z]+$/.test(formData.acronym)) {
      newErrors.acronym = 'Sigla deve conter apenas letras maiúsculas';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição do projeto é obrigatória';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }
    
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Data de fim deve ser posterior à data de início';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gerar sigla automaticamente baseada no nome
  const generateAcronym = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 5);
  };

  // Manipular mudança no nome para gerar sigla automaticamente
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      acronym: prev.acronym || generateAcronym(name)
    }));
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newProject = {
        ...formData,
        acronym: formData.acronym.toUpperCase(),
        manager: currentUser,
        members: [currentUser],
        taskCounter: 0
      };
      
      addProject(newProject);
      
      // Redirecionar para a lista de projetos
      navigate('/projects');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      setErrors({ submit: 'Erro ao criar projeto. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Criar Novo Projeto</h1>
                <p className="text-sm text-gray-600">Configure um novo projeto no sistema AGIR</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
              title="Fechar"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-400" />
              Informações Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Projeto *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Sistema de E-commerce"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="acronym" className="block text-sm font-medium text-gray-700 mb-2">
                  Sigla do Projeto *
                </label>
                <input
                  type="text"
                  id="acronym"
                  value={formData.acronym}
                  onChange={(e) => setFormData(prev => ({ ...prev, acronym: e.target.value.toUpperCase() }))}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.acronym ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: SEC"
                  maxLength="5"
                />
                {errors.acronym && <p className="mt-1 text-sm text-red-600">{errors.acronym}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Será usada para gerar IDs das tarefas (ex: {formData.acronym || 'SEC'}-1, {formData.acronym || 'SEC'}-2)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Descreva o objetivo e escopo do projeto..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Cronograma */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
              Cronograma
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status Inicial
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planning">Planejamento</option>
                  <option value="Active">Ativo</option>
                  <option value="On Hold">Em Espera</option>
                  <option value="Completed">Concluído</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-gray-400" />
              Configurações
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasSprintSupport}
                    onChange={(e) => setFormData(prev => ({ ...prev, hasSprintSupport: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Habilitar suporte a Sprints (metodologia ágil)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cor do Projeto
                </label>
                <div className="flex flex-wrap gap-3">
                  {projectColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Criar Projeto
                </>
              )}
            </button>
          </div>

          {errors.submit && (
            <div className="text-center">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;

