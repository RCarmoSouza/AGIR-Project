import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../stores/appStore';
import projectService from '../../services/projectService';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'PROJECT',
    status: 'ACTIVE'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Criando projeto com dados:', formData);
      
      const projectData = {
        ...formData,
        metadata: {
          acronym: formData.acronym,
          color: '#3B82F6',
          hasSprintSupport: true,
          managerId: currentUser?.id || null,
          createdBy: currentUser?.email || 'admin@agir.com'
        }
      };

      const response = await projectService.createProject(projectData);
      console.log('Projeto criado com sucesso:', response);
      
      if (response && response.id) {
        // Redirecionar para o dashboard do projeto criado
        navigate(`/projects/${response.id}/dashboard`);
      } else {
        // Voltar para portfólio se não tiver ID
        navigate('/projects/portfolio');
      }
    } catch (err) {
      console.error('Erro ao criar projeto:', err);
      setError('Erro ao criar projeto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Criar Novo Projeto</h1>
          <p className="text-gray-600 mt-2">Preencha as informações básicas do projeto</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Projeto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Sistema de E-commerce"
            />
          </div>

          <div>
            <label htmlFor="acronym" className="block text-sm font-medium text-gray-700 mb-2">
              Sigla *
            </label>
            <input
              type="text"
              id="acronym"
              name="acronym"
              value={formData.acronym}
              onChange={handleInputChange}
              required
              maxLength="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: SEC"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva o objetivo e escopo do projeto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Fim
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/projects/portfolio')}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Criando...' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;

