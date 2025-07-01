import React, { useState } from 'react';
import { PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import useAppStore from '../stores/appStore';

const Projects = () => {
  const { projects, addProject, currentUser } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    hasSprintSupport: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    color: '#3B82F6'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    addProject({
      ...newProject,
      startDate: new Date(newProject.startDate),
      endDate: newProject.endDate ? new Date(newProject.endDate) : undefined,
      status: 'Planning',
      manager: currentUser,
      members: [currentUser]
    });

    setNewProject({
      name: '',
      description: '',
      hasSprintSupport: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      color: '#3B82F6'
    });
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active': return 'Ativo';
      case 'Planning': return 'Planejamento';
      case 'On Hold': return 'Pausado';
      case 'Completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Gerencie seus projetos e equipes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <span className="text-blue-600 font-bold">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <span className="text-green-600 font-bold">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Planejamento</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'Planning').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <span className="text-yellow-600 font-bold">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <span className="text-purple-600 font-bold">🎉</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Início:</span>
                <span className="font-medium">
                  {new Date(project.startDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {project.endDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Fim:</span>
                  <span className="font-medium">
                    {new Date(project.endDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Gerente:</span>
                <span className="font-medium">{project.manager.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Membros:</span>
                <span className="font-medium">{project.members.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Sprints:</span>
                <span className="font-medium">
                  {project.hasSprintSupport ? 'Habilitado' : 'Desabilitado'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/kanban?project=${project.id}`}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center space-x-1"
              >
                <EyeIcon className="h-4 w-4" />
                <span>Ver Kanban</span>
              </Link>
              <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md">
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Novo Projeto</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Projeto *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do projeto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Descreva o projeto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor do Projeto
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={newProject.color}
                    onChange={(e) => setNewProject({...newProject, color: e.target.value})}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{newProject.color}</span>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sprintSupport"
                  checked={newProject.hasSprintSupport}
                  onChange={(e) => setNewProject({...newProject, hasSprintSupport: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sprintSupport" className="ml-2 text-sm text-gray-700">
                  Habilitar suporte a sprints
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

